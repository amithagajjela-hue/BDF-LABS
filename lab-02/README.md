# Lab 2: SQLite database and CRUD routes

**Backend Development Fundamentals · Year II Term II · Aurora**  
**Student Name:** G.Amitha  
**Registration Number:** 252U1R8022  
**Section:** CSE-QE-2A, S-14/113  

---

## 🌐 Live Deployment & Links
- **Render Live URL:** [https://lab-02-sqlite-server-252u1r8022.onrender.com](https://lab-02-sqlite-server-252u1r8022.onrender.com)
- **Local Base URL:** `http://localhost:3000`
- **GitHub Repository:** `BDF-LABS/lab-02/`

---

## 🎯 Objectives
- Connect an Express.js backend application to an embedded relational SQLite database using `sqlite` and `sqlite3`.
- Design a single asynchronous `initializeDBAndServer()` function to ensure the database opens successfully prior to starting the server on port 3000.
- Implement the 5 canonical CRUD HTTP routes:
  1. `GET /books/` (Read all)
  2. `GET /books/:bookId/` (Read one)
  3. `POST /books/` (Create)
  4. `PUT /books/:bookId/` (Update)
  5. `DELETE /books/:bookId/` (Delete)
- Protect the database from SQL Injection by strictly using `?` parameterized queries.
- Verify that records inserted, updated, and deleted via Postman persist correctly in `books.db`.

---

## 🚀 How to Install and Run Locally

### 1. Prerequisites
- **Node.js**: `v20.18.0` or higher
- **NPM**: `v10+`

### 2. Installation
```bash
cd lab-02
npm install
```

### 3. Database Initialization & Seeding
The database (`books.db`) is automatically initialized and seeded with 10 sample books on server startup. You can also re-seed anytime via:
```bash
npm run seed
```

### 4. Running the Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (Auto-reload with Nodemon):**
  ```bash
  npm run dev
  ```
The server will run at `http://localhost:3000/`.

---

## 📋 Endpoints & CRUD Routes Table

| Method | Endpoint | Path Parameters | Request Body | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | None | None | `200 OK` | Service information and available CRUD routes. |
| `GET` | `/books/` | None | None | `200 OK` | Returns all books ordered by ID. |
| `GET` | `/books/:bookId/` | `bookId` | None | `200 OK` / `404 Not Found` | Fetches a single book by ID using `?` parameter. |
| `POST` | `/books/` | None | `{ "title", "author", "price", "pages" }` | `201 Created` | Inserts a new book and returns the generated `bookId`. |
| `PUT` | `/books/:bookId/` | `bookId` | `{ "title", "author", "price", "pages" }` | `200 OK` / `404 Not Found` | Updates book record corresponding to `bookId`. |
| `DELETE` | `/books/:bookId/` | `bookId` | None | `200 OK` / `404 Not Found` | Deletes the book record corresponding to `bookId`. |

---

## 📸 Postman Testing & Verification Evidence

All screenshots are stored in [`screenshots/`](./screenshots/):

### 1. GET All Books (`GET /books/`)
- **URL:** `GET http://localhost:3000/books/`
- **Status:** `200 OK`
- **Response:** Array of all seeded books.
![01-get-all-books](screenshots/01-get-all-books.png)

### 2. GET Single Book by ID (`GET /books/3/`)
- **URL:** `GET http://localhost:3000/books/3/`
- **Status:** `200 OK`
- **Response:**
```json
{
  "id": 3,
  "title": "Atomic Habits",
  "author": "James Clear",
  "price": 499,
  "pages": 320
}
```
![02-get-single-book](screenshots/02-get-single-book.png)

### 3. GET Book Not Found (`GET /books/999/`)
- **URL:** `GET http://localhost:3000/books/999/`
- **Status:** `404 Not Found`
- **Response:** `{"error":"Book not found"}`
![03-get-book-not-found](screenshots/03-get-book-not-found.png)

### 4. SQL Injection Prevention Test (`GET /books/1 OR 1=1/`)
- **URL:** `GET http://localhost:3000/books/1 OR 1=1/`
- **Status:** `404 Not Found` (Sanitized via `?` parameterized query)
- **Response:** `{"error":"Book not found"}`
![04-sql-injection-prevention](screenshots/04-sql-injection-prevention.png)

### 5. POST Add New Book (`POST /books/`)
- **URL:** `POST http://localhost:3000/books/`
- **Status:** `201 Created`
- **Response:** `{"message":"Book added successfully","bookId":11}`
![05-post-add-book-success](screenshots/05-post-add-book-success.png)

### 6. POST Validation Error Handling (`POST /books/`)
- **URL:** `POST http://localhost:3000/books/`
- **Body:** `{ "title": "", "author": "Yuval Noah Harari", "price": -10, "pages": 0 }`
- **Status:** `400 Bad Request`
- **Response:** `{"error":"title, author (text) and price, pages (whole numbers) are required"}`
![06-post-validation-error](screenshots/06-post-validation-error.png)

### 7. PUT Update Book (`PUT /books/11/`)
- **URL:** `PUT http://localhost:3000/books/11/`
- **Status:** `200 OK`
- **Response:** `{"message":"Book updated successfully"}`
![07-put-update-book](screenshots/07-put-update-book.png)

### 8. DELETE Book Successfully (`DELETE /books/11/`)
- **URL:** `DELETE http://localhost:3000/books/11/`
- **Status:** `200 OK`
- **Response:** `{"message":"Book deleted successfully"}`
![08-delete-book-success](screenshots/08-delete-book-success.png)

### 9. DELETE Book Not Found (`DELETE /books/11/`)
- **URL:** `DELETE http://localhost:3000/books/11/`
- **Status:** `404 Not Found`
- **Response:** `{"error":"Book not found"}`
![09-delete-book-not-found](screenshots/09-delete-book-not-found.png)

### 10. SQLite Database Verification
- Direct query check verifying records persisted in `books.db`.
![10-database-view](screenshots/10-database-view.png)

---

## 🛠️ Notes: Problems Faced and Solutions

1. **Server Starting Before Database Connection:**
   - *Problem:* If `app.listen()` executes before `open({ filename: dbPath, driver: sqlite3.Database })` resolves, initial API requests fail with `TypeError: Cannot read properties of null (reading 'all')`.
   - *Solution:* Encapsulated both operations inside `async initializeDBAndServer()`, awaiting the database connection before calling `app.listen()`.

2. **SQL Injection Vulnerabilities with Direct String Interpolation:**
   - *Problem:* Using template literals like `WHERE id = ${bookId}` exposes the database to injection attacks.
   - *Solution:* Passed arguments through SQLite's parameterized query syntax (`WHERE id = ?`), ensuring input is strictly sanitized and treated as literal values.

---

## 💡 Viva Questions & Answers

### Q1: Why must we await the database call?
- SQLite queries are asynchronous I/O operations that return a `Promise`. In JavaScript's non-blocking runtime, failing to `await` causes the route handler to immediately return a pending `Promise` object rather than the queried rows, resulting in empty responses or unhandled promise errors.

### Q2: What is SQL Injection, and how do placeholders prevent it?
- **SQL Injection:** A vulnerability where malicious SQL commands are entered into user input fields to alter query logic (e.g. `' OR 1=1 --`).
- **How Placeholders Prevent It:** By using `?` placeholders, the SQLite query engine separates query compilation from data binding. The database interprets user input strictly as literal string or numeric parameters, never as executable SQL commands.

### Q3: When is `PUT` used instead of `POST`?
- **`POST`:** Used when adding a new subordinate entity whose URI is generated by the server. It is non-idempotent (calling it multiple times produces multiple distinct rows).
- **`PUT`:** Used to update or replace an existing entity at a known specific URI (`/books/:bookId`). It is idempotent (making identical PUT requests repeatedly leaves the system in the exact same state).
