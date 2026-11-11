# Backend Development Fundamentals (BDF) Lab Assignments

### 👤 Student Details:
- **Name:** G.Amitha
- **Registration Number:** `252U1R8022`
- **Course:** Backend Development Fundamentals (BDF)
- **Year & Term:** Year II Term II
- **Section:** CSE-QE-2A, S-14/113
- **Institution:** Aurora

---

### 📂 Lab Index & Status:

| Lab Number | Title | Status | Directory | Render Deployment Link |
| :--- | :--- | :---: | :--- | :--- |
| **Lab 01** | Node.js and Express Server Fundamentals | **Completed** | [`lab-01/`](./lab-01/) | [`https://lab-01-express-server-252u1r8022.onrender.com`](https://lab-01-express-server-252u1r8022.onrender.com) |
| **Lab 02** | SQLite Database and Relational CRUD Routes | **Completed** | [`lab-02/`](./lab-02/) | [`https://lab-02-sqlite-server-252u1r8022.onrender.com`](https://lab-02-sqlite-server-252u1r8022.onrender.com) |
| **Lab 03** | REST API, Query Parameters, Validation & Debugging | **Completed** | [`lab-03/`](./lab-03/) | [`https://lab-03-rest-api-252u1r8022.onrender.com`](https://lab-03-rest-api-252u1r8022.onrender.com) |

---

### 🚀 Multi-Service Render Deployment:
All three labs are configured as microservices in the root [`render.yaml`](./render.yaml) blueprint:
- **Node Version:** `20.18.0`
- **SQLite Native Source Build:** Prevents GLIBC compatibility errors on Linux hosting:
  ```bash
  npm install && npm rebuild sqlite3 --build-from-source
  ```
- **Automatic Database Seeding:** Labs 02 and 03 include pre-seeded `books.db` files and automated schema generation on cold boot.
