
# Book Manager

A full-stack application for managing a personal book collection.

## Features

- Display all books
- Add books
- Edit book details
- Delete books with confirmation
- Loading and error handling
- Refresh the book list
- Responsive user interface

## Technologies

- React
- Node.js
- Express.js
- JavaScript
- HTML and CSS

## Project Structure

- `client/` — React frontend
- `server/` — Express backend

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get one book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## Run the Project

Start the backend in one terminal:

```bash
cd server
npm install
npm start
```

Start the frontend in another terminal:

```bash
cd client
npm install
npm start
```

Open http://localhost:3000.

## Storage

This version uses an in-memory array. Book data resets when the backend restarts.
