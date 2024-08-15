import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../StarRating/StarRating';
import HeartToggle from '../Button/likeIcon';
import './BookCard.module.css';

const BookCard = ({ book, isFavorite, toggleFavorite }) => {
  const authorsList = Array.isArray(book.authors)
    ? book.authors.map(author => typeof author === 'object' ? author.name : author)
    : [book.authors];

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
                  bookId={book.book_id} 
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

BookCard.propTypes = {
  book: PropTypes.shape({
    book_id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    title: PropTypes.string.isRequired,
    authors: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string,
        })
      ])), 
      PropTypes.string,
    ]).isRequired,
    published_year: PropTypes.number,
    category: PropTypes.string,
    average_rating: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default BookCard;
