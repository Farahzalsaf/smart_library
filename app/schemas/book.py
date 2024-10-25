from pydantic import BaseModel, Field
from typing import Optional, List
from schemas.author import AuthorSchema

class BookSchema(BaseModel):
    book_id: Optional[int] = None
    title: str
    subtitle: Optional[str] = None
    published_year: Optional[int] = None
    average_rating: Optional[float] = None
    num_pages: Optional[int] = None
    ratings_count: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    authors:List[AuthorSchema]

    class Config:
        from_attirbutes = True