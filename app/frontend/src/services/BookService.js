export const fetchBooks = () => {
  const apiUrl = process.env.REACT_APP_URL;
  return fetch(`${apiUrl}/books`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error: ${response.status} ${response.statusText}`;
        try {
          const json = JSON.parse(errorText);
          if (json.message) {
            errorMessage = json.message;
          }
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }
      return data;
    })
    .catch((error) => {
      console.error('Error fetching books:', error.message);
      throw error;
    });
};



export const searchBooks = async (query) => {
  const apiUrl = process.env.REACT_APP_URL;
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
