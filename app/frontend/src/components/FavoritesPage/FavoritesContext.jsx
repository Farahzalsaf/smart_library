import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (bookId) => {
    setFavorites((prev) => [...prev, bookId]);
  };

  const removeFavorite = (bookId) => {
    setFavorites((prev) => prev.filter(id => id !== bookId));
  };

  const toggleFavorite = (bookId) => {
    console.log('Toggling favorite for book ID:', bookId);
    if (favorites.includes(bookId)) {
      removeFavorite(bookId);
    } else {
      addFavorite(bookId);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, addFavorite, removeFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
