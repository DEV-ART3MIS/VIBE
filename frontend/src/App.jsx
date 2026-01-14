import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, LogOut } from 'lucide-react';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PollFeed from './components/PollFeed';
import './index.css';

function App() {
  // Simple auth state management
  const [user, setUser] = useState(null);

  return (
    <Router>
      <MainLayout user={user} setUser={setUser} />
    </Router>
  );
}

function MainLayout({ user, setUser }) {
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <nav style={{ marginBottom: '4rem', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => { if (user) window.location.href = '/' }}
        >
          <Zap size={40} color="var(--primary)" fill="var(--primary)" />
          <h1 style={{
            fontSize: '3.5rem',
            background: 'linear-gradient(to right, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.05em'
          }}>
            Vibe Check
          </h1>
        </motion.div>

        {user && (
          <div style={{ position: 'absolute', top: '10px', right: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.username}</span>
            <button
              onClick={handleLogout}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          <Route path="/" element={
            user ? <Dashboard user={user} /> : <Auth onLogin={setUser} />
          } />

          <Route path="/create" element={
            user ? <CreatePoll /> : <Navigate to="/" />
          } />

          <Route path="/feed" element={
            user ? <PollFeed /> : <Navigate to="/" />
          } />

          <Route path="/poll/:id" element={
            user ? <ViewPoll currentUser={user} /> : <Navigate to="/" />
          } />

        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
