import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import BookCard from './components/BookCard/BookCard';
import Loader from './components/Loader/Loader';
import { fetchBooks, searchBooks } from './services/BookService';
import LoginDropdown from './components/Button/LoginDropdown';
import ChatbotButton from './components/Button/ChatbotButton';
import LoginSignupPage from './components/LoginSignup/LoginSignupPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import FavoritesPage from './components/FavoritesPage/FavoritesPage';
import { useFavorites } from './components/FavoritesPage/FavoritesContext';
import './App.css';

interface Book {
  book_id: string;
  title: string;
  author: string;
  published_year: number;
  description: string;
  categories: string;
  average_rating: number;
  thumbnail?: string;
  num_pages?: number;
  ratings_count?: number;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
        setBooks(data); // Directly set the data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  };
  
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const data = await searchBooks(query);
      setBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
      setBooks([]); // Set to an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSortSelection = (sortedBooks: Book[]) => {
    setBooks(sortedBooks);
    setLoading(false);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="page-title">Library</div>
        <div className="header-left">
          <LoginDropdown navigateTo={navigateTo} isAuthenticated={isAuthenticated} setAuthenticated={setIsAuthenticated} />
        </div>
      </header>
      <div style={{ height: "0.75px", backgroundColor: "#EAEFF5" }}></div>
      {isAuthenticated ? (
        <>
          {currentPage === 'home' ? (
            <>
              <div className="toolbar">
                <SearchBar onSearch={handleSearch} navigateTo={navigateTo} onSelection={handleSortSelection} />
                {loading ? (
                  <Loader />
                ) : (
                  <div className="book-grid">
                    {books.map((book) => (
                      <BookCard 
                        key={book.book_id} 
                        book={book} 
                        isFavorite={favorites.includes(book.book_id)} 
                        toggleFavorite={() => toggleFavorite(book.book_id)}
                      />
                    ))}
                  </div>
                )}
                <ChatbotButton />
              </div>
            </>
          ) : currentPage === 'favorites' ? (
            <FavoritesPage books={[books]} />
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
