// Plain Node.js HTTP Server using core 'http' module
const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello");
});

server.listen(PORT, () => {
  console.log(`Plain HTTP Server running at http://localhost:${PORT}/`);
});

module.exports = server;
