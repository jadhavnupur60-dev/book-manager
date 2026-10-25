
import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import "./App.css";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";

const API_URL = "/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request(API_URL);
      setBooks(data);
    } catch (err) {
      setError(err.message || "Could not load books.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleAdd(bookData) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const newBook = await request(API_URL, {
        method: "POST",
        body: JSON.stringify(bookData)
      });

      setBooks((previous) => [...previous, newBook]);
      setMessage("Book added successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Could not add the book.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(id, bookData) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const updatedBook = await request(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(bookData)
      });

      setBooks((previous) =>
        previous.map((book) =>
          book.id === id ? updatedBook : book
        )
      );

      setEditingBook(null);
      setMessage("Book updated successfully!");
    } catch (err) {
      setError(err.message || "Could not update the book.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      setBooks((previous) =>
        previous.filter((book) => book.id !== id)
      );

      if (editingBook?.id === id) {
        setEditingBook(null);
      }

      setMessage("Book deleted successfully!");
    } catch (err) {
      setError(err.message || "Could not delete the book.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="eyebrow">FULL-STACK PROJECT</p>
        <h1>Book Manager</h1>
        <p>
          Manage your personal book collection in one place.
        </p>
      </header>

      {message && (
        <p className="success-message" role="status">
          {message}
        </p>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button
            className="dismiss-button"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="content-grid">
        <div className="form-panel">
          {editingBook ? (
            <EditBook
              book={editingBook}
              onUpdate={handleUpdate}
              onCancel={() => setEditingBook(null)}
              busy={busy}
            />
          ) : (
            <AddBook onAdd={handleAdd} busy={busy} />
          )}
        </div>

        <div className="books-panel">
          <div className="section-heading">
            <h2>My Books</h2>
            <span className="book-count">
              {books.length} books
            </span>
          </div>

          <BookList
            books={books}
            loading={loading}
            error=""
            onEdit={setEditingBook}
            onDelete={handleDelete}
          />

          {!loading && (
            <button
              className="refresh-button"
              onClick={loadBooks}
              disabled={busy}
            >
              Refresh Books
            </button>
          )}
        </div>
      </section>

      <footer className="app-footer">
        Built with React and Express
      </footer>
    </main>
  );
}

export default App;
