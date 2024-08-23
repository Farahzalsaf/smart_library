from fastapi import HTTPException
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from pydantic import BaseModel, Field
from common.CRUD.add_booksCrud import similarity_text
from sqlalchemy.orm import Session
import json
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnablePassthrough
from common.CRUD.book_crud import create_book
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langgraph.graph import Graph, StateGraph, START, END
from langchain_community.chat_models import ChatOllama
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from typing import List, Literal, TypedDict
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser,PydanticOutputParser,JsonOutputParser, MarkdownListOutputParser

def get_session_history(session_id):
    return SQLChatMessageHistory(session_id, "sqlite:///memory.db")

# # Setup LLM and Prompts
# local_llm = "llama3.1"
# llm = ChatOllama(model=local_llm, format="json", temperature=0)

# # Question Router Prompt
# router_prompt = PromptTemplate(
#     template="""You are an expert at routing a user question to a vectorstore or postgres database. 
#     Use the vectorstore or the postgres database for questions on LLM agents, prompt engineering, and adversarial attacks. 
#     Otherwise, say you do not have the information. Give a binary choice 'postgres' or 'vectorstore' based on the question.
#     Return a JSON with a single key 'datasource'.""",
#     input_variables=["question"],
# )

# question_router = router_prompt | llm | JsonOutputParser()

# # Hallucination Grader Prompt
# hallucination_grader_prompt = PromptTemplate(
#     template="""You are a grader assessing whether an answer is grounded in / supported by a set of facts. 
#     Here are the facts:
#     \n ------- \n
#     {documents} 
#     \n ------- \n
#     Here is the answer: {generation}
#     Give a binary score 'yes' or 'no' score to indicate whether the answer is grounded in / supported by a set of facts. 
#     Provide the binary score as a JSON with a single key 'score'.""",
#     input_variables=["generation", "documents"],
# )

# hallucination_grader = hallucination_grader_prompt | llm | JsonOutputParser()

# # Answer Grader Prompt
# answer_grader_prompt = PromptTemplate(
#     template="""You are a grader assessing whether an answer is useful to resolve a question. 
#     Here is the answer:
#     \n ------- \n
#     {generation} 
#     \n ------- \n
#     Here is the question: {question}
#     Give a binary score 'yes' or 'no' to indicate whether the answer is useful to resolve a question. 
#     Provide the binary score as a JSON with a single key 'score'.""",
#     input_variables=["generation", "question"],
# )

# answer_grader = answer_grader_prompt | llm | JsonOutputParser()

# # Graph State
# class GraphState(TypedDict):
#     question: str
#     generation: str
#     documents: List[str]

# # Session management
# store = {}

# def get_session_history(session_id: str) -> BaseChatMessageHistory:
#     if session_id not in store:
#         store[session_id] = InMemoryChatMessageHistory()
#     return store[session_id]

# def detect_intent(query: str) -> str:
#     query_lower = query.lower()
#     if "add book" in query_lower:
#         return "add_book"
#     elif "recommend books" in query_lower:
#         return "get_recommendations"
#     elif "summary" in query_lower:
#         return "get_summary"
#     elif "information" in query_lower:
#         return "information"
#     elif "chitchat" in query_lower:
#         return "chitchat"
#     else:
#         return "unknown"

# def retrieve(state: GraphState):
#     question = state["question"]
    
#     # Use similarity_text to refine the query before retrieving documents
#     refined_question = similarity_text(question)
    
#     source = question_router.invoke({"question": refined_question})
#     datasource = source["datasource"]

#     if datasource == "vectorstore":
#         # Retrieve from Chroma
#         documents = retriever.get_relevant_documents(refined_question)
#     elif datasource == "postgres":
#         # Retrieve from Postgres (implement your own logic here)
#         documents = []  # Your PostgreSQL retrieval logic here
#     else:
#         raise ValueError("Unknown datasource")

#     return {"documents": documents, "question": refined_question}

# def generate(state: GraphState):
#     question = state["question"]
#     documents = state["documents"]

#     prompt = ChatPromptTemplate.from_messages([
#         ("system", "You are an AI Library assistant. Your job is to help the user with their needs..."),
#         ("human", question),
#     ])

