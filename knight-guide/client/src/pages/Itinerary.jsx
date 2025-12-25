import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccessibleButton from '../components/AccessibleButton';

/**
 * Itinerary Page - AI-powered accessible travel planning
 * 
 * Features:
 * - Input destination and duration
 * - Uses user's accessibility profile
 * - Displays structured JSON itinerary
 * - Accessibility scores for each activity
 */
const Itinerary = ({ user, db }) => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState('1');
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState('');
    const [announcement, setAnnouncement] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    // Load user profile
    useEffect(() => {
        const loadProfile = async () => {
            if (user && db) {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const docSnap = await getDoc(doc(db, 'users', user.uid));
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (err) {
                    console.error('Error loading profile:', err);
                }
            } else {
                // Demo mode: try localStorage
                const saved = localStorage.getItem('knight-guide-profile');
                if (saved) {
                    setUserProfile(JSON.parse(saved));
                }
            }
        };
        loadProfile();
    }, [user, db]);

    const handleGenerate = async (e) => {
        e.preventDefault();

        if (!destination.trim()) {
            setError('Please enter a destination.');
            setAnnouncement('Error: Please enter a destination.');
            return;
        }

        setLoading(true);
        setError('');
        setAnnouncement('Generating your accessible itinerary. Please wait.');

        try {
            const response = await fetch('/api/itinerary/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: destination.trim(),
                    duration: parseInt(duration),
                    accessibilityNeeds: userProfile?.accessibilityNeeds || [],
                    mobilityDetails: userProfile?.mobilityDetails || '',
                    visionDetails: userProfile?.visionDetails || '',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate itinerary');
            }

            const data = await response.json();

            // Validate JSON structure
            if (!data.itinerary || !Array.isArray(data.itinerary)) {
                throw new Error('Invalid itinerary format received');
            }

            setItinerary(data);
            setAnnouncement(`Itinerary generated successfully. ${data.itinerary.length} activities planned.`);
        } catch (err) {
            console.error('Itinerary generation error:', err);
            setError('Failed to generate itinerary. Please try again.');
            setAnnouncement('Error: Failed to generate itinerary.');

            // Demo fallback - show sample itinerary
            if (!user) {
                setItinerary(getDemoItinerary(destination, parseInt(duration)));
                setAnnouncement('Showing demo itinerary.');
                setError('');
            }
        } finally {
            setLoading(false);
        }
    };

    // Demo itinerary for testing
    const getDemoItinerary = (dest, days) => ({
        destination: dest,
        duration: days,
        itinerary: [
            {
                day: 1,
                activities: [
                    {
                        time: '09:00',
                        activity: 'Accessible City Center Walking Tour',
                        location: `${dest} Downtown`,
                        accessibilityScore: 95,
                        notes: 'Fully wheelchair accessible with regular rest stops. Audio descriptions available.',
                        features: ['Wheelchair Ramps', 'Audio Guide', 'Rest Areas']
                    },
                    {
                        time: '12:00',
                        activity: 'Lunch at Inclusive Restaurant',
                        location: 'Accessibility-Rated Restaurant',
                        accessibilityScore: 90,
                        notes: 'Braille menus available. Staff trained in accessibility assistance.',
                        features: ['Braille Menu', 'Wheelchair Access', 'Trained Staff']
                    },
                    {
                        time: '14:00',
                        activity: 'Visit Accessible Museum',
                        location: `${dest} National Museum`,
                        accessibilityScore: 92,
                        notes: 'Free wheelchair loan. Tactile exhibits for vision-impaired visitors.',
                        features: ['Wheelchair Loan', 'Tactile Exhibits', 'Elevators']
                    },
                    {
                        time: '17:00',
                        activity: 'Accessible Park Visit',
                        location: `${dest} Central Park`,
                        accessibilityScore: 85,
                        notes: 'Paved pathways throughout. Accessible restrooms near entrance.',
                        features: ['Paved Paths', 'Accessible Restrooms', 'Benches']
                    }
                ]
            }
        ]
    });

    // Get score badge class
    const getScoreClass = (score) => {
        if (score >= 80) return 'score-high';
        if (score >= 50) return 'score-medium';
        return 'score-low';
    };

    return (
        <div className="page">
            <div className="container">
                <h1 style={{ marginBottom: '0.5rem' }}>Plan Accessible Trip</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    Get an AI-generated itinerary tailored to your accessibility needs.
                </p>

                {/* Planning Form */}
                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 className="card-header">Trip Details</h2>

                    <form onSubmit={handleGenerate}>
                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
                            <div>
                                <label htmlFor="destination">
                                    Destination
                                    <span style={{ color: 'var(--color-danger)' }} aria-hidden="true"> *</span>
                                </label>
                                <input
                                    id="destination"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g., New York City, Paris"
                                    required
                                    aria-required="true"
                                />
                            </div>

                            <div>
                                <label htmlFor="duration">Duration (days)</label>
                                <select
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                        <option key={d} value={d}>{d} {d === 1 ? 'day' : 'days'}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Profile indicator */}
                        {userProfile ? (
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(37, 99, 235, 0.1)',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem'
                            }}>
                                ✓ Using your accessibility profile: {userProfile.accessibilityNeeds?.join(', ') || 'No specific needs selected'}
                            </div>
                        ) : (
                            <div style={{
                                padding: '0.75rem',
                                background: '#fef3c7',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem'
                            }}>
                                <a href="/profile" style={{ color: 'var(--color-warning)', fontWeight: '600' }}>
                                    Set up your accessibility profile
                                </a> for personalized recommendations.
                            </div>
                        )}

                        {error && (
                            <div
                                className="error-message"
                                role="alert"
                                style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}
                            >
                                {error}
                            </div>
                        )}

                        <AccessibleButton
                            type="submit"
                            variant="primary"
                            loading={loading}
                            ariaLabel="Generate accessible itinerary"
                        >
                            {loading ? 'Generating...' : 'Generate Itinerary'}
                        </AccessibleButton>
                    </form>
                </section>

                {/* Generated Itinerary */}
                {itinerary && (
                    <section aria-label="Generated itinerary">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ margin: 0 }}>
                                    Your {itinerary.destination} Itinerary
                                </h2>
                                {itinerary.match && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: '#e0f2fe',
                                        color: '#0284c7',
                                        padding: '0.1rem 0.5rem',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        marginTop: '0.25rem'
                                    }}>
                                        Source: {itinerary.match}
                                    </span>
                                )}
                            </div>
                            <AccessibleButton
                                variant="secondary"
                                onClick={() => navigate('/map')}
                                ariaLabel="View itinerary locations on map"
                                style={{ minHeight: '38px', padding: '0.5rem 1rem' }}
                            >
                                View on Map
                            </AccessibleButton>
                        </div>

                        {itinerary.itinerary.map((day, dayIndex) => (
                            <div key={dayIndex} style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    marginBottom: '1rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '2px solid var(--color-primary)'
                                }}>
                                    Day {day.day}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {day.activities.map((activity, actIndex) => (
                                        <article
                                            key={actIndex}
                                            className="card"
                                            style={{ borderLeft: '4px solid var(--color-primary)' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                <div>
                                                    <span style={{
                                                        fontWeight: '700',
                                                        color: 'var(--color-primary)',
                                                        marginRight: '1rem'
                                                    }}>
                                                        {activity.time}
                                                    </span>
                                                    <h4 style={{ display: 'inline', fontSize: '1rem', fontWeight: '600' }}>
                                                        {activity.activity}
                                                    </h4>
                                                </div>
                                                <span className={`score-badge ${getScoreClass(activity.accessibilityScore)}`}>
                                                    {activity.accessibilityScore}/100
                                                </span>
                                            </div>

                                            {activity.location && (
                                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                                                    📍 {activity.location}
                                                </p>
                                            )}

                                            {activity.notes && (
                                                <p style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                                                    {activity.notes}
                                                </p>
                                            )}

                                            {activity.features && activity.features.length > 0 && (
                                                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {activity.features.map((feature, fIndex) => (
                                                        <span
                                                            key={fIndex}
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                padding: '0.25rem 0.75rem',
                                                                background: 'var(--color-bg-secondary)',
                                                                borderRadius: '9999px',
                                                                color: 'var(--color-text-secondary)'
                                                            }}
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Announcements */}
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                >
                    {announcement}
                </div>
            </div>
        </div>
    );
};

export default Itinerary;
