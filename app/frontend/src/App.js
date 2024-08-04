import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BookCard from './components/BookCard/BookCard.jsx';
import Loader from './components/Loader/Loader.jsx';
import { fetchBooks, searchBooks } from './services/BookService.js';
import ChatbotButton from './components/Button/ChatbotButton.jsx';
import LoginSignupPage from './components/LoginSignup/LoginSignupPage.jsx';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    if (currentPage === 'home') {
      fetchAllBooks();
    }
  }, [currentPage]);

  const fetchAllBooks = () => {
    setLoading(true);
    fetchBooks()
      .then((data) => {
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
        setBooks(data.books || data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <Header navigateTo={navigateTo} />
      {currentPage === 'home' ? (
        <>
          <div className="separator" />
          <div className="toolbar">
            <SearchBar query={query} setQuery={setQuery} onSearch={fetchSearchedBooks} />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="book-grid">
              {books.length > 0 ? (
                books.map((book) => <BookCard key={book.id} book={book} />)
              ) : (
                <p>No books found.</p>
              )}
            </div>
          )}
          <ChatbotButton onClick={ChatbotButton} />
        </>
      ) : (
        <LoginSignupPage />
      )}
    </div>
  );
}

export default App;
