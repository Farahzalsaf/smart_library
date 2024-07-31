// BookService.js

export const fetchBooks = () => {
  return fetch('http://127.0.0.1:8000/books', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }
      return data;
    });
};

export const searchBooks = (query) => {
  return fetch(`http://127.0.0.1:8000/books/search/similarity?user_query=${encodeURIComponent(query)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }
      return data;
    });
};
