
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
        <div className="book-card" key={book._id}>
          <div>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p className="book-id">
              Book ID: {book._id}
            </p>
          </div>

          <div className="book-actions">
            <button
              type="button"
              onClick={() => onEdit(book)}
            >
              Edit
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(book._id)}
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
