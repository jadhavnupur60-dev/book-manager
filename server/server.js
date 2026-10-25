
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam" },
  { id: 3, title: "Atomic Habits", author: "James Clear" }
];

let nextId = 4;

app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author } = req.body;

  if (!title?.trim() || !author?.trim()) {
    return res.status(400).json({
      error: "Title and author are required"
    });
  }

  const book = {
    id: nextId++,
    title: title.trim(),
    author: author.trim()
  };

  books.push(book);
  res.status(201).json(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, author } = req.body;

  if (!title?.trim() || !author?.trim()) {
    return res.status(400).json({
      error: "Title and author are required"
    });
  }

  book.title = title.trim();
  book.author = author.trim();

  res.json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = books.some((book) => book.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Book not found" });
  }

  books = books.filter((book) => book.id !== id);

  res.json({ message: "Book deleted successfully" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
