
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");

const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get all books belonging to the logged-in user
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error("Fetch books error:", error);
    res.status(500).json({ error: "Unable to fetch books." });
  }
});

// Search books by title or author
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Please enter a search term."
      });
    }

    const searchPattern = escapeRegex(q);

    const books = await Book.find({
      user: req.user.id,
      $or: [
        { title: { $regex: searchPattern, $options: "i" } },
        { author: { $regex: searchPattern, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error("Search books error:", error);
    res.status(500).json({ error: "Search failed." });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required."
      });
    }

    const book = await Book.create({
      title,
      author,
      user: req.user.id
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).json({ error: "Unable to add book." });
  }
});

// Update a book
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid book ID." });
    }

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required."
      });
    }

    const book = await Book.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title, author },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ error: "Unable to update book." });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid book ID." });
    }

    const book = await Book.findOneAndDelete({
      _id: id,
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found." });
    }

    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Unable to delete book." });
  }
});

module.exports = router;
