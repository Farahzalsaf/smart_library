from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from common.database.database import get_db
from schemas.book import BookSchema
from middleware.auth import get_current_user, admin_required
from middleware.logger import log_user_activity
from common.CRUD.book_crud import *
from common.CRUD.add_booksCrud import similarity_text
from schemas.user import UserPreferenceSchema
from schemas.book import BookSchema

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
    if not book.authors:
        raise HTTPException(status_code=400, detail="Authors must be provided")
    author_names = [author.name for author in book.authors]
    created_book = create_book(db, author_names, book)
    return created_book

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

@router.post("/favorites", response_model=UserPreferenceSchema)
def add_favorite_book(preference: UserPreferenceSchema, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    username = current_user['username']
    existing_favorite = db.query(UserPreference).filter_by(
        username=username, 
        preference_type=preference.preference_type, 
        preference_value=preference.preference_value
    ).first()

    if existing_favorite:
        raise HTTPException(status_code=400, detail="Book already in favorites")

    new_favorite = UserPreference(
        username=username,
        preference_type=preference.preference_type,
        preference_value=preference.preference_value
    )
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.delete("/favorites/{book_id}", response_model=UserPreferenceSchema)
def remove_favorite_book(book_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    username = current_user['username']
    favorite_to_delete = db.query(UserPreference).filter_by(
        username=username, 
        preference_type="favorite_book", 
        preference_value=str(book_id)
    ).first()

    if not favorite_to_delete:
        raise HTTPException(status_code=400, detail="Book not in favorites")

    db.delete(favorite_to_delete)
    db.commit()
    return favorite_to_delete

@router.get("/favorites", response_model=List[BookSchema])
def get_favorite_books(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    username = current_user['username']
    favorite_book_ids = db.query(UserPreference.preference_value).filter_by(
        username=username, preference_type="favorite_book"
    ).all()

    books = db.query(Book).filter(Book.book_id.in_([int(book_id[0]) for book_id in favorite_book_ids])).all()
    return books

@router.get("/books/sorted/rating_desc", response_model=List[BookSchema], tags=["Books"])
def retrieve_books_sorted_by_rating_desc(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = get_books_sorted_by_rating_desc(db, start=start, limit=limit)
    return books

@router.get("/books/sorted/rating_asc", response_model=List[BookSchema], tags=["Books"])
def retrieve_books_sorted_by_rating_asc(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = get_books_sorted_by_rating_asc(db, start=start, limit=limit)
    return books

@router.get("/books/sorted/year_desc", response_model=List[BookSchema], tags=["Books"])
def retrieve_books_sorted_by_year_desc(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = get_books_sorted_by_year_desc(db, start=start, limit=limit)
    return books

@router.get("/books/sorted/year_asc", response_model=List[BookSchema], tags=["Books"])
def retrieve_books_sorted_by_year_asc(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = get_books_sorted_by_year_asc(db, start=start, limit=limit)
    return books

@router.get("/books/sorted/trending", response_model=List[BookSchema], tags=["Books"])
def retrieve_trending_books_route(start: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = get_trending_books(db, start=start, limit=limit)
    return books

@router.get("/books/sorted/recommended", response_model=List[BookSchema], tags=["Recommendations"])
def retrieve_recommended_books_route(start: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    books = get_recommended_books(db, current_user["username"], start=start, limit=limit)
    return books