# Book Manager

Book Manager is a full-stack web application that helps users manage their personal book collection.

## Features

- Add new books
- View all books
- Edit book details
- Delete books
- Search books by title or author
- Store book information in MongoDB Atlas

## Technologies Used

**Frontend:** React.js, HTML, CSS, JavaScript

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas, Mongoose

## Project Structure

```text
book-manager/
│
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/jadhavnupur60-dev/book-manager.git
cd book-manager
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

Create a `.env` file in the server folder and add your MongoDB Atlas connection string:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
```

### 3. Start the backend

```bash
npm start
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
npm start
```

The frontend runs at `http://localhost:3000` and the backend runs at `http://localhost:5000`.

## Author

Nupur Jadhav