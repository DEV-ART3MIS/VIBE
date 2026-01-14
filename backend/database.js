const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'polling.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Create polls table
        db.run(`CREATE TABLE IF NOT EXISTS polls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL
        )`);

        // Create options table
        db.run(`CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER NOT NULL,
            option_text TEXT NOT NULL,
            votes INTEGER DEFAULT 0,
            is_correct BOOLEAN DEFAULT 0,
            FOREIGN KEY (poll_id) REFERENCES polls(id)
        )`);

        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // Create votes table to track user votes and prevent duplicates
        db.run(`CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            poll_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            option_id INTEGER NOT NULL,
            UNIQUE(poll_id, user_id),
            FOREIGN KEY (poll_id) REFERENCES polls(id),
            FOREIGN KEY (option_id) REFERENCES options(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        console.log('Database tables initialized.');
    });
}

module.exports = db;
