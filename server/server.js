require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")
    : "http://localhost:3000"
}));

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Book Manager API is running."
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1
      ? "Connected"
      : "Disconnected"
  });
});

// Public authentication APIs
app.use("/api/auth", authRoutes);

// All book APIs require login
app.use(
  "/api/books",
  authMiddleware,
  bookRoutes
);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing.");
    }

    if (!process.env.JWT_SECRET ||
        process.env.JWT_SECRET.length < 32) {
      throw new Error(
        "JWT_SECRET must contain at least 32 characters."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(
        `Server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();