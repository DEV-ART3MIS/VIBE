const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const db = require('./database');

const files = ['questions_part1.json', 'questions_part2.json', 'questions_part3.json', 'questions_part4.json', 'questions_part5.json'];

function loadQuestions() {
    let questions = [];
    files.forEach(file => {
        try {
            const p = path.resolve(__dirname, file);
            if (fs.existsSync(p)) {
                const raw = fs.readFileSync(p, 'utf8');
                const d = JSON.parse(raw);
                questions = questions.concat(d);
            }
        } catch (e) {
            console.error(`Error loading ${file}:`, e.message);
        }
    });
    return questions;
}

const runAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this);
    });
});

async function seed() {
    console.log("Waiting for database initialization...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    const questions = loadQuestions();
    console.log(`Loaded ${questions.length} questions.`);

    try {
        await runAsync('BEGIN TRANSACTION');

        let count = 0;
        for (const q of questions) {
            if (!q.question) continue;

            try {
                const res = await runAsync('INSERT INTO polls (question) VALUES (?)', [q.question]);
                const pollId = res.lastID;

                const options = [
                    { key: 'A', t: q.A },
                    { key: 'B', t: q.B },
                    { key: 'C', t: q.C },
                    { key: 'D', t: q.D }
                ];

                for (const opt of options) {
                    if (opt.t) {
                        const isCorrect = (q.answer === opt.key) ? 1 : 0;
                        await runAsync('INSERT INTO options (poll_id, option_text, is_correct) VALUES (?, ?, ?)', [pollId, opt.t, isCorrect]);
                    }
                }
                count++;
            } catch (innerErr) {
                console.error(`Failed to insert question "${q.question}": ${innerErr.message}`);
            }
        }

        await runAsync('COMMIT');
        console.log(`Seeding complete. Inserted ${count} polls.`);
    } catch (err) {
        console.error('Seeding failed (Rollback):', err);
        try { await runAsync('ROLLBACK'); } catch (e) { }
    } finally {
        // We close the DB connection here as this is a standalone script run
        db.close((err) => {
            if (err) console.error("Error closing DB:", err.message);
            else console.log("Database connection closed.");
        });
    }
}

seed();
