
import React, { useEffect, useState } from "react";

function EditBook({ book, onUpdate, onCancel, busy }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);

  useEffect(() => {
    setTitle(book.title);
    setAuthor(book.author);
  }, [book]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !author.trim()) {
      return;
    }

    await onUpdate(book._id, {
      title: title.trim(),
      author: author.trim()
    });
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>Edit Book</h2>

      <label htmlFor="edit-title">Book Title</label>
      <input
        id="edit-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        maxLength={200}
      />

      <label htmlFor="edit-author">Author Name</label>
      <input
        id="edit-author"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        required
        maxLength={120}
      />

      <div className="form-actions">
        <button type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditBook;