#     rag_chain = (
#         RunnablePassthrough()
#         | (lambda x: {"context": documents, "question": question})
#         | prompt
#         | llm
#         | StrOutputParser()
#     )
    
#     generation = rag_chain.invoke({"context": documents, "question": question})
#     return {"documents": documents, "question": question, "generation": generation}

# def grade_generation_v_documents_and_question(state: GraphState):
#     question = state["question"]
#     documents = state["documents"]
#     generation = state["generation"]

#     # Check if the generation is grounded in the documents
#     hallucination_score = hallucination_grader.invoke({"documents": documents, "generation": generation})
    
#     if hallucination_score["score"] == "yes":
#         # Check if the generation is useful to the question
#         answer_score = answer_grader.invoke({"question": question, "generation": generation})
#         if answer_score["score"] == "yes":
#             return "useful"
#         else:
#             return "not useful"
#     else:
#         return "not supported"

# def generate_response(system_prompt: str, session_id: str, query: str):
#     history = get_session_history(session_id)
#     response = generate({"question": query, "documents": []})
#     history.add_messages([
#         HumanMessage(content=query),
#         AIMessage(content=response["generation"])
#     ])
#     return response["generation"]

# def generate_intent(db: Session, session_id: str, query: str):
#     workflow = Graph()
#     intent = detect_intent(query)
    
#     if intent == "add_book":
#         add_book_prompt = "Let's add a new book to the database. Provide the title, author, and description."
#         book_info = generate_response(add_book_prompt, session_id, query)
#         try:
#             book_info = json.loads(book_info)
#         except json.JSONDecodeError:
#             raise HTTPException(status_code=400, detail="Failed to parse book information JSON")
        
#         result = create_book(db, book_info.get('authors', []), book_info)
#         return workflow.add_node(action="Add Book", result="Book added successfully!")
    
#     elif intent == "get_recommendations":
#         recommendation_prompt = "Tell me your preferred genre. I'll recommend some books."
#         response = generate_response(recommendation_prompt, session_id, query)
#         return workflow.add_node(action="Recommend Books", result=response)
    
#     elif intent == "get_summary":
#         summary_prompt = "Specify the book for a brief summary."
#         response = generate_response(summary_prompt, session_id, query)
#         return workflow.add_node(action="Provide Summary", result=response)

#     elif intent == "information":
#         information_prompt = "Please specify the book or author."
#         response = generate_response(information_prompt, session_id, query)
#         return workflow.add_node(action="Provide Information", result=response)
    
#     elif intent == "chitchat":
#         chitchat_prompt = "Let's chat! What's on your mind today?"
#         response = generate_response(chitchat_prompt, session_id, query)
#         return workflow.add_node(action="Chitchat", result=response)

#     else:
#         default_prompt = "I'm not sure how to assist. Can you clarify?"
#         response = generate_response(default_prompt, session_id, query)
#         return workflow.add_node(return_values={"message": response}, log="Handled default case")

# # Setup workflow
# workflow = StateGraph(GraphState)
# workflow.add_node("retrieve", retrieve)
# workflow.add_node("generate", generate)
# workflow.add_node("grade_generation", grade_generation_v_documents_and_question)
# workflow.add_edge(START, "retrieve")
# workflow.add_edge("retrieve", "generate")
# workflow.add_edge("generate", "grade_generation")
# workflow.add_conditional_edges(
#     "grade_generation",
#     lambda state: grade_generation_v_documents_and_question(state),
#     {
#         "useful": END,
#         "not useful": "generate",
#         "not supported": "retrieve",
#     },
# )


local_llm = "Llama3.1"


class RouteQuery(BaseModel):
      classification: Literal["general_inquiry", "add_book","search_by_title", "search_by_author","search_by_genre", "books_in_specific_year","books_with_rating_count","books_with_rating_average","summarize_book","book_thumbnail","title_from_description" ,"recommendation"] = Field(
        ...,
        description="Given a user question, choose to route it to one of the specified classifications.")



class Grader(BaseModel):
    score: Literal["yes", "no"] = Field(..., description = "Given a generation and a set of documents, provide a binary score to indicate whether the generation is grounded in / supported by the documents.")


