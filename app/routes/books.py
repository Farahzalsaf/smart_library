from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from common.database.database import get_db
from schemas.book import BookSchema
from middleware.auth import get_current_user, admin_required
from middleware.logger import log_user_activity
from common.CRUD.book_crud import *
from common.CRUD.add_booksCrud import similarity_text

router = APIRouter()

@router.get("/books", response_model=List[BookSchema], tags=["Books"], operation_id="get_books_list")
def get_books_route(db: Session = Depends(get_db)):
    return get_books(db)

@router.get("/books/{book_id}", response_model=BookSchema, tags=["Books"], operation_id="get_book_by_id")
def get_book_route(book_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    formatted_book = {
        "id": book.book_id,
        "title": book.title,
        "authors": [author.name for author in book.authors],  # Ensure authors are strings
        "thumbnail": book.thumbnail,
        "description": book.description,
    }
    return formatted_book

@router.post("/books", response_model=BookSchema, tags=["Books"], operation_id="create_book_record")
def create_book_route(book: BookSchema, db: Session = Depends(get_db), current_user: dict = Depends(admin_required)):
    log_user_activity(db, current_user['username'], "Book creation")
    return create_book(db, book)

@router.put("/books/{book_id}", response_model=BookSchema, tags=["Books"], operation_id="update_book_record")
def update_book_route(book_id: int, book: BookSchema, db: Session = Depends(get_db), current_user: dict = Depends(admin_required)):
    log_user_activity(db, current_user['username'], "Book update")
    return update_book(db, book_id, book)

@router.delete("/books/{book_id}", tags=["Books"])
def delete_book_route(book_id: int, db: Session = Depends(get_db), current_user: dict = Depends(admin_required)):
    log_user_activity(db, current_user['username'], "Book deletion")
    return delete_book(db, book_id)

@router.get("/recommendations", response_model=List[BookSchema], tags=["Recommendations"])
def get_recommended_books_route(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        log_user_activity(db, current_user['username'], "Viewed their recommendations")
        return get_recommended_books(db, current_user["username"])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/books/search/similarity/{user_query}")
def get_book_similarity(user_query: str, db: Session = Depends(get_db)): #current_user: dict = Depends(get_current_user)):
    similarity_text_result = similarity_text(user_query)
    if not similarity_text_result:
        raise HTTPException(status_code=404, detail="No similar books found.")
    #log_user_activity(db, current_user['username'], f"Searched for book with query: {user_query}")
    return {"results": similarity_text_result}
