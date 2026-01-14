import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, User, BarChart2 } from 'lucide-react';

const ViewPoll = ({ currentUser }) => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [options, setOptions] = useState([]);
    const [userId, setUserId] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voteLoading, setVoteLoading] = useState(false);

    const fetchPoll = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/polls/${id}`);
            setPoll(res.data.poll);
            setOptions(res.data.options);
        } catch (err) {
            console.error(err);
            alert('Error fetching poll');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoll();
        const interval = setInterval(fetchPoll, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const handleVote = async () => {
        const voterId = currentUser?.id || userId;

        if (!voterId) {
            alert('Please login to vote.');
            return;
        }
        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }

        setVoteLoading(true);
        try {
            await axios.post(`http://localhost:5000/polls/${id}/vote`, {
                user_id: voterId,
                option_id: selectedOption
            });
            fetchPoll(); // Refresh results
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                alert('Error casting vote');
            }
        } finally {
            setVoteLoading(false);
        }
    };

    if (loading) return <div className="glass-card" style={{ textAlign: 'center' }}>Loading vibe check...</div>;
    if (!poll) return <div className="glass-card">Poll not found.</div>;

    const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card"
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <h2 style={{ marginBottom: '0.5rem', flex: 1 }}>{poll.question}</h2>
                <BarChart2 color="var(--primary)" size={28} style={{ marginTop: '4px' }} />
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
                <span>ID: {poll.id}</span>
                <span>•</span>
                <span>{totalVotes} Votes</span>
            </div>

            {!currentUser && (
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        <User size={16} />
                        Your User ID (required)
                    </label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Enter your unique ID (e.g. name)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
            )}

            <div className="options-list">
                {options.map(opt => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                    const isSelected = selectedOption === opt.id;

                    return (
                        <motion.div
                            key={opt.id}
                            className={`option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedOption(opt.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '20px', height: '20px',
                                            borderRadius: '50%',
                                            border: isSelected ? '2px solid var(--primary)' : '2px solid var(--text-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{opt.option_text}</span>
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{percentage}%</span>
                                </div>

                                <div className="vote-bar-bg">
                                    <motion.div
                                        className="vote-bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    />
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                                    {opt.votes} votes
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.button
                className="btn-primary"
                onClick={handleVote}
                disabled={voteLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {voteLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Saving...
                    </span>
                ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        Confirm Vote <Check size={18} />
                    </span>
                )}
            </motion.button>
        </motion.div>
    );
};

export default ViewPoll;
