const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- AUTH ENDPOINTS ---

// Register
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, username, message: 'User registered successfully' });
    });
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Return user info (in a real app, send a token)
        res.json({ id: user.id, username: user.username });
    });
});

// --- POLL ENDPOINTS ---

// Get all polls (limited for feed)
app.get('/polls', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;

    // We want to fetch polls. For complexity, just fetching the questions first.
    db.all(`SELECT id, question FROM polls ORDER BY id DESC LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 1. Create a poll
app.post('/polls', (req, res) => {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: 'Invalid input. Provide a question and at least 2 options.' });
    }

    db.run(`INSERT INTO polls (question) VALUES (?)`, [question], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const pollId = this.lastID;
        const placeholders = options.map(() => '(?, ?)').join(',');
        const values = [];
        options.forEach(opt => {
            values.push(pollId, opt);
        });

        db.run(`INSERT INTO options (poll_id, option_text) VALUES ${placeholders}`, values, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: pollId, message: 'Poll created successfully' });
        });
    });
});

// 2. Get a poll with vote counts
app.get('/polls/:id', (req, res) => {
    const pollId = req.params.id;

    db.get(`SELECT * FROM polls WHERE id = ?`, [pollId], (err, poll) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        db.all(`SELECT * FROM options WHERE poll_id = ?`, [pollId], (err, options) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ poll, options });
        });
    });
});

// 3. Cast a vote
app.post('/polls/:id/vote', (req, res) => {
    const pollId = req.params.id;
    const { user_id, option_id } = req.body;

    if (!user_id || !option_id) {
        return res.status(400).json({ error: 'user_id and option_id are required' });
    }

    // Check if user already voted
    const insertVote = `INSERT INTO votes (poll_id, user_id, option_id) VALUES (?, ?, ?)`;

    db.run(insertVote, [pollId, user_id, option_id], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'User has already voted on this poll' });
            }
            return res.status(500).json({ error: err.message });
        }

        // Update vote count in options table
        db.run(`UPDATE options SET votes = votes + 1 WHERE id = ?`, [option_id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Vote cast successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
