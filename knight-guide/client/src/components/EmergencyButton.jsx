import React, { useState, useCallback } from 'react';
import AccessibleButton from './AccessibleButton';

/**
 * EmergencyButton - One-tap emergency alert component
 * 
 * Features:
 * - Large, easily tappable button
 * - Confirmation dialog to prevent accidental triggers
 * - Includes geolocation and user medical notes
 * - Works even if other features fail
 */
const EmergencyButton = ({ userProfile = {} }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [alertSent, setAlertSent] = useState(false);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

    // Get user's current location
    const getLocation = useCallback(() => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ error: 'Geolocation not supported' });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    });
                },
                (err) => {
                    resolve({ error: err.message });
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }, []);

    const handleEmergencyClick = async () => {
        setShowConfirm(true);
        // Pre-fetch location while user confirms
        const loc = await getLocation();
        setLocation(loc);
    };

    const handleConfirm = async () => {
        setIsSending(true);
        setError(null);

        try {
            const emergencyData = {
                userId: userProfile.id || 'anonymous',
                userName: userProfile.name || 'Unknown User',
                emergencyContact: userProfile.emergencyContact || null,
                medicalNotes: userProfile.medicalNotes || 'No medical notes provided',
                accessibilityNeeds: userProfile.accessibilityNeeds || [],
                location: location,
                timestamp: new Date().toISOString(),
            };

            const response = await fetch('/api/emergency/alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emergencyData),
            });

            if (!response.ok) {
                throw new Error('Failed to send emergency alert');
            }

            setAlertSent(true);

            // Announce to screen readers
            const announcement = document.getElementById('emergency-announcement');
            if (announcement) {
                announcement.textContent = 'Emergency alert sent successfully. Help is on the way.';
            }
        } catch (err) {
            console.error('Emergency alert error:', err);
            setError('Failed to send alert. Please call emergency services directly.');

            // Still log to console as fallback
            console.log('=== EMERGENCY ALERT (BACKUP) ===');
            console.log('User:', userProfile.name);
            console.log('Location:', location);
            console.log('Medical Notes:', userProfile.medicalNotes);
            console.log('Time:', new Date().toISOString());
        } finally {
            setIsSending(false);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setLocation(null);
        setError(null);
    };

    const handleClose = () => {
        setShowConfirm(false);
        setAlertSent(false);
        setLocation(null);
        setError(null);
    };

    return (
        <>
            {/* Main Emergency Button */}
            <AccessibleButton
                onClick={handleEmergencyClick}
                variant="emergency"
                ariaLabel="Trigger emergency alert. Press to send help request with your location."
                disabled={showConfirm}
            >
                🆘 Emergency Alert
            </AccessibleButton>

            {/* Live region for announcements */}
            <div
                id="emergency-announcement"
                role="status"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            />

            {/* Confirmation Modal */}
            {showConfirm && (
                <div
                    className="modal-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="emergency-dialog-title"
                    aria-describedby="emergency-dialog-desc"
                >
                    <div className="modal" tabIndex="-1">
                        {alertSent ? (
                            // Success state
                            <>
                                <div
                                    style={{
                                        textAlign: 'center',
                                        padding: '1rem',
                                        color: 'var(--color-secondary)'
                                    }}
                                >
                                    <span style={{ fontSize: '4rem' }} aria-hidden="true">✓</span>
                                    <h2
                                        id="emergency-dialog-title"
                                        className="modal-title"
                                        style={{ color: 'var(--color-secondary)' }}
                                    >
                                        Alert Sent Successfully
                                    </h2>
                                    <p id="emergency-dialog-desc" style={{ marginBottom: '1rem' }}>
                                        Emergency services have been notified. Help is on the way.
                                        {location && !location.error && (
                                            <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                                Your location has been shared.
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="modal-actions" style={{ justifyContent: 'center' }}>
                                    <AccessibleButton
                                        onClick={handleClose}
                                        variant="primary"
                                        ariaLabel="Close emergency dialog"
                                        autoFocus
                                    >
                                        Close
                                    </AccessibleButton>
                                </div>
                            </>
                        ) : (
                            // Confirmation state
                            <>
                                <h2
                                    id="emergency-dialog-title"
                                    className="modal-title"
                                    style={{ color: 'var(--color-danger)' }}
                                >
                                    ⚠️ Confirm Emergency Alert
                                </h2>
                                <div id="emergency-dialog-desc">
                                    <p style={{ marginBottom: '1rem' }}>
                                        This will send an emergency alert with your:
                                    </p>
                                    <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                                        <li>Current location</li>
                                        <li>Medical notes and accessibility needs</li>
                                        <li>Emergency contact information</li>
                                    </ul>

                                    {location?.error && (
                                        <p style={{
                                            color: 'var(--color-warning)',
                                            marginBottom: '1rem',
                                            padding: '0.75rem',
                                            background: '#fef3c7',
                                            borderRadius: '8px'
                                        }}>
                                            ⚠️ Could not get your location. Alert will be sent without location data.
                                        </p>
                                    )}

                                    {error && (
                                        <p style={{
                                            color: 'var(--color-danger)',
                                            marginBottom: '1rem',
                                            padding: '0.75rem',
                                            background: '#fee2e2',
                                            borderRadius: '8px'
                                        }}>
                                            ❌ {error}
                                        </p>
                                    )}

                                    <p style={{ fontWeight: '600' }}>
                                        Are you sure you want to send an emergency alert?
                                    </p>
                                </div>

                                <div className="modal-actions">
                                    <AccessibleButton
                                        onClick={handleCancel}
                                        variant="secondary"
                                        ariaLabel="Cancel emergency alert"
                                        disabled={isSending}
                                    >
                                        Cancel
                                    </AccessibleButton>
                                    <AccessibleButton
                                        onClick={handleConfirm}
                                        variant="danger"
                                        ariaLabel="Confirm and send emergency alert"
                                        loading={isSending}
                                        autoFocus
                                    >
                                        {isSending ? 'Sending...' : 'Yes, Send Alert'}
                                    </AccessibleButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default EmergencyButton;
