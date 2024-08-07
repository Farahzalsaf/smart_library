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
    try:
        results = collection.query(
            query_texts=[query_text],
            n_results=2,
            include=['metadatas', 'documents']
        )
        print(f"Query results: {results}")

        if 'metadatas' not in results or 'documents' not in results:
            print("Unexpected result format. Missing keys.")
            return [], []

        metadatas = results['metadatas']
        documents = results['documents']

        if not metadatas or not documents:
            print("No similar documents found.")
            return [], []

        return metadatas, documents
    except Exception as e:
        print(f"An error occurred during the query: {e}")
        return [], []
