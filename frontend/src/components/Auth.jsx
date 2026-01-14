import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight } from 'lucide-react';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
            const res = await axios.post(endpoint, { username, password });

            if (res.data.id) {
                onLogin(res.data);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={isLogin ? 'login' : 'register'}
                    initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card"
                    style={{ maxWidth: '400px' }}
                >
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h2>{isLogin ? 'Welcome Back' : 'Join the Vibe'}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {isLogin ? 'Enter your credentials to access your polls.' : 'Create an account to start polling.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <div style={{ position: 'relative' }}>
                                <User size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: '3rem' }}
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: '3rem' }}
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <span
                            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => { setError(''); setIsLogin(!isLogin); }}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Auth;
