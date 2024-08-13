import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './BooksTable.module.css';

const BooksTable = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBook, setNewBook] = useState({ title: '', authors: [], publishedYear: '', description: '', rating: '' });
    const [editingBookId, setEditingBookId] = useState(null);

    const apiUrl = process.env.REACT_APP_URL;

    const fetchBooks = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/books`);
            setBooks(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'authors') {
            const authorsArray = value.split(',').map(author => author.trim());
            setNewBook({ ...newBook, [name]: authorsArray });
        } else {
            setNewBook({ ...newBook, [name]: value });
        }
    };

    const addBook = async () => {
        try {
            await axios.post(`${apiUrl}/books`, newBook);
            fetchBooks();
            setNewBook({ title: '', authors: [], publishedYear: '', description: '', rating: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const updateBook = async (bookId) => {
        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) {
                setError("Authentication token not found.");
                return;
            }
            await axios.put(`${apiUrl}/books/${bookId}`, newBook, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            fetchBooks();
            setEditingBookId(null);
            setNewBook({ title: '', authors: [], publishedYear: '', description: '', rating: '' });
        } catch (err) {
            console.error("Error updating book:", err);
            setError("Failed to update book: " + (err.response?.data?.detail?.map(e => e.msg).join(", ") || "An unknown error occurred"));
        }
    };

    const deleteBook = async (bookId) => {
        try {
            await axios.delete(`${apiUrl}/books/${bookId}`);
            fetchBooks();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles['books-table-container']}>
            <div className={styles['add-book-form']}>
                <input name="title" value={newBook.title} onChange={handleInputChange} placeholder="Title" />
                <input name="authors" value={newBook.authors.join(", ")} onChange={handleInputChange} placeholder="Authors" />
                <input name="publishedYear" value={newBook.publishedYear} onChange={handleInputChange} placeholder="Publish Year" />
                <textarea name="description" value={newBook.description} onChange={handleInputChange} placeholder="Description" />
                <input name="rating" value={newBook.rating} onChange={handleInputChange} placeholder="Rating" />
                <button onClick={() => (editingBookId ? updateBook(editingBookId) : addBook())} aria-label={editingBookId ? "Update Book" : "Add Book"}>
                    {editingBookId ? 'Update Book' : 'Add Book'}
                </button>
            </div>
            <table className={styles['books-table']}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Authors</th>
                        <th>Publish Year</th>
                        <th>Description</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={index}>
                            <td>{book.title}</td>
                            <td>{
                                Array.isArray(book.authors) && book.authors.length > 0 
                                ? book.authors.map(author => typeof author === 'object' ? author.name : author).join(", ")
                                : "Unknown Author"
                            }</td>
                            <td>{book.published_year}</td>
                            <td className={styles['description-cell']}>{book.description}</td>
                            <td>{book.average_rating}</td>
                            <td className={styles['table-actions']}>
                                <button onClick={() => {
                                    setEditingBookId(book.book_id);
                                    setNewBook({
                                        title: book.title,
                                        authors: book.authors,
                                        publishedYear: book.published_year,
                                        description: book.description,
                                        rating: book.average_rating
                                    });
                                }} aria-label="Edit Book">
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.68024 2.77083C4.60102 2.77083 3.25734 4.14279 3.25734 6.26683V12.7332C3.25734 14.8572 4.60102 16.2292 6.68024 16.2292H13.8038C15.8839 16.2292 17.2284 14.8572 17.2284 12.7332V6.26683C17.2284 4.14279 15.8839 2.77083 13.8046 2.77083H6.68024ZM13.8038 17.4167H6.68024C3.89507 17.4167 2.0246 15.5341 2.0246 12.7332V6.26683C2.0246 3.46591 3.89507 1.58333 6.68024 1.58333H13.8046C16.5898 1.58333 18.4611 3.46591 18.4611 6.26683V12.7332C18.4611 15.5341 16.5898 17.4167 13.8038 17.4167Z" fill="#41D0C8"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.8378 12.7349C10.7112 12.8483 10.5364 12.9185 10.3432 12.918C9.95673 12.918 9.64412 12.6381 9.64413 12.2922L9.64412 6.63433C9.64412 6.28839 9.95673 6.00856 10.3432 6.00856C10.7297 6.00856 11.0423 6.28839 11.0423 6.63433L11.0423 12.2922C11.043 12.4652 10.9645 12.6216 10.8378 12.7349Z" fill="#41D0C8"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0001 9.90673C13.8735 10.0201 13.6987 10.0903 13.5055 10.0897L7.17876 10.0891C6.79229 10.0891 6.47968 9.80932 6.47968 9.46338C6.48034 9.11685 6.79294 8.83702 7.17876 8.83761L13.5055 8.8382C13.892 8.8382 14.2046 9.11803 14.2046 9.46397C14.2052 9.63694 14.1261 9.79397 14.0001 9.90673Z" fill="#41D0C8"/>
                                </svg>
                                </button>
                                <button onClick={() => deleteBook(book.book_id)} aria-label="Delete Book">
                                <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.27254 11.9832C8.11475 11.9832 7.95695 11.9254 7.83697 11.8091C7.59617 11.5771 7.59617 11.2019 7.83697 10.9699L11.7752 7.17623C12.016 6.94427 12.4055 6.94427 12.6463 7.17623C12.8871 7.40819 12.8871 7.78344 12.6463 8.01539L8.7081 11.8091C8.58812 11.9254 8.43033 11.9832 8.27254 11.9832Z" fill="#FF0000"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2124 11.9855C12.0546 11.9855 11.8968 11.9277 11.7768 11.8114L7.83532 8.01375C7.59453 7.78179 7.59453 7.40654 7.83532 7.17458C8.07694 6.94262 8.46648 6.94262 8.70646 7.17458L12.6479 10.9722C12.8887 11.2042 12.8887 11.5794 12.6479 11.8114C12.5279 11.9277 12.3693 11.9855 12.2124 11.9855Z" fill="#FF0000"/>
                                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.68024 2.77084C4.60102 2.77084 3.25734 4.1428 3.25734 6.26684V12.7332C3.25734 14.8572 4.60102 16.2292 6.68024 16.2292H13.8038C15.8839 16.2292 17.2284 14.8572 17.2284 12.7332V6.26684C17.2284 4.1428 15.8839 2.77084 13.8046 2.77084H6.68024ZM13.8038 17.4167H6.68024C3.89507 17.4167 2.0246 15.5341 2.0246 12.7332V6.26684C2.0246 3.46593 3.89507 1.58334 6.68024 1.58334H13.8046C16.5898 1.58334 18.4611 3.46593 18.4611 6.26684V12.7332C18.4611 15.5341 16.5898 17.4167 13.8038 17.4167Z" fill="#FF0000"/>
                                </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BooksTable;
