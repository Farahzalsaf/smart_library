// App.js
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BookCard from './components/BookCard/BookCard.jsx';
import Loader from './components/Loader/Loader.jsx';
import { fetchBooks, searchBooks } from './services/BookService';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = () => {
    setLoading(true);
    fetchBooks()
      .then((data) => {
        console.log(data); 
        setBooks(data.books || data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  const fetchSearchedBooks = () => {
    if (!query) {
      fetchAllBooks();
      return;
    }
    setLoading(true);
    searchBooks(query)
      .then((data) => {
        console.log(data); 
        setBooks(data.books || data); // Adjust based on response structure
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <div className="page-title">PwC Library</div>
      <SearchBar query={query} setQuery={setQuery} onSearch={fetchSearchedBooks} />
      {loading ? (
        <Loader />
      ) : (
        <div className="book-grid">
          {books ? ( // if not null
            Array.isArray(books) ? ( //if its a list of books
              books.length > 0 ? (   // vvv
                books.map((book) => ( // map it
                  <BookCard key={book.id} book={book} />
                ))
              ) : (
                <p>No books found.</p>
              )
            ) : (
              <BookCard key={books.id} book={books} /> //else just display the singular book
            )
          ) : (
            <p>No books found.</p>// if its neither an array or object then no books found
          )}
        </div>
      )}
    </div>
  );
}

export default App;
