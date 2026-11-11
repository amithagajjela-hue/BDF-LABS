const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route 1: Welcome text
app.get("/", (request, response) => {
  response.status(200).send("Welcome to Backend Development Fundamentals - Lab 01 Express Server!");
});

// Route 2: About (JSON with student name, registration number, section)
app.get("/about", (request, response) => {
  response.status(200).json({
    name: "G.Amitha",
    registrationNumber: "252U1R8022",
    section: "CSE-QE-2A, S-14/113",
    course: "Backend Development Fundamentals (BDF)",
    lab: "Lab 01 - Node.js and Express Fundamentals"
  });
});

// Route 3: Current Date and Time
app.get("/time", (request, response) => {
  response.status(200).json({
    currentTime: new Date().toISOString(),
    localTime: new Date().toString()
  });
});

// 404 Handler for unknown routes
app.use((request, response) => {
  response.status(404).json({
    message: "Route not found"
  });
});

// Start listening if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}/`);
  });
}

module.exports = app;
