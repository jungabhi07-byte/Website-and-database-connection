# MySQL Demo Website

This is a minimal demo showing how to connect a website to a MySQL database using Node.js + Express backend and a static frontend.

## Project layout
- server.js — Express server + MySQL connection (serves static files and API)
- public/
  - index.html
  - script.js
  - styles.css
- .env.example
- package.json

## Setup (local)
1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill credentials:
   ```bash
   cp .env.example .env
   # then edit .env with your DB values
   ```

3. Create database and table in MySQL (example):
   ```sql
   CREATE DATABASE IF NOT EXISTS demo_db;
   USE demo_db;

   CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Start server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Security notes
- Never expose DB credentials in client-side code. Always use a server/API as shown.
- Do not commit `.env` with real credentials. Use `.env.example` in repo and add `.env` to `.gitignore`.
- For production, use environment variables set by your host or CI/CD, and use MySQL accounts with limited privileges.
- Use TLS (HTTPS) in production and consider prepared statements and input validation (we use prepared statements for INSERT).

## Deploying
- You can deploy this to platforms like Heroku, Render, Railway, or your VPS.
- For GitHub Pages: GitHub Pages cannot run a backend — you would need a separate backend host or serverless function and configure the frontend to call that API.
- On modern hosts (Render, Railway), set environment variables via the dashboard and point the host to run `npm start`.

If you'd like, I can:
- create a complete commit-ready repo tree for you,
- or give instructions that match the host you plan to use (e.g., Render, Railway, Vercel with a serverless function, or a VPS).
