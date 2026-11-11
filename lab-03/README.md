# Lab 3: REST API, Query Parameters, Validation, and Debugging

**Backend Development Fundamentals · Year II Term II · Aurora**  
**Student Name:** G.Amitha  
**Registration Number:** 252U1R8022  
**Section:** CSE-QE-2A, S-14/113  

---

## 🌐 Live Deployment & Links
- **Render Live URL:** [https://lab-03-rest-api-252u1r8022.onrender.com](https://lab-03-rest-api-252u1r8022.onrender.com)
- **Local Base URL:** `http://localhost:3000`
- **GitHub Repository:** `BDF-LABS/lab-03/`

---

## 🎯 Objectives
- Upgrade CRUD operations into a full RESTful API using nouns as endpoints (`/books`) and standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- Implement expressive query parameters: `search_q`, `order_by`, `order`, `limit`, `offset`, and price range filters (`min_price`, `max_price`).
- Enforce strict request body validation on `POST` and `PUT` with clean HTTP `400 Bad Request` messages.
- Return standard HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`.
- Practice structured debugging for Node.js/SQLite errors (`EADDRINUSE`, wrong imports, SQL typos, missing `await`).

---

## 🚀 How to Install and Run Locally

### 1. Prerequisites
- **Node.js**: v20.18.0 or higher
- **NPM**: v10+

### 2. Installation
Navigate into the `lab-03` directory and install project dependencies:
```bash
cd lab-03
npm install
```

### 3. Database Initialization & Seeding
The database (`books.db`) is automatically initialized and seeded upon running the server. You can also manually re-seed it anytime using:
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
The server will start listening at `http://localhost:3000/`.

---

## 📋 API Endpoints & Query Parameters

| Method | Endpoint | Query / Path Parameters | Request Body | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | None | None | `200 OK` | API health check and server information. |
| `GET` | `/books` | `search_q`, `order_by`, `order`, `limit`, `offset`, `min_price`, `max_price` | None | `200 OK` | Retrieves books matching search, sort, filter, and pagination rules. |
| `GET` | `/books/:bookId` | `bookId` (Path) | None | `200 OK` / `404 Not Found` | Retrieves a single book by ID. |
| `POST` | `/books` | None | `{ "title", "author", "price", "pages" }` | `201 Created` / `400 Bad Request` | Adds a new book with input validation. |
| `PUT` | `/books/:bookId` | `bookId` (Path) | `{ "title", "author", "price", "pages" }` | `200 OK` / `400 Bad Request` / `404 Not Found` | Updates existing book details. |
| `DELETE` | `/books/:bookId` | `bookId` (Path) | None | `200 OK` / `404 Not Found` | Deletes a book by ID. |

### 🔍 Query Parameter Details (`GET /books`)

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `search_q` | String | `""` | Partial, case-insensitive match on book title (`title LIKE '%...%'`). |
| `order_by` | String | `"id"` | Column to sort by: `id`, `title`, `author`, `price`, `pages`. |
| `order` | String | `"ASC"` | Sort direction: `ASC` (ascending) or `DESC` (descending). |
| `limit` | Integer | `10` | Maximum number of book records to return. |
| `offset` | Integer | `0` | Number of records to skip for pagination. |
| `min_price` | Integer | None | Filters books where `price >= min_price`. |
| `max_price` | Integer | None | Filters books where `price <= max_price`. (Uses `BETWEEN` when both provided). |

---

## 📸 Postman Testing & Verification Evidence

All test screenshots are stored inside the [`screenshots/`](./screenshots/) directory:

### 1. GET All Books (Default Query)
- **URL:** `GET http://localhost:3000/books/`
- **Status:** `200 OK`
- **Response:** All 10 books in default order.
![01-get-all-books](screenshots/01-get-all-books.png)

### 2. Search Books by Title (`search_q=Code`)
- **URL:** `GET http://localhost:3000/books/?search_q=Code`
- **Status:** `200 OK`
- **Response:** Filtered book records matching title substring `"Code"`.
![02-get-books-search](screenshots/02-get-books-search.png)

### 3. Sort Books by Price Descending (`order_by=price&order=DESC`)
- **URL:** `GET http://localhost:3000/books/?order_by=price&order=DESC`
- **Status:** `200 OK`
- **Response:** Books sorted from highest price (720) to lowest price (250).
![03-get-books-sort](screenshots/03-get-books-sort.png)

### 4. GET Single Book by ID (`GET /books/3/`)
- **URL:** `GET http://localhost:3000/books/3/`
- **Status:** `200 OK`
- **Response:** Single book object corresponding to `id: 3` (*Atomic Habits*).
![04-get-single-book](screenshots/04-get-single-book.png)

### 5. POST Create Book (Success)
- **URL:** `POST http://localhost:3000/books/`
- **Status:** `201 Created`
- **Response:** `{"message":"Book added successfully","bookId":11}`
![05-post-book-success](screenshots/05-post-book-success.png)

### 6. POST Validation Error Handling
- **URL:** `POST http://localhost:3000/books/`
- **Status:** `400 Bad Request`
- **Response:** `{"message":"Invalid input: title, author, non-negative price, and positive pages are required"}`
![06-post-validation-error](screenshots/06-post-validation-error.png)

### 7. PUT Update Book by ID
- **URL:** `PUT http://localhost:3000/books/11/`
- **Status:** `200 OK`
- **Response:** `{"message":"Book updated successfully"}`
![07-put-book-success](screenshots/07-put-book-success.png)

### 8. DELETE Book by ID (Success)
- **URL:** `DELETE http://localhost:3000/books/11/`
- **Status:** `200 OK`
- **Response:** `{"message":"Book deleted successfully"}`
![08-delete-book-success](screenshots/08-delete-book-success.png)

### 9. DELETE Book by ID (Not Found)
- **URL:** `DELETE http://localhost:3000/books/11/`
- **Status:** `404 Not Found`
- **Response:** `{"message":"Book not found"}`
![09-delete-book-404](screenshots/09-delete-book-404.png)

---

## 🛠️ Debugging Common Errors & Solutions

During backend development with Node.js and SQLite, four standard errors frequently occur. Here is how they were identified, debugged, and prevented:

### 1. Port Conflict (`Error: listen EADDRINUSE: address already in use :::3000`)
- **Cause:** Another instance of Node.js or a previous server process is already running on port 3000.
- **How to Identify:** The console throws `EADDRINUSE` during `app.listen()`.
- **Fix:**
  - **Windows:** Run `netstat -ano | findstr :3000` to find the process ID (PID), then terminate it using `taskkill /PID <PID> /F`.
  - **Best Practice:** Use environment variables with fallback: `const PORT = process.env.PORT || 3000;`.

### 2. Wrong Import Path / Module Resolution (`Cannot find module ...`)
- **Cause:** Typo in relative paths (e.g., `require('./setup')` instead of `require('./setup.sql')`) or confusing `sqlite` vs `sqlite3` packages.
- **How to Identify:** Node crashes immediately upon boot with `MODULE_NOT_FOUND`.
- **Fix:** Ensure correct module names in `package.json` and use Node's `path.join(__dirname, ...)` for absolute filesystem paths.

### 3. Table-Name Typo (`SQLITE_ERROR: no such table: books`)
- **Cause:** Inconsistency between schema declaration (e.g., table created as `book` singular) and queries written as `SELECT * FROM books` (plural).
- **How to Identify:** SQLite throws `SQLITE_ERROR: no such table`.
- **Fix:** Standardize SQL naming conventions. Keep table names consistent as `book` across `setup.sql`, `seed.js`, and all SQL query strings in `index.js`.

### 4. Missing `await` Keyword on Asynchronous Database Calls
- **Cause:** Calling `db.all()`, `db.get()`, or `db.run()` without `await`. In JavaScript, async functions immediately return a pending `Promise` object rather than the resolved data.
- **How to Identify:** `response.json(books)` returns `{}` or `Promise { <pending> }`, or downstream code attempts to read properties of an unresolved Promise.
- **Fix:** Ensure every route handler is declared `async (request, response) => { ... }` and prefix every database operation with `await`.

---

## 💡 Viva Questions & Conceptual Answers

### Q1: What is the difference between a Query Parameter and a Path Parameter?
- **Path Parameter (`/books/:bookId`):** Part of the URL path used to identify a specific, singular resource (e.g., `/books/4` identifies the unique book whose ID is 4).
- **Query Parameter (`/books?search_q=Harry&order_by=price`):** Optional key-value pairs appended after `?` used to filter, sort, search, or paginate a collection of resources without altering the resource endpoint.

### Q2: What does "stateless" mean in RESTful API architecture?
- Every HTTP request from a client to a server must contain all the context and information necessary to understand and process the request. The server does not store client session state between requests, which enables seamless horizontal scalability and fault tolerance.

### Q3: Which HTTP status code should be returned for bad input versus a missing record?
- **Bad Input (`400 Bad Request`):** Returned when the client sends malformed JSON, missing mandatory fields (like `title` or `author`), or invalid data types (e.g., string for `price`).
- **Missing Record (`404 Not Found`):** Returned when the request is syntactically valid, but the target resource ID does not exist in the database (e.g., `GET /books/999`).

### Q4: Why must we `await` the database call in Express routes?
- Node.js is single-threaded and non-blocking. Database queries perform I/O asynchronously and return a Promise. Using `await` pauses route handler execution until SQLite finishes executing the query and returns the real data, preventing race conditions and empty responses.

### Q5: What is SQL Injection, and how do parameterized queries prevent it?
- **SQL Injection:** A vulnerability where malicious SQL commands are concatenated into raw SQL strings (e.g., `SELECT * FROM book WHERE title = '' OR 1=1;`).
- **Parameterized Queries:** Use `?` placeholders (e.g., `SELECT * FROM book WHERE title = ?;`). The database driver treats input strictly as literal values rather than executable SQL commands, completely neutralizing injection attempts.

### Q6: When is `PUT` used instead of `POST`?
- **`POST`:** Used to create a new subordinate resource. It is not idempotent (repeated calls create multiple new rows with distinct IDs).
- **`PUT`:** Used to replace or update an existing resource at a known URI (e.g., `PUT /books/1`). It is idempotent (making the exact same `PUT` request multiple times results in the same state).
