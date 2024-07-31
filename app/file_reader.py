import pandas as pd
from sqlalchemy.orm import Session
from common.CRUD.book_crud import *
from common.CRUD.author_crud import *
from common.database.database import session_local
from schemas.author import AuthorSchema
from schemas.book import BookSchema

def process_csv(file_path: str, db: Session):
    df = pd.read_csv(file_path, usecols=['title', 'subtitle', 'thumbnail', 'authors', 'categories', 'published_year', 'description', 'average_rating', 'num_pages', 'ratings_count'])

    for index, row in df.iterrows():
        title = row['title']
        subtitle = row['subtitle']
        author_names = row['authors'].split(';') if pd.notna(row['authors']) else []
        category = row['categories'] if pd.notna(row['categories']) else "Unknown Genre"
        published_year = row['published_year'] if pd.notna(row['published_year']) else None
        description = row['description'] if pd.notna(row['description']) else "No description available."
        average_rating = float(row['average_rating']) if pd.notna(row['average_rating']) else None
        num_pages = int(row['num_pages']) if pd.notna(row['num_pages']) else None
        ratings_count = int(row['ratings_count']) if pd.notna(row['ratings_count']) else None
        thumbnail = row['thumbnail'] if pd.notna(row['thumbnail']) else None

        # Create or retrieve the book
        book_data = BookSchema(
            title=title,
            subtitle=subtitle,
            category=category,
            published_year=published_year,
            description=description,
            average_rating=average_rating,
            num_pages=num_pages,
            ratings_count=ratings_count,
            thumbnail=thumbnail
        )
        db_book = create_book(db, author_names, book_data)

        # Create authors and associate them with the book
        for author_name in author_names:
            # Check if author exists
            db_author = get_author_by_name(db, author_name)
            if not db_author:
                author_data = AuthorSchema(name=author_name, biography=None)
                db_author = create_author(db, author_data)

            # Associate the author with the book
            associate_book_with_author(db, title, author_name)

# Ensure to manage sessions properly
try:
    db_session = session_local()
    process_csv('/Users/falsafwan002/Desktop/smart-library/smart-library/app/books_cleaned.csv', db_session)
    db_session.commit()  # Commit transactions
except Exception as e:
    db_session.rollback()  # Rollback in case of error
    print(f"Error occurred: {e}")
finally:
    db_session.close()
