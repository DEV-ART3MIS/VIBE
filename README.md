# Vibe Check Polling System

A full-stack polling application with a premium "Glassmorphism" design.
Built with Node.js, Express, SQLite, and React (Vite).

## 📂 Project Structure

```
Vibe/
├── backend/                # Node.js + Express Backend
│   ├── database.js         # SQLite connection & schema
│   ├── server.js           # API Endpoints
│   ├── polling.db          # Database file (created on runtime)
│   └── package.json
└── frontend/               # React Frontend (Vite)
    ├── src/
    │   ├── components/
    │   │   ├── CreatePoll.jsx
    │   │   └── ViewPoll.jsx
    │   ├── App.jsx         # Routing
    │   └── index.css       # Global Glassmorphism Styles
    └── package.json
```

## 🚀 Getting Started

### 1. Start the Backend

Open a terminal in the root directory:

```bash
cd backend
npm install   # (If not already installed)
node server.js
```
The backend will run on `http://localhost:5000`.
It will automatically create the `polling.db` file.

### 2. Start the Frontend

Open a **new** terminal in the root directory:

```bash
cd frontend
npm install   # (If not already installed)
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## 🛠 Features

### Backend
- **POST /polls**: Create a poll (e.g. `{"question": "Hi?", "options": ["A", "B"]}`)
- **GET /polls/:id**: Fetch poll details and live results.
- **POST /polls/:id/vote**: Cast a vote (Checks for duplicates via `user_id`).
- **Database**: SQLite3 with `polls`, `options`, and `votes` tables (Unique constraint on `poll_id, user_id`).

### Frontend
- **Create Poll**: Simple UI to input question and options. automatically redirects to the poll page.
- **View Poll & Vote**: see the poll question, options, and live percentage bars.
- **Real-time-ish**: Updates live results after you vote.

## 🔎 Viewing the Database

To inspect the data manually:
1. Download [DB Browser for SQLite](https://sqlitebrowser.org/).
2. Open `backend/polling.db` (this file appears after you start the server).
3. Browse Data in `polls`, `options`, or `votes` tables.

## 🎨 Design

Uses a custom CSS implementation of **Glassmorphism**:
- Translucent layouts with `backdrop-filter: blur`.
- Smooth gradients and hover effects.
- Clean typography (Inter/System fonts).
#VIBE

## Created with ❤️ by a passionate programmer
## Submittion from- Sarwadnya Prakash Maile.
