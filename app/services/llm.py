import contextlib
import sys
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.messages import HumanMessage, AIMessage
from common.CRUD.add_booksCrud import similarity_text
from langchain_core.runnables.history import BaseChatMessageHistory
from langchain_core.messages import BaseMessage
from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List



template = """Question: {question}

Answer: Let's think step by step."""

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI bot named Lucky. You are designed to assist users with book data."),
    ("system", "Identify the user's intent based on their input—whether they are trying to engage in casual conversation, add a book, get information, or get a summary of a certain book."),
    ("system", "If the user is engaging in casual conversation, respond appropriately and continue the conversation. Do NOT mention book data unless the user specifically asks for it."),
    ("system", "If the user is trying to add a book, ask for the title, author, categories, and description of the book, then add it to the database."),
    ("system", "If the user is trying to get information, retrieve the book data from the database and provide it to the user."),
    ("system", "If the user is trying to get a summary of a certain book, retrieve the book data from the database and provide the description and the category of the book to the user."),
    ("system", "Recognize when a user is replying to your response and continue the conversation accordingly."),
    ("human", "Hello, how are you doing?"),
    ("ai", "I'm doing well, thanks! How can I assist you with book data today?"),
    ("human", "{user_input}")
])


model = OllamaLLM(model="llama3.1")

chain = prompt | model

def generate_response(session_id: str, user_input: str):
    history = get_session_history(session_id)
    
    metadatas, documents = similarity_text(user_input)
    
    vector_info = "\n".join(
        [
            f"Title: {meta['title']}, Author: {meta['authors']}, Categories: {meta['categories']}, Description: {meta['description']}"
            for sublist in metadatas
            for meta in sublist
        ]
    )
    prompt_with_vector_info = f"User asked: {user_input}\n\nVector Database Results:\n{vector_info}\n\nAI Answer:"
    response = chain.invoke({"user_input": prompt_with_vector_info})

    # Add messages to history
    history.add_messages([
        HumanMessage(content=user_input),
        AIMessage(content=response)
    ])

    return response



class InMemoryHistory(BaseChatMessageHistory, BaseModel):
    """In memory implementation of chat message history."""

    messages: List[BaseMessage] = Field(default_factory=list)

    def add_messages(self, messages: List[BaseMessage]) -> None:
        """Add a list of messages to the store"""
        self.messages.extend(messages)

    def clear(self) -> None:
        self.messages = []

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryHistory()
    return store[session_id]



class Intents:
    ADD_BOOK = "add_book"
    GET_RECOMMENDATIONS = "get_recommendations"
    GET_SUMMARY = "get_summary"
    UNKNOWN = "unknown"

def detect_intent(query):
    query_lower = query.lower()
    if "add book" in query_lower or "new book" in query_lower:
        return Intents.ADD_BOOK
    elif "recommend books" in query_lower or "book recommendations" in query_lower:
        return Intents.GET_RECOMMENDATIONS
    elif "summary" in query_lower or "book summary" in query_lower:
        return Intents.GET_SUMMARY
    else:
        return Intents.UNKNOWN


def detect_intent(query):
    intent = intent_graph.match(query)
    return intent if intent else Intents.UNKNOWN
