-- SQLite Schema and Seed Data for Lab 03: REST API
DROP TABLE IF EXISTS book;

CREATE TABLE book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);

-- Seed Initial 10 Records
INSERT INTO book (title, author, price, pages) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 350, 180),
('To Kill a Mockingbird', 'Harper Lee', 450, 281),
('1984', 'George Orwell', 299, 328),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 650, 309),
('Harry Potter and the Chamber of Secrets', 'J.K. Rowling', 699, 341),
('The Hobbit', 'J.R.R. Tolkien', 550, 310),
('Clean Code', 'Robert C. Martin', 1200, 464),
('JavaScript: The Good Parts', 'Douglas Crockford', 750, 176),
('Atomic Habits', 'James Clear', 499, 320),
('You Don''t Know JS', 'Kyle Simpson', 899, 278);
