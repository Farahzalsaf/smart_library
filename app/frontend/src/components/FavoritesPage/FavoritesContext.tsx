import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextProps {
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  addFavorite: (bookId: string) => void;
  removeFavorite: (bookId: string) => void;
  toggleFavorite: (bookId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (bookId: string) => {
    setFavorites((prev) => [...prev, bookId]);
  };

  const removeFavorite = (bookId: string) => {
    setFavorites((prev) => prev.filter(id => id !== bookId));
  };

  const toggleFavorite = (bookId: string) => {
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

export const useFavorites = (): FavoritesContextProps => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
