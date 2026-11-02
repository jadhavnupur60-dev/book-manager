const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Get books belonging to logged-in user
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user.id
    }).sort({ id: 1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      error: "Unable to fetch books."
    });
  }
});

// Search books
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        error: "Please enter a search term."
      });
    }

    const books = await Book.find({
      user: req.user.id,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } }
      ]
    }).sort({ id: 1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      error: "Search failed."
    });
  }
});

// Add book
router.post("/", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required."
      });
    }

    const latestBook = await Book.findOne()
      .sort({ id: -1 });

    const nextId = latestBook ? latestBook.id + 1 : 1;

    const book = await Book.create({
      id: nextId,
      title,
      author,
      user: req.user.id
    });

    res.status(201).json(book);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to add book."
    });
  }
});

// Update book
router.put("/:id", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();

    if (!title || !author) {
      return res.status(400).json({
        error: "Title and author are required."
      });
    }

    const book = await Book.findOneAndUpdate(
      {
        id: Number(req.params.id),
        user: req.user.id
      },
      { title, author },
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      return res.status(404).json({
        error: "Book not found."
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      error: "Unable to update book."
    });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      id: Number(req.params.id),
      user: req.user.id
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found."
      });
    }

    res.json({
      message: "Book deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      error: "Unable to delete book."
    });
  }
});

module.exports = router;