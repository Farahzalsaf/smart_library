from pydantic import BaseModel
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings

class Book(BaseModel):
    title: str
    authors: str
    categories: str
    description: str
    thumbnail: str


client = chromadb.PersistentClient(
    path="/Users/falsafwan002/Desktop/smart-library/smart-library/chroma_db", 
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)
collection = client.get_or_create_collection(name="books")




