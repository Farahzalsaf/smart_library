import React from 'react';
import StarRating from '../StarRating/StarRating';
import HeartToggle from '../Button/likeIcon';
import './BookCard.module.css';

interface Author {
  name: string;
}

interface Book {
  book_id: string;
  thumbnail?: string;
  title: string;
  authors?: string | string[] | Author[];
  published_year?: number;
  category?: string;
  average_rating?: number;
  description?: string;
}

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFavorite, toggleFavorite }) => {
  // Ensure authors is defined and has a default value if not present
  const authorsList = Array.isArray(book.authors)
    ? book.authors.map(author => typeof author === 'object' ? author.name : author)
    : [book.authors || "Unknown Author"];

  return (
    <div className="book-item">
      <div className="card-container">
        <div className="card">
          <div className="card-front">
            <div className="card-header">
              <h2 className="book-title">{book.title}</h2>
              <div className="card-details">
                <span className="author">
                  {authorsList.length > 0 
                    ? authorsList.join(", ")
                    : "Unknown Author"}
                </span>
                <span className="year">{book.published_year || "Unknown Year"}</span>
              </div>
              <div className="favorite-icon">
                <HeartToggle 
                  isFavorite={isFavorite} 
                  toggleFavorite={toggleFavorite} 
                />
              </div>
            </div>
            <div className="card-image">
              {book.thumbnail ? (
                <img src={book.thumbnail} alt={book.title} />
              ) : (
                <div className="no-thumbnail">No Image Available</div>
              )}
            </div>
            <div className="card-footer">
              <span className="genre">
                Genre: {book.category || 'Unknown'}
              </span>
              <div className="rating">
                <StarRating rating={book.average_rating || 0} />
                <span> {book.average_rating !== undefined ? book.average_rating : "N/A"}</span>
              </div>
            </div>
          </div>
          <div className="book-description">
            <p>{book.description || "No description available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
