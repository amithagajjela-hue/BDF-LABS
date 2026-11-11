const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = path.join(__dirname, "books.db");
const sqlPath = path.join(__dirname, "setup.sql");

async function seedDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const sql = fs.readFileSync(sqlPath, "utf8");
    await db.exec(sql);
    console.log("Database seeded successfully from setup.sql into books.db");

    const rows = await db.all("SELECT * FROM book;");
    console.log(`Total rows in 'book' table: ${rows.length}`);
    await db.close();
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();
