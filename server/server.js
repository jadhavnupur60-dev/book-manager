
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Book schema
const bookSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  }
});

// Search titles and authors using MongoDB text search
bookSchema.index({
  title: "text",
  author: "text"
});

const Book = mongoose.model("Book", bookSchema);

// Check the search route BEFORE the route containing :id
app.get("/api/books/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Please provide a search term using ?q="
      });
    }

    const results = await Book.find({
      $text: { $search: q }
    }).sort({ score: { $meta: "textScore" } });

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Unable to search books" });
  }
});

// Get all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ id: 1 });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch books" });
  }
});

// Get one book
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findOne({
      id: Number(req.params.id)
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch book" });
  }
});

// Add a book
app.post("/api/books", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required"
      });
    }

    const latestBook = await Book.findOne().sort({ id: -1 });
    const nextId = latestBook ? latestBook.id + 1 : 1;

    const book = await Book.create({
      id: nextId,
      title,
      author
    });

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add book" });
  }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required"
      });
    }

    const book = await Book.findOneAndUpdate(
      { id: Number(req.params.id) },
      { title, author },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update book" });
  }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      id: Number(req.params.id)
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete book" });
  }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully");

    // Add initial sample books only if the database is empty
    if (await Book.countDocuments() === 0) {
      await Book.insertMany([
        { id: 1, title: "The Alchemist", author: "Paulo Coelho" },
        {
          id: 2,
          title: "Wings of Fire",
          author: "A. P. J. Abdul Kalam"
        },
        { id: 3, title: "Atomic Habits", author: "James Clear" }
      ]);

      console.log("Sample books added");
    }

    // Ensure the title/author text index exists
    await Book.createIndexes();

    app.listen(PORT, () => {
      console.log(`Express server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
