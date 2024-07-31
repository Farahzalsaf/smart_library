from sentence_transformers import SentenceTransformer
from common.database.vectorstore import collection

def add_book_to_vectorDB(title, authors, categories, description, thumbnail):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    text = f"{title} {authors} {categories} {description}"
    embedding = model.encode(text).tolist()
    metadata = {
        'title': title,
        'authors': authors,
        'categories': categories,
        'description': description,
        'thumbnail': thumbnail
    }
    collection.add(
        documents=[text],
        embeddings=[embedding],
        ids=[title],
        metadatas=[metadata]
    )
    return "Book added to vector store successfully."

def similarity_text(query_text: str):
    print(f"Querying for text: {query_text}")
    results = collection.query(
        query_texts=[query_text],
        n_results=2,
        include=['metadatas', 'documents']
    )
    print(f"Query results: {results}")
    return results['metadatas'], results['documents']
