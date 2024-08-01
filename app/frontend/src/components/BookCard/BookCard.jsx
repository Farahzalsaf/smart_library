import React from 'react';
import PropTypes from 'prop-types';
import StarRating from '../StarRating/StarRating';
import HeartToggle from '../Button/likeIcon';
import './BookCard.module.css'; // Ensure the CSS file is imported

const BookCard = ({ book }) => {
  return (
    <div className="book-item">
      <div className="card-container">
        <div className="card">
          <div className="card-front">
            <div className="card-header">
              <h2 className="book-title">{book.title}</h2>
              <div className="card-details">
                <span className="author">{book.authors.map(author => author.name).join(", ")}</span>
                <span className="year">{book.published_year}</span>
              </div>
              <div className="favorite-icon">
                <HeartToggle />
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
              <span className="genre">Genre: {book.category}</span>
              <div className="rating">
                <StarRating rating={book.average_rating} />
                <span> {book.average_rating}</span>
              </div>
            </div>
          </div>
          {/* Add this section for the book description */}
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
    description: PropTypes.string,
  }).isRequired,
};

export default BookCard;
