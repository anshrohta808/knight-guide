import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VolunteerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tasksRes, leaderboardRes] = await Promise.all([
                    fetch('/api/volunteer/tasks'),
                    fetch('/api/volunteer/leaderboard')
                ]);

                const tasksData = await tasksRes.json();
                const leaderboardData = await leaderboardRes.json();

                setTasks(tasksData);
                setLeaderboard(leaderboardData);
            } catch (err) {
                console.error('Error fetching volunteer data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-spinner" style={{ margin: '100px auto' }}></div>;
    }

    return (
        <div className="page" style={{ paddingTop: '80px' }}>
            <div className="container">
                <h1 className="hero-title animate-fadeIn" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    🤝 Volunteer Dashboard
                </h1>
                <p className="hero-subtitle animate-fadeIn" style={{ animationDelay: '0.1s', marginBottom: '3rem' }}>
                    Make a difference in your community by helping verify accessibility information.
                </p>

                {/* Impact Stats */}
                <div className="stats-grid animate-fadeIn" style={{ animationDelay: '0.2s', marginBottom: '3rem' }}>
                    <div className="stat-card">
                        <div className="stat-number">12</div>
                        <div className="stat-label">Hours Contributed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">45</div>
                        <div className="stat-label">Locations Verified</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">150</div>
                        <div className="stat-label">Points Earned</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">Rank</div>
                        <div className="stat-label">Community Guardian</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Available Tasks */}
                    <section className="glass-panel animate-fadeIn" style={{ animationDelay: '0.3s', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📋 Available Missions
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {tasks.map((task, index) => (
                                <div key={task.id || index} style={{
                                    padding: '1rem',
                                    background: 'var(--color-bg-glass)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    transition: 'transform 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                    className="hover-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{task.title}</h3>
                                        <span style={{
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            +{task.points} pts
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        <span>📍 {task.location}</span>
                                        <span>{task.type}</span>
                                    </div>
                                    <button className="btn btn-sm btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Connect</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Leaderboard / Upcoming */}
                    <section className="glass-panel animate-fadeIn" style={{ animationDelay: '0.4s', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🏆 Top Contributors
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {leaderboard.map((user, index) => (
                                <div key={user.id || index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    background: user.name === 'You' ? 'rgba(var(--color-primary-rgb), 0.1)' : 'transparent',
                                    borderRadius: 'var(--radius-md)',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{user.badge || `#${index + 1}`}</span>
                                        <span style={{ fontWeight: user.name === 'You' ? '700' : '400' }}>{user.name}</span>
                                    </div>
                                    <span style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>{user.points} pts</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Activity</h2>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                                No recent activity this week. Pick a mission to get started!
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;
