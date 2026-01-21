// Simple Express server that serves static files and exposes a safe API to MySQL
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.static('public')); // serve index.html, script.js, styles.css from /public

const PORT = process.env.PORT || 3000;

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Optional: simple ping/check
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('Connected to MySQL');
}

// GET /api/users - returns rows from `users` table
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email FROM users LIMIT 100');
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
});

// POST /api/users - add a user (uses prepared statements)
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ ok: false, error: 'name and email required' });

  try {
    const [result] = await pool.execute('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ ok: true, insertId: result.insertId });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ ok: false, error: 'Database error' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
