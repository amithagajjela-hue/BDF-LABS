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

// Initialize Database connection and start Express server
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
        console.log("Initialized and seeded 'book' table in SQLite database.");
      }
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`Database initialization error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  initializeDBAndServer();
}

app.initializeDBAndServer = initializeDBAndServer;

// Root route: API Information & Health Check
app.get("/", (request, response) => {
  response.status(200).json({
    message: "BDF Lab 03 - REST API, Query Parameters & Validation Server is Running",
    student: {
      name: "G.Amitha",
      registrationNumber: "252U1R8022",
      section: "CSE-QE-2A, S-14/113",
    },
    endpoints: {
      "GET /books": "Fetch all books with search, sort, filter, limit & offset",
      "GET /books/:bookId": "Fetch a single book by ID",
      "POST /books": "Create a new book with validation",
      "PUT /books/:bookId": "Update an existing book by ID",
      "DELETE /books/:bookId": "Delete a book by ID",
    },
  });
});
// GET /books/ - Search, Sorting, Filtering, and Pagination
app.get("/books", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = 10,
      offset = 0,
      min_price,
      max_price,
    } = request.query;

    const conditions = [];
    const queryParams = [];

    // Partial search on title using LIKE
    if (search_q && search_q.trim() !== "") {
      conditions.push("title LIKE ?");
      queryParams.push(`%${search_q.trim()}%`);
    }

    // Price range filtering (BETWEEN or >= / <=)
    if (min_price !== undefined && max_price !== undefined) {
      conditions.push("price BETWEEN ? AND ?");
      queryParams.push(Number(min_price), Number(max_price));
    } else if (min_price !== undefined) {
      conditions.push("price >= ?");
      queryParams.push(Number(min_price));
    } else if (max_price !== undefined) {
      conditions.push("price <= ?");
      queryParams.push(Number(max_price));
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sanitize order_by column and sort order direction to prevent SQL Injection
    const allowedColumns = ["id", "title", "author", "price", "pages"];
    const validOrderBy = allowedColumns.includes(order_by.toLowerCase())
      ? order_by.toLowerCase()
      : "id";
    const validOrder =
      order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

    const getBooksQuery = `
      SELECT *
      FROM book
      ${whereClause}
      ORDER BY ${validOrderBy} ${validOrder}
      LIMIT ? OFFSET ?;
    `;
    queryParams.push(parsedLimit, parsedOffset);

    const books = await db.all(getBooksQuery, queryParams);
    response.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /books/:bookId/ - Retrieve a single book
app.get("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).json({ message: "Book not found" });
    }

    response.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book by id:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /books/ - Create a new book with validation
app.post("/books", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validation: Title required and must be non-empty string
    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).json({ message: "Title is required" });
    }

    // Validation: Author required and must be non-empty string
    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).json({ message: "Author is required" });
    }

    // Validation: Price must be a non-empty, non-negative number
    if (
      price === undefined ||
      price === null ||
      typeof price === "boolean" ||
      isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return response
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    const parsedPages =
      pages !== undefined && !isNaN(Number(pages)) && Number(pages) >= 0
        ? Number(pages)
        : 0;

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [
      title.trim(),
      author.trim(),
      Number(price),
      parsedPages,
    ]);

    response.status(201).json({
      message: "Book Added Successfully",
      bookId: dbResponse.lastID,
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /books/:bookId/ - Update an existing book with validation
app.put("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if book exists
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ message: "Book not found" });
    }

    const { title, author, price, pages } = request.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return response.status(400).json({ message: "Title is required" });
    }

    if (!author || typeof author !== "string" || author.trim() === "") {
      return response.status(400).json({ message: "Author is required" });
    }

    if (
      price === undefined ||
      price === null ||
      typeof price === "boolean" ||
      isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return response
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    const parsedPages =
      pages !== undefined && !isNaN(Number(pages)) && Number(pages) >= 0
        ? Number(pages)
        : existingBook.pages;

    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title.trim(),
      author.trim(),
      Number(price),
      parsedPages,
      bookId,
    ]);

    response.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    console.error("Error updating book:", error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE /books/:bookId/ - Delete a book
app.delete("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Check if book exists
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);

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

// Fallback for undefined routes
app.use((request, response) => {
  response.status(404).json({ message: "Route not found" });
});

module.exports = app;
