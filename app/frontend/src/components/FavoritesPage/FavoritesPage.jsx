import React, { useEffect } from 'react';
import BookCard from '../BookCard/BookCard'; 
import { useFavorites } from './FavoritesContext';

const FavoritesPage = ({ books }) => {
  const { favorites, setFavorites, addFavorite, removeFavorite } = useFavorites();
  const apiUrl = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/favorites`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites from the database');
        }

        const favoriteBooks = await response.json();
        console.log("API response for favorites:", favoriteBooks);

        if (favoriteBooks.length === 0) {
          console.log("No favorites found or empty array received");
        } else {
          const favoriteIds = favoriteBooks.map(book => book.book_id);
          console.log("Setting favorites:", favoriteIds);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      }
    };

    fetchFavorites();
  }, [apiUrl, setFavorites]);

  const flattenedBooks = books.flatMap(innerArray => innerArray);

  const favoriteBooks = flattenedBooks.filter(book => favorites.includes(book.book_id));

  const toggleFavorite = async (bookId) => {
    const isFavorite = favorites.includes(bookId);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/favorites`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preference_type: 'favorite_book',
          preference_value: String(bookId),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove' : 'add'} favorite in the database`);
      }

      const result = await response.json();
      console.log('Response from server:', result);

      if (isFavorite) {
        console.log(`Removing favorite book ID: ${bookId}`);
        removeFavorite(bookId); // Update local state
      } else {
        console.log(`Adding favorite book ID: ${bookId}`);
        addFavorite(bookId); // Update local state
      }
    } catch (error) {
      console.error(`Error ${isFavorite ? 'removing' : 'adding'} favorite book:`, error);
    }
  };

  return (
    <div className="favorites-container">
      {favoriteBooks.length > 0 ? (
        favoriteBooks.map(book => (
          <BookCard
            key={book.book_id}
            book={book}
            isFavorite={favorites.includes(book.book_id)}
            toggleFavorite={() => toggleFavorite(book.book_id)}
          />
        ))
      ) : (
        <p>No favorite books added.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
