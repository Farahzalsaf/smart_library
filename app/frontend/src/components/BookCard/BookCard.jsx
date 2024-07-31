import React from 'react';
import PropTypes from 'prop-types';

const BookCard = ({ book }) => {
  return (
    <div className="book-item">
      <div className="card">
        <div className="bg"></div>
        <div className="blob"></div>
        <div className="book-cover">
          {book.thumbnail ? (
            <img src={book.thumbnail} alt={book.title} />
          ) : (
            <div className="no-thumbnail">No Image Available</div>
          )}
        </div>
        <p className="heading">{book.title}</p>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    thumbnail: PropTypes.string,  // Thumbnail should be a string URL
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default BookCard;
