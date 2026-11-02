
import React, { useCallback, useEffect, useState } from "react";

import "./App.css";
import BookList from "./components/BookList";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const API_URL = `${API_BASE_URL}/api/books`;

function App() {
  const { token, user, logout } = useAuth();

  const [showRegister, setShowRegister] = useState(false);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  const visibleBooks = searchResults === null ? books : searchResults;

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });

    const text = await response.text();
    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Server returned an invalid response. Please try again.");
    }

    if (!response.ok) {
      throw new Error(data?.error || "Something went wrong.");
    }

    return data;
  }, [token]);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    setSearchResults(null);
    setSearchTerm("");

    try {
      const data = await request(API_URL);
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load books.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    if (token) {
      loadBooks();
    }
  }, [token, loadBooks]);

  async function handleSearch(event) {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) {
      setSearchResults(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const results = await request(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (err) {
      setError(err.message || "Could not search books.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setSearchTerm("");
    setSearchResults(null);
    setError("");
    setMessage("");
  }

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
      setSearchResults(null);
      setSearchTerm("");
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
        previous.map((book) => book.id === id ? updatedBook : book)
      );

      setSearchResults(null);
      setSearchTerm("");
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

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await request(`${API_URL}/${id}`, { method: "DELETE" });

      setBooks((previous) =>
        previous.filter((book) => book.id !== id)
      );

      setSearchResults((previous) =>
        previous === null
          ? null
          : previous.filter((book) => book.id !== id)
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

  function handleLogout() {
    logout();
    setBooks([]);
    setSearchResults(null);
    setEditingBook(null);
    setError("");
    setMessage("");
  }

  return (
    <ProtectedRoute
      fallback={
        showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} />
        ) : (
          <Login onSwitch={() => setShowRegister(true)} />
        )
      }
    >
      <main className="app-container">
        <header className="app-header">
          <p className="eyebrow">FULL-STACK PROJECT</p>
          <h1>Book Manager</h1>
          <p>Manage your personal book collection in one place.</p>

          <p>
            Welcome, {user?.name || user?.email || "User"}!
          </p>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
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
                {visibleBooks.length} books
              </span>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <label htmlFor="book-search">
                Search by book title or author
              </label>

              <input
                id="book-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search books or authors"
              />

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  Search
                </button>

                <button
                  type="button"
                  onClick={clearSearch}
                  disabled={loading && searchResults === null}
                >
                  Clear Search
                </button>
              </div>
            </form>

            {searchResults !== null && (
              <p role="status">
                Showing search results for "{searchTerm}"
              </p>
            )}

            <BookList
              books={visibleBooks}
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
          Built with React, Express, and MongoDB Atlas
        </footer>
      </main>
    </ProtectedRoute>
  );
}

export default App;
