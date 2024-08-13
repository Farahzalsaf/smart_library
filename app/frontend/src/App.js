import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import BookCard from './components/BookCard/BookCard.jsx';
import Loader from './components/Loader/Loader.jsx';
import { fetchBooks, searchBooks } from './services/BookService.js';
import LoginDropdown from './components/Button/LoginDropdown.jsx';
import ChatbotButton from './components/Button/ChatbotButton.jsx';
import LoginSignupPage from './components/LoginSignup/LoginSignupPage.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import FavoritesPage from './components/FavoritesPage/FavoritesPage.jsx';
import { useFavorites } from './components/FavoritesPage/FavoritesContext.jsx';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setCurrentPage('home');
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
    <div className="App">
      <header className="header">
        <div className="page-title">Library</div>
        <div className="header-left">
          <LoginDropdown 
            navigateTo={navigateTo} 
            isAuthenticated={isAuthenticated}
            setAuthenticated={setIsAuthenticated}
          />
        </div>
      </header>
      <div style={{ height: "0.75px", backgroundColor: "#EAEFF5" }}></div>

      {isAuthenticated ? (
        <>
          {currentPage === 'home' ? (
            <>
              <div className="toolbar">
                <SearchBar onSearch={handleSearch} navigateTo={navigateTo} />
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="book-grid">
                  {books.length > 0 ? (
                    books.map((book) => (
                      <BookCard 
                        key={book.book_id} 
                        book={book} 
                        isFavorite={favorites.includes(book.book_id)} 
                        toggleFavorite={() => toggleFavorite(book.book_id)} 
                      />
                    ))
                  ) : (
                    <p>No books found.</p>
                  )}
                </div>
              )}
              <ChatbotButton />
            </>
          ) : currentPage === 'favorites' ? (
            <FavoritesPage books={books} />
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
