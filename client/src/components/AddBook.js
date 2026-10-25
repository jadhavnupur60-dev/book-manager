
import React, { useState } from "react";

function AddBook({ onAdd, busy }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !author.trim()) {
      return;
    }

    const success = await onAdd({
      title: title.trim(),
      author: author.trim()
    });

    if (success) {
      setTitle("");
      setAuthor("");
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>Add a New Book</h2>

      <label htmlFor="new-title">Book Title</label>
      <input
        id="new-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter book title"
        required
      />

      <label htmlFor="new-author">Author Name</label>
      <input
        id="new-author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        placeholder="Enter author name"
        required
      />

      <button type="submit" disabled={busy}>
        {busy ? "Adding..." : "Add Book"}
      </button>
    </form>
  );
}

export default AddBook;
