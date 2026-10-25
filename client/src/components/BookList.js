
import React from "react";

function BookList({ books, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p role="status">Loading books...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (books.length === 0) {
    return <p>No books available. Add your first book!</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <div className="book-card" key={book.id}>
          <div>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p className="book-id">Book ID: {book.id}</p>
          </div>

          <div className="book-actions">
            <button onClick={() => onEdit(book)}>
              Edit
            </button>

            <button
              className="delete-button"
              onClick={() => onDelete(book.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;
