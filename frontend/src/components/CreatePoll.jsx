import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [optionsStr, setOptionsStr] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (options.length < 2) {
            alert('Please provide at least 2 options.');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/polls', {
                question,
                options
            });
            navigate(`/poll/${res.data.id}`);
        } catch (err) {
            console.error(err);
            alert('Error creating poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                <PlusCircle color="var(--primary)" size={24} />
                <h2>Create a New Poll</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Start a vibe check by asking a question.</p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Question</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="e.g. What's your favorite coding snack?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Options (comma separated)</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Chips, Pizza, Coffee"
                        value={optionsStr}
                        onChange={(e) => setOptionsStr(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Launch Poll'}
                </button>
            </form>
        </motion.div>
    );
};

export default CreatePoll;
