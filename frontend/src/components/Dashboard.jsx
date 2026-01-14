import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, TrendingUp } from 'lucide-react';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Hello, <span style={{ color: 'var(--primary)' }}>{user.username}</span>.
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>What's the vibe today?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {/* Create Card */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
                    onClick={() => navigate('/create')}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                >
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(204, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PlusCircle size={40} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create a Poll</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Start a new discussion.</p>
                    </div>
                </motion.div>

                {/* Vote Card */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}
                    onClick={() => navigate('/feed')}
                    whileHover={{ scale: 1.03, rotate: -1 }}
                >
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(185, 131, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={40} color="var(--accent-purple)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>View Trends</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Vote on ready-made polls.</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