def classification(system_prompt, query):
    parser = PydanticOutputParser(pydantic_object = RouteQuery)
    prompt = PromptTemplate(template = system_prompt, input_variables = ["query"])
    prompt = prompt.partial(format_instructions = parser.get_format_instructions())
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)

    question_router = prompt | llm | parser

    response = question_router.invoke({"query": query})

    classification = response.classification
    return classification

def model(system_prompt, query):
    prompt = PromptTemplate(
        template= system_prompt,
        input_variables=[query]
    )

    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)

    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({"query": query})

    return response

def rag(system_prompt,query,documents):
    prompt = PromptTemplate(
        template= system_prompt,
        input_variables=[query]
    )
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)
    rag_chain = prompt | llm | StrOutputParser()

    response = rag_chain.invoke({"query": query, "documents": documents})
    return response

def retrieval_grader_model(query, documents):
    parser = PydanticOutputParser(pydantic_object=Grader)
    prompt = PromptTemplate(
        template= """ 
            You are a grader assessing relevance of a retrieved documents to a user query.  
            If the documents contains keywords related to the user query, grade it as relevant. 
            It does not need to be a stringent test. The goal is to filter out erroneous retrievals. 
            Give a binary score 'yes' or 'no' score to indicate whether the documents is relevant to the query. 
            Provide the binary score as a JSON with a single key 'score' and no premable or explanation.
            
            
            Here is the retrieved documents:  
            {documents} 


            Here is the user query: 
            {query} 

            """,
        input_variables=["query","documents"]
    )
    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)
    retrieval_grader = prompt | llm | parser
    response= retrieval_grader.invoke({"query": query, "documents": documents})
    return response

def hallucination_grader_model(documents,generation):
    parser = PydanticOutputParser(pydantic_object=Grader)
    prompt = PromptTemplate(
        template= """
        You are a grader tasked with evaluating whether the given answer is based on and supported by the provided facts.
        Determine if the answer accurately reflects the facts. 
        If it does, respond with 'yes'. If it does not, respond with 'no'.
        Provide your response as a JSON object with a single key 'score' with no additional text.

        Below are the facts:
        {documents} 

        Below is the answer:
        {generation}

        """,
        input_variables=["documents","generation"]
    )
    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)
    rag_chain = prompt | llm | parser
    response= rag_chain.invoke({"documents": documents, "generation": generation})
    return response

def answer_grader_model(query,generation):
    parser = PydanticOutputParser(pydantic_object=Grader)
    prompt = PromptTemplate( 
        template= """ 
        You are a grader assessing whether an answer is useful to resolve a user query.  
        Give a binary score 'yes' or 'no' to indicate whether the answer is useful to resolve a user query. \n
        Provide the binary score as a JSON with a single key 'score' and no preamble or explanation.
        

        Here is the answer:
        {generation} 

    
        Here is the user query: 
        {query}
        
        """,
        input_variables=["generation","query"]
    )
    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)
    rag_chain = prompt | llm | parser
    response= rag_chain.invoke({"generation": generation, "query": query})
    return response

def query_keywords(query):
    prompt = PromptTemplate( 
        template= """ 
        You are expert in identifying books information keywords in the query.
        To optimiz the result of the vectorstore retrieval. 
        Return list format of the keywords you found.
        Do not add additional information.
        
        Here is the user query: {query}. 
        
        """,
        input_variables=["query"]
    )
    llm = OllamaLLM(model = local_llm, format = "json", temperature = 0)
    rag_chain = prompt | llm | StrOutputParser()
    response= rag_chain.invoke({"query": query})
    return response

def query_rewriter_model(query):
    prompt = PromptTemplate( 
        template= """ 
        You are query re-writer that rewrite an user query by taking the keywords in the user query.
        To make a better version that is optimized for vectorstore retrieval. 
        Look at the initial and formulate an improved query.
        
        
        Here is the user query: {query}. 
        
        """,
        
        input_variables=["query"]
        
    )
    llm = OllamaLLM(model=local_llm, format = "json", temperature = 0)
    rag_chain = prompt | llm | StrOutputParser()
    response= rag_chain.invoke({"query": query})
    return response
