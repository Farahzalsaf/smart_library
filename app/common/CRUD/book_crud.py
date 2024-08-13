from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from typing import List
from common.database.models import Book, Author, UserPreference , author_association_table
from schemas.book import BookSchema 
from common.CRUD.author_crud import *
from common.CRUD.add_booksCrud import *
import logging


def get_books(db: Session):
    return db.query(Book).options(joinedload(Book.authors)).all()

def get_book_by_id(db: Session, book_id: int):
    return db.query(Book).filter(Book.book_id == book_id).first()

def get_book_by_title(db: Session, title: str):
    book = db.query(Book).filter(Book.title.ilike(f"%{title}%")).first()
    if book:
        book_dict = book.__dict__
        author_list = [author.name for author in book.authors]
        book_dict['authors'] = author_list  
        return BookSchema(**book_dict)
    return None

def search_books(db: Session, query: str) -> List[BookSchema]:
    books = db.query(Book).filter(Book.title.ilike(f"%{query}%")).all()
    return [BookSchema.model_validate(book) for book in books]

def create_book(db: Session, authors: List[str], book_data: BookSchema):
    book_dict = book_data.model_dump()
    author_instances = []
    for author_name in authors:
        author_instance = create_or_get_author(db, author_name)
        author_instances.append(author_instance)
    if 'authors' in Book.__table__.columns:
        book_dict['authors'] = author_instances
    valid_keys = {column.name for column in Book.__table__.columns}
    book_dict = {k: v for k, v in book_dict.items() if k in valid_keys}
    logging.debug("Filtered Book data: %s", book_dict)

    try:
        db_book = Book(**book_dict)
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        add_book_to_vectorDB(db_book.title, ', '.join(authors), db_book.category, db_book.description, db_book.thumbnail)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Book already exists")

    return db_book

def update_book(db: Session, book_id: int, book: BookSchema):
    db_book = db.query(Book).filter(Book.book_id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db_book.title = book.title
    db_book.subtitle = book.subtitle
    db_book.published_year = book.published_year
    db_book.average_rating = book.average_rating
    db_book.num_pages = book.num_pages
    db_book.ratings_count = book.ratings_count
    db_book.category = book.category
    db_book.description = book.description
    db_book.thumbnail = book.thumbnail

    try:
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Book already exists")

    return db_book

def delete_book(db: Session, book_id: int):
    db_book = db.query(Book).filter(Book.book_id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}

def get_recommended_books(db: Session, username: str) -> List[Book]:
    user_preferences = db.query(UserPreference).filter(UserPreference.username == username).all()
    preferred_genres = [pref.preference_value for pref in user_preferences if pref.preference_type == "genre"]

    if not preferred_genres:
        raise ValueError("No preferred genres found for user")

    recommended_books = db.query(Book).filter(Book.genre.in_(preferred_genres)).all()

    if not recommended_books:
        raise ValueError("No books found for preferred genres")

    return recommended_books

def associate_book_with_author(db: Session, book_title: str, author_name: str):
    book = get_book_by_title(db, book_title)
    author = get_author_by_name(db, author_name)

    if not book:
        raise ValueError(f"Book with title '{book_title}' not found.")

    if not author:
        raise ValueError(f"Author with name '{author_name}' not found.")
    association_exists = db.query(author_association_table).filter_by(book_id=book.book_id, author_id=author.author_id).first()
    if association_exists:
        return 
    db.execute(author_association_table.insert().values(book_id=book.book_id, author_id=author.author_id))
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise e

def add_favorite_book(db: Session, username: str, book_id: int):
    existing_favorite = db.query(UserPreference).filter_by(
        username=username, preference_type="favorite_book", preference_value=str(book_id)
    ).first()

    if existing_favorite:
        raise HTTPException(status_code=400, detail="Book already in favorites")
    new_favorite = UserPreference(
        username=username,
        preference_type="favorite_book",
        preference_value=str(book_id)
    )
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

def remove_favorite_book(db: Session, username: str, book_id: int):
    favorite_to_delete = db.query(UserPreference).filter_by(
        username=username, preference_type="favorite_book", preference_value=str(book_id)
    ).first()

    if not favorite_to_delete:
        raise HTTPException(status_code=400, detail="Book not in favorites")

    db.delete(favorite_to_delete)
    db.commit()
    return {"message": "Book removed from favorites"}

def get_favorite_books(db: Session, username: str):
    favorite_book_ids = db.query(UserPreference.preference_value).filter_by(
        username=username, preference_type="favorite_book"
    ).all()
    books = db.query(Book).filter(Book.book_id.in_([int(book_id[0]) for book_id in favorite_book_ids])).all()
    return books

class Config:
        from_attirbutes = True