import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { FavoritesProvider } from './components/FavoritesPage/FavoritesContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);
