import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, ArrowRight } from 'lucide-react';

const PollFeed = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await axios.get('http://localhost:5000/polls?limit=25');
                setPolls(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading trends...</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gap: '1rem', width: '100%', maxWidth: '800px', margin: '0 auto' }}
        >
            <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Trending Vibe Checks</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Explore what others are asking.</p>
            </div>

            {polls.map((poll) => (
                <motion.div
                    key={poll.id}
                    variants={itemVariants}
                    className="glass-card"
                    style={{ padding: '1.5rem', cursor: 'pointer', borderRadius: '20px' }}
                    onClick={() => navigate(`/poll/${poll.id}`)}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{poll.question}</h3>
                        <ArrowRight size={20} color="var(--primary)" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default PollFeed;
