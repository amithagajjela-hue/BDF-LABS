# Lab 1: Node.js and Express server

**Backend Development Fundamentals · Year II Term II · Aurora**  
**Student Name:** G.Amitha  
**Registration Number:** 252U1R8022  
**Section:** CSE-QE-2A, S-14/113  

---

## 🌐 Live Deployment & Links
- **Render Live URL:** [https://lab-01-express-server-252u1r8022.onrender.com](https://lab-01-express-server-252u1r8022.onrender.com)
- **Local Base URL:** `http://localhost:3000`
- **GitHub Repository:** `BDF-LABS/lab-01/`

---

## 🎯 Objectives
- Understand the basics of Node.js and npm package initialization (`npm init -y`).
- Explore the internal structure and role of `package.json` vs `node_modules`.
- Build a baseline HTTP server using Node.js's built-in `http` module (`http.createServer`).
- Refactor and expand the web server using the **Express.js** framework (`express()`, `app.listen()`).
- Implement core routes (`/`, `/about`, `/time`) and handle unknown routes with appropriate HTTP status codes (200, 404).

---

## 📦 Understanding `package.json` Fields

When running `npm init -y`, npm generates a `package.json` file. Each field serves a specific purpose:

| Field | Purpose | Example in this Lab |
| :--- | :--- | :--- |
| `name` | Unique identifier of the package/project in lowercase. | `"lab-01-express-server"` |
| `version` | Current release version following Semantic Versioning (major.minor.patch). | `"1.0.0"` |
| `description` | Summary of the project for documentation. | `"Lab 01 - Node.js and Express Server Fundamentals"` |
| `main` | Primary entry point file that gets executed when the package is required. | `"index.js"` |
| `scripts` | CLI aliases to run lifecycle and development commands. | `"start": "node index.js"`, `"dev": "nodemon index.js"` |
| `dependencies` | Third-party npm packages strictly required in production runtime. | `"express"`, `"cors"` |
| `devDependencies` | Packages required strictly during local development/testing. | `"nodemon"` |
| `engines` | Specifies supported Node.js runtime versions. | `"node": ">=20.18.0"` |
| `author` | Creator/maintainer of the project. | `"G.Amitha (252U1R8022)"` |

---

## 🚀 How to Install and Run Locally

### 1. Prerequisites
- **Node.js**: `v20.18.0` or higher
- **NPM**: `v10+`

### 2. Installation
```bash
cd lab-01
npm install
```

### 3. Running the Plain HTTP Server (`http.createServer`)
```bash
npm run plain
# or: node plain-server.js
```
The plain server listens at `http://localhost:3000/` and returns plain text `"Hello"`.

### 4. Running the Express Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (Auto-restarts with Nodemon):**
  ```bash
  npm run dev
  ```
The Express server listens at `http://localhost:3000/`.

---

## 📋 Endpoints & Routes Table

| Method | Endpoint | Response Format | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Plain Text | `200 OK` | Welcome text: `"Welcome to Backend Development Fundamentals - Lab 01 Express Server!"` |
| `GET` | `/about` | JSON | `200 OK` | Student details (name, registration number, section, course). |
| `GET` | `/time` | JSON | `200 OK` | Current system timestamp via `new Date()`. |
| `ALL` | `/*` (Unknown) | JSON | `404 Not Found` | Catch-all handler returning `{ "message": "Route not found" }`. |

---

## 📸 Postman / Browser Screenshots Evidence

All screenshots are stored in [`screenshots/`](./screenshots/):

### 1. Plain HTTP Server Output (`GET /`)
- **URL:** `http://localhost:3000/`
- **Output:** `Hello` (Status `200 OK`)
![01-plain-http-server](screenshots/01-plain-http-server.png)

### 2. Express Server Welcome (`GET /`)
- **URL:** `http://localhost:3000/`
- **Output:** `"Welcome to Backend Development Fundamentals - Lab 01 Express Server!"` (Status `200 OK`)
![02-express-welcome](screenshots/02-express-welcome.png)

### 3. Express About Route (`GET /about`)
- **URL:** `http://localhost:3000/about`
- **Output:**
```json
{
  "name": "G.Amitha",
  "registrationNumber": "252U1R8022",
  "section": "CSE-QE-2A, S-14/113",
  "course": "Backend Development Fundamentals (BDF)",
  "lab": "Lab 01 - Node.js and Express Fundamentals"
}
```
![03-express-about](screenshots/03-express-about.png)

### 4. Express Time Route (`GET /time`)
- **URL:** `http://localhost:3000/time`
- **Output:**
```json
{
  "currentTime": "2026-11-11T06:58:00.000Z",
  "localTime": "Wed Nov 11 2026 12:28:00 GMT+0530 (India Standard Time)"
}
```
![04-express-time](screenshots/04-express-time.png)

### 5. Unknown Path 404 Error (`GET /invalid-url`)
- **URL:** `http://localhost:3000/invalid-url`
- **Output:**
```json
{
  "message": "Route not found"
}
```
![05-express-404](screenshots/05-express-404.png)

---

## 🛠️ Notes: Problems Faced and How They Were Solved

1. **Port 3000 In Use (`EADDRINUSE`):**
   - *Problem:* When switching between `plain-server.js` and `index.js`, the previous server sometimes held the port open.
   - *Solution:* Added dynamic port binding `const PORT = process.env.PORT || 3000;` and used PowerShell `Get-Process node | Stop-Process -Force` to cleanly close hanging background instances.

2. **JSON Header Serialization:**
   - *Problem:* In plain HTTP, sending JSON requires manual headers `writeHead(200, {'Content-Type': 'application/json'})` and `JSON.stringify()`.
   - *Solution:* Migrating to Express streamlined this via `response.status(200).json(...)`, which handles content negotiation, serialization, and headers automatically.

---

## 💡 Viva Questions & Answers

### Q1: What is the difference between `package.json` and `node_modules`?
- **`package.json`:** A lightweight manifest file that lists project metadata, execution scripts, and the exact names/version ranges of required dependencies. It is committed to version control (Git).
- **`node_modules`:** A physical directory where npm downloads and extracts all the actual third-party package source codes, binary bindings, and their sub-dependencies. It is very heavy and is always added to `.gitignore`.

### Q2: What does `app.listen()` do?
- `app.listen(port, callback)` binds the web application to a specified TCP port on the host machine and starts listening for incoming client network connections and HTTP requests.

### Q3: What do `request` and `response` represent in Express?
- **`request` (req):** An object representing the incoming HTTP request from the client, providing access to request URLs, query parameters (`req.query`), route path parameters (`req.params`), headers, and body payload (`req.body`).
- **`response` (res):** An object used to construct and send the HTTP response back to the client, allowing developers to set headers, HTTP status codes (`res.status(200)`), and deliver payload formats (`res.send()`, `res.json()`).
