from fastapi import HTTPException
from langchain_ollama.llms import OllamaLLM
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate
from common.CRUD.add_booksCrud import similarity_text
from sqlalchemy.orm import Session
import json
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.runnables import RunnablePassthrough
from common.CRUD.book_crud import create_book
from langchain_community.chat_message_histories import SQLChatMessageHistory
from langchain_core.agents import AgentAction, AgentFinish
from langchain_core.output_parsers import StrOutputParser

def get_session_history(session_id):
    return SQLChatMessageHistory(session_id, "sqlite:///memory.db")

class Intents:
    ADD_BOOK = "add_book"
    GET_RECOMMENDATIONS = "get_recommendations"
    GET_SUMMARY = "get_summary"
    INFORMATION = "information"
    CHITCHAT = "chitchat"
    UNKNOWN = "unknown"

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

def detect_intent(query: str) -> str:
    query_lower = query.lower()
    if "add book" in query_lower or "new book" in query_lower:
        return Intents.ADD_BOOK
    elif "recommend books" in query_lower or "book recommendations" in query_lower:
        return Intents.GET_RECOMMENDATIONS
    elif "summary" in query_lower or "book summary" in query_lower:
        return Intents.GET_SUMMARY
    elif "information" in query_lower:
        return Intents.INFORMATION
    elif "chitchat" in query_lower or "small talk" in query_lower:
        return Intents.CHITCHAT
    else:
        return Intents.UNKNOWN

def generate_cntxt(system_prompt: str, session_id: str, query: str) -> str:
    history = get_session_history(session_id)
    llm = OllamaLLM(model="llama3.1")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI Library assisntant and your name is lucky, your job is to help the user with their needs whether it is adding a book to the database, getting a summary of a book, getting information about a certain book, you can also chitchat with the user when it is applicable. Do not deviaite subjects from the user's intent. "),
        ("human", query),
    ])
    
    context = similarity_text(query)
    
    rag_chain = (
        RunnablePassthrough()
        | (lambda x: {"context": context, "query": query, "system_prompt": system_prompt})
        | prompt
        | llm
        | StrOutputParser()
    )
    
    response = rag_chain.invoke({"query": query})
    history.add_messages([
        HumanMessage(content=query),
        AIMessage(content=response)
    ])
    return response if isinstance(response, str) else json.dumps(response)

def generate_response(system_prompt: str, session_id: str, query: str) -> str:
    history = get_session_history(session_id)
    llm = OllamaLLM(model="llama3.1")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an AI Library assisntant and your name is lucky, your job is to help the user with their needs whether it is adding a book to the database, getting a summary of a book, getting information about a certain book, you can also chitchat with the user when it is applicable. Do not deviaite subjects from the user's intent. "),
        ("human", query),
    ])
    
    chain = prompt | llm | StrOutputParser()
    response = chain.invoke({"title": query})
    history.add_messages([
        HumanMessage(content=query),
        AIMessage(content=response)
    ])
    return response if isinstance(response, str) else json.dumps(response)

def generate_intent(db: Session, session_id: str, query: str):
    intent = detect_intent(query)
    
    if intent == Intents.ADD_BOOK:
        add_book_prompt = "Let's add a new book to the database. Please provide the title, author, categories, and a brief description of the book."
        book_info = generate_response(add_book_prompt, session_id, query)
        try:
            book_info = json.loads(book_info)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Failed to parse book information JSON")
        
        result = create_book(db, book_info.get('authors', []), book_info)
        return AgentAction(action="Add Book", result="The book has been added successfully! Is there anything else I can assist you with?")
    
    elif intent == Intents.GET_RECOMMENDATIONS:
        recommendation_prompt = "Can you tell me your preferred genre or interests? I'll recommend five books based on your preferences."
        response = generate_cntxt(recommendation_prompt, session_id, query)
        return AgentAction(action="Recommend Books", result=response)
    
    elif intent == Intents.GET_SUMMARY:
        summary_prompt = "Could you specify the book you're interested in? I'll provide a brief summary of it."
        response = generate_cntxt(summary_prompt, session_id, query)
        return AgentAction(action="Provide Summary", result=response)

    elif intent == Intents.INFORMATION:
        information_prompt = "Please specify the book or author you want information about. I'll provide detailed information based on our database."
        response = generate_cntxt(information_prompt, session_id, query)
        return AgentAction(action="Provide Information", result=response)
    elif intent == Intents.CHITCHAT:
        chitchat_prompt = "Let's have a chat! What's on your mind today?"
        response = generate_cntxt(chitchat_prompt, session_id, query)
        return AgentAction(action="Chitchat", result=response)

    else:
        default_prompt = "I'm not sure how to assist you with that. Can you please provide more details?"
        response = generate_cntxt(default_prompt, session_id, query)
        return AgentFinish(return_values={"message": response}, log="Handled default case")