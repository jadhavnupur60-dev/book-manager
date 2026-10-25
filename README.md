# Book Manager

## Project Description
Book Manager is a full-stack web application for managing a personal collection of books. Users can view, add, edit, and delete books.

## Technologies Used
- React.js
- Node.js
- Express.js
- HTML, CSS, and JavaScript
- REST API

## Features
- View all books
- Add new books
- Edit book details
- Delete books
- Refresh the book list
- Display loading and error messages

## Project Structure
- `client/` — React frontend
- `server/` — Express backend

## API Endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get a book by ID |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

## How to Run

### Start the backend
```powershell
cd "$HOME\OneDrive\book-manager\server"
npm start
```

### Start the frontend in a second PowerShell window
```powershell
cd "$HOME\OneDrive\book-manager\client"
npm start
```

Open `http://localhost:3000` in your browser.

## Data Storage
The current version stores books in memory. Data changes may be lost when the backend restarts.

## Author
Nupur Jadhav

## GitHub Repository
https://github.com/jadhavnupur60-dev/book-manager
