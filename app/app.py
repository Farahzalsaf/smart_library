from fastapi import FastAPI# type: ignore
from routes import users, books, authors
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

@app.get("/health_check")
def health_check():
        return {"message": "API is running"}
