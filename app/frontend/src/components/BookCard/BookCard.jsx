import React from 'react';
import PropTypes from 'prop-types';

const BookCard = ({ book }) => {
  return (
    <div className="book-item">
      <div className="card">
        <div className="card-header">
          <h2 className="book-title">{book.title}</h2>
          <div className="card-details">
            <span className="author">by: {book.authors}</span>
            <span className="year">Published: {book.published_year}</span>
          </div>
          <div className="favorite-icon">
            {/* Heart Icon SVG */}
            <svg
              width="24" 
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Heart SVG path data */}
            </svg>
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
          <span className="genre">genre: {book.category}</span>
          <div className="rating">
            {/* Star Icon SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Star SVG path data */}
            </svg>
            <span>{book.average_rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    thumbnail: PropTypes.string,
    title: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    published_year: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    average_rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default BookCard;
