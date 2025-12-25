import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AccessibleButton from '../components/AccessibleButton';
import EmergencyButton from '../components/EmergencyButton';

/**
 * Profile Page - User accessibility profile management
 * 
 * Features:
 * - Accessibility needs selection (mobility, vision, hearing, cognitive)
 * - Emergency contact information
 * - Medical notes storage
 * - Profile save to Firestore
 */
const Profile = ({ user, db }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    // Profile state
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        accessibilityNeeds: [],
        mobilityDetails: '',
        visionDetails: '',
        hearingDetails: '',
        cognitiveDetails: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        medicalNotes: '',
    });

    // Accessibility options
    const accessibilityOptions = [
        { id: 'wheelchair', label: 'Wheelchair User', category: 'mobility' },
        { id: 'walker', label: 'Walker/Mobility Aid', category: 'mobility' },
        { id: 'limited-walking', label: 'Limited Walking Distance', category: 'mobility' },
        { id: 'blind', label: 'Blind/Low Vision', category: 'vision' },
        { id: 'color-blind', label: 'Color Blind', category: 'vision' },
        { id: 'deaf', label: 'Deaf/Hard of Hearing', category: 'hearing' },
        { id: 'hearing-aid', label: 'Hearing Aid User', category: 'hearing' },
        { id: 'cognitive', label: 'Cognitive/Learning Disability', category: 'cognitive' },
        { id: 'anxiety', label: 'Anxiety/Sensory Sensitivity', category: 'cognitive' },
        { id: 'service-animal', label: 'Service Animal', category: 'other' },
    ];

    // Load existing profile
    useEffect(() => {
        const loadProfile = async () => {
            if (!user || !db) return;

            setLoading(true);
            try {
                const { doc, getDoc } = await import('firebase/firestore');
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user, db]);

    // Handle accessibility need toggle
    const handleNeedToggle = (needId) => {
        setProfile(prev => ({
            ...prev,
            accessibilityNeeds: prev.accessibilityNeeds.includes(needId)
                ? prev.accessibilityNeeds.filter(n => n !== needId)
                : [...prev.accessibilityNeeds, needId]
        }));
        setSaved(false);
    };

    // Handle input change
    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    // Save profile
    const handleSave = async () => {
        setSaving(true);
        setAnnouncement('');

        try {
            if (user && db) {
                const { doc, setDoc } = await import('firebase/firestore');
                await setDoc(doc(db, 'users', user.uid), {
                    ...profile,
                    email: user.email,
                    updatedAt: new Date().toISOString(),
                }, { merge: true });
            } else {
                // Demo mode: save to localStorage
                localStorage.setItem('knight-guide-profile', JSON.stringify(profile));
            }

            setSaved(true);
            setAnnouncement('Profile saved successfully.');
        } catch (err) {
            console.error('Error saving profile:', err);
            setAnnouncement('Error saving profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
                    <span className="loading-spinner" style={{ display: 'block', margin: '0 auto 1rem' }} />
                    <p role="status">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Your Accessibility Profile</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    Tell us about your accessibility needs so we can personalize your travel experience.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    {/* Basic Information */}
                    <section className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="card-header">Basic Information</h2>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div>
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Accessibility Needs */}
                    <section className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="card-header">Accessibility Needs</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                            Select all that apply to you. This helps us find accessible venues and plan suitable activities.
                        </p>

                        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                            <legend className="sr-only">Select your accessibility needs</legend>

                            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                {accessibilityOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            background: profile.accessibilityNeeds.includes(option.id)
                                                ? 'rgba(37, 99, 235, 0.1)'
                                                : 'var(--color-bg-secondary)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: profile.accessibilityNeeds.includes(option.id)
                                                ? '2px solid var(--color-primary)'
                                                : '2px solid transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={profile.accessibilityNeeds.includes(option.id)}
                                            onChange={() => handleNeedToggle(option.id)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: 'var(--color-primary)'
                                            }}
                                        />
                                        <span>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {/* Additional details for selected needs */}
                        {profile.accessibilityNeeds.some(n => ['wheelchair', 'walker', 'limited-walking'].includes(n)) && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <label htmlFor="mobilityDetails">Mobility Details</label>
                                <textarea
                                    id="mobilityDetails"
                                    value={profile.mobilityDetails}
                                    onChange={(e) => handleChange('mobilityDetails', e.target.value)}
                                    rows={2}
                                    placeholder="E.g., Maximum walking distance, ramp requirements, etc."
                                />
                            </div>
                        )}

                        {profile.accessibilityNeeds.some(n => ['blind', 'color-blind'].includes(n)) && (
                            <div style={{ marginTop: '1.25rem' }}>
                                <label htmlFor="visionDetails">Vision Details</label>
                                <textarea
                                    id="visionDetails"
                                    value={profile.visionDetails}
                                    onChange={(e) => handleChange('visionDetails', e.target.value)}
                                    rows={2}
                                    placeholder="E.g., Screen reader usage, preferred font sizes, etc."
                                />
                            </div>
                        )}
                    </section>

                    {/* Emergency Contact */}
                    <section className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="card-header">Emergency Contact</h2>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            <div>
                                <label htmlFor="emergencyName">Contact Name</label>
                                <input
                                    id="emergencyName"
                                    type="text"
                                    value={profile.emergencyContactName}
                                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                                    placeholder="Emergency contact name"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyPhone">Contact Phone</label>
                                <input
                                    id="emergencyPhone"
                                    type="tel"
                                    value={profile.emergencyContactPhone}
                                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <label htmlFor="emergencyRelation">Relationship</label>
                                <input
                                    id="emergencyRelation"
                                    type="text"
                                    value={profile.emergencyContactRelation}
                                    onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                                    placeholder="E.g., Spouse, Parent, Friend"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Medical Notes */}
                    <section className="card" style={{ marginBottom: '1.5rem' }}>
                        <h2 className="card-header">Medical Notes</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                            Important medical information for emergency responders. This is shared when you trigger an emergency alert.
                        </p>

                        <label htmlFor="medicalNotes">Medical Information</label>
                        <textarea
                            id="medicalNotes"
                            value={profile.medicalNotes}
                            onChange={(e) => handleChange('medicalNotes', e.target.value)}
                            rows={4}
                            placeholder="Allergies, medications, conditions, or other important medical information..."
                        />
                    </section>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <AccessibleButton
                            type="submit"
                            variant="primary"
                            loading={saving}
                            ariaLabel="Save your accessibility profile"
                        >
                            {saved ? '✓ Saved' : 'Save Profile'}
                        </AccessibleButton>

                        <AccessibleButton
                            variant="secondary"
                            onClick={() => navigate('/itinerary')}
                            ariaLabel="Go to itinerary planning"
                        >
                            Plan a Trip →
                        </AccessibleButton>
                    </div>

                    {/* Emergency Button */}
                    <section className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                        <h2 className="card-header" style={{ color: 'var(--color-danger)' }}>
                            Emergency Alert
                        </h2>
                        <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                            If you need immediate assistance, use this button to send an emergency alert with your location and medical information.
                        </p>
                        <EmergencyButton userProfile={profile} />
                    </section>
                </form>

                {/* Live announcements */}
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

export default Profile;
