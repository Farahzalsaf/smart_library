const apiUrl = process.env.REACT_APP_URL; 
export const fetchBooks = () => {
  return fetch(`${apiUrl}/books`, {
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


export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${apiUrl}/books/search/similarity/${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response:', response); 

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

