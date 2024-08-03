import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BookCard from './components/BookCard/BookCard.jsx';
import Loader from './components/Loader/Loader.jsx';
import { fetchBooks, searchBooks } from './services/BookService';
import LoginDropdown from './components/Button/LoginDropdown.jsx'; 
import ChatbotButton from './components/Button/ChatbotButton.jsx'; 
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
        setBooks(data.books || data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  

  return (
    <div className="App">
      <div className="header">
        <div className="page-title">
          <span>PwC Library</span>
        </div>
        <LoginDropdown /> 
      </div>
      <div style={{ height: "0.75px", backgroundColor: "#EAEFF5" }}></div>
      <div className="toolbar">
        <SearchBar query={query} setQuery={setQuery} onSearch={fetchSearchedBooks} />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="book-grid">
          {books ? (
            Array.isArray(books) ? (
              books.length > 0 ? (
                books.map((book) => <BookCard key={book.id} book={book} />)
              ) : (
                <p>No books found.</p>
              )
            ) : (
              <BookCard key={books.id} book={books} />
            )
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}
      <ChatbotButton onClick={ChatbotButton} /> 
    </div>
  );
}

export default App;
