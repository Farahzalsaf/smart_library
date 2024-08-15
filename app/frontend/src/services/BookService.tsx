export interface Book {
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

export const fetchBooks = async (): Promise<Book[]> => {
  const apiUrl = process.env.REACT_APP_URL;
  try {
    const response = await fetch(`${apiUrl}/books`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    return data as Book[];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  const apiUrl = process.env.REACT_APP_URL;
  try {
    const response = await fetch(`${apiUrl}/books/search/similarity/${query}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Unexpected response format');
    }

    return data as Book[];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};
