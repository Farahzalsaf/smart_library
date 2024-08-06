import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BookCard from './components/BookCard/BookCard.jsx';
import Loader from './components/Loader/Loader.jsx';
import { fetchBooks, searchBooks } from './services/BookService.js';
import LoginDropdown from './components/Button/LoginDropdown.jsx';
import ChatbotButton from './components/Button/ChatbotButton.jsx';
import LoginSignupPage from './components/LoginSignup/LoginSignupPage.jsx';
import AdminPanel from './components/AdminPanel /AdminPanel.jsx';
import styles from './App.module.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const data = await searchBooks(query);
      console.log('Nested results:', data.results);
      const books = data.results.flatMap(innerArray => {
        if (Array.isArray(innerArray) && innerArray.length > 0) {
          const booksArray = innerArray[0];
          return Array.isArray(booksArray) ? booksArray.filter(item => typeof item === 'object' && item !== null).map(book => ({
            ...book,
            authors: Array.isArray(book.authors) ? book.authors : book.authors.split(',').map(author => author.trim())
          })) : [];
        }
        return [];
      });
  
      console.log('Flattened books:', books);
      setBooks(books);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.App}>
      <header className={styles.header}>
        <div className={styles.pageTitle}>Library</div>
        <div className={styles.headerLeft}>
          <LoginDropdown 
            navigateTo={navigateTo} 
            isAuthenticated={isAuthenticated}
            setAuthenticated={setIsAuthenticated}
          />
        </div>
      </header>
      <div className={styles.separator}></div>

      {isAuthenticated ? (
        <>
          {currentPage === 'home' ? (
            <>
              <div className={styles.toolbar}>
                <SearchBar onSearch={handleSearch} />
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className={styles.bookGrid}>
                  {books.length > 0 ? (
                    books.map((book, index) => (
                      <BookCard key={index} book={book} />
                    ))
                  ) : (
                    <p>No books found.</p>
                  )}
                </div>
              )}
              <ChatbotButton />
            </>
          ) : (
            <AdminPanel />
          )}
        </>
      ) : (
        <LoginSignupPage setAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
}


export default App;
