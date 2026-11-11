const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

// Write one initializeDBAndServer() async function that opens the database and starts the server only after the connection succeeds
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Auto-create and seed table if not already present
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='book';"
    );
    if (!tableExists) {
      const sqlPath = path.join(__dirname, "setup.sql");
      if (fs.existsSync(sqlPath)) {
        const initSql = fs.readFileSync(sqlPath, "utf8");
        await db.exec(initSql);
        console.log("Lab 02: Initialized and seeded 'book' table in books.db");
      }
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Lab 02 Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeDBAndServer();
}

app.initializeDBAndServer = initializeDBAndServer;

// Root route: Info
app.get("/", (request, response) => {
  response.status(200).json({
    message: "BDF Lab 02 - SQLite Database and Relational CRUD Routes Server is Running",
    student: {
      name: "G.Amitha",
      registrationNumber: "252U1R8022",
      section: "CSE-QE-2A, S-14/113"
    },
    routes: [
      "GET /books/",
      "GET /books/:bookId/",
      "POST /books/",
      "PUT /books/:bookId/",
      "DELETE /books/:bookId/"
    ]
  });
});

// Route 1: GET /books/ (Retrieve all books)
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id ASC;`;
    const books = await db.all(getBooksQuery);
    response.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 2: GET /books/:bookId/ (Retrieve a single book by ID using ? placeholder)
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }

    response.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 3: POST /books/ (Add a new book using ? placeholders)
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;
    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [
      title,
      author,
      price,
      pages || 0,
    ]);

    response.status(201).json({
      message: "Book Added Successfully",
      bookId: dbResponse.lastID,
    });
  } catch (error) {
    console.error("Error adding book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 4: PUT /books/:bookId/ (Update an existing book using ? placeholders)
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if book exists first
    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ message: "Book not found" });
    }

    const { title, author, price, pages } = request.body;
    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title || existingBook.title,
      author || existingBook.author,
      price !== undefined ? price : existingBook.price,
      pages !== undefined ? pages : existingBook.pages,
      bookId,
    ]);

    response.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    console.error("Error updating book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// Route 5: DELETE /books/:bookId/ (Remove a book using ? placeholder)
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if book exists first
    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ message: "Book not found" });
    }

    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);

    response.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// 404 Fallback for unknown routes
app.use((request, response) => {
  response.status(404).json({ message: "Route not found" });
});

module.exports = app;
