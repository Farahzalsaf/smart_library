from fastapi import Depends, FastAPI, HTTPException# type: ignore
from common.database.database import get_db
from schemas.user import ChatRequest
from services.langgraph import graph
from routes import users, books, authors
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.include_router(users.router)
app.include_router(books.router)
app.include_router(authors.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Simple User API"}

@app.post("/chat")
def chat_with_model(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        response = graph(request.query)
        return {"response": response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health_check")
def health_check():
        return {"message": "API is running"}

