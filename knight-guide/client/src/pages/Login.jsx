import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AccessibleButton from '../components/AccessibleButton';

/**
 * Login Page - Accessible authentication
 * 
 * Features:
 * - Email + password login/register
 * - Proper form labels and error handling
 * - Screen reader announcements
 * - Keyboard navigation
 */
const Login = ({ auth }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [announcement, setAnnouncement] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setAnnouncement('');

        // Validation
        if (!email || !password) {
            setError('Please fill in all required fields.');
            setAnnouncement('Error: Please fill in all required fields.');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match.');
            setAnnouncement('Error: Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setAnnouncement('Error: Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            if (auth) {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    setAnnouncement('Login successful. Redirecting to profile.');
                } else {
                    await createUserWithEmailAndPassword(auth, email, password);
                    setAnnouncement('Account created successfully. Redirecting to profile.');
                }
                navigate('/profile');
            } else {
                // Demo mode without Firebase
                console.log('Demo mode: Authentication simulated');
                setAnnouncement(`${isLogin ? 'Login' : 'Registration'} simulated. Redirecting to profile.`);
                setTimeout(() => navigate('/profile'), 1000);
            }
        } catch (err) {
            console.error('Auth error:', err);
            let message = 'An error occurred. Please try again.';

            // Firebase error codes
            if (err.code === 'auth/user-not-found') {
                message = 'No account found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                message = 'Incorrect password.';
            } else if (err.code === 'auth/email-already-in-use') {
                message = 'An account already exists with this email.';
            } else if (err.code === 'auth/invalid-email') {
                message = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password is too weak. Use at least 6 characters.';
            }

            setError(message);
            setAnnouncement(`Error: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '480px' }}>
                <div className="card" style={{ marginTop: '2rem' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {isLogin
                                ? 'Sign in to access your accessible travel plans'
                                : 'Join Knight Guide for accessible travel planning'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Email field */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label htmlFor="email">
                                Email Address
                                <span style={{ color: 'var(--color-danger)' }} aria-hidden="true"> *</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                aria-required="true"
                                aria-invalid={error && !email ? 'true' : 'false'}
                                aria-describedby={error && !email ? 'email-error' : undefined}
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password field */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label htmlFor="password">
                                Password
                                <span style={{ color: 'var(--color-danger)' }} aria-hidden="true"> *</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                aria-required="true"
                                aria-invalid={error && !password ? 'true' : 'false'}
                                minLength={6}
                                placeholder="At least 6 characters"
                            />
                        </div>

                        {/* Confirm password (register only) */}
                        {!isLogin && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                    <span style={{ color: 'var(--color-danger)' }} aria-hidden="true"> *</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    aria-required="true"
                                    aria-invalid={error && password !== confirmPassword ? 'true' : 'false'}
                                    placeholder="Confirm your password"
                                />
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div
                                className="error-message"
                                role="alert"
                                style={{
                                    marginBottom: '1.25rem',
                                    padding: '0.75rem',
                                    background: '#fee2e2',
                                    borderRadius: '8px'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <AccessibleButton
                            type="submit"
                            variant="primary"
                            loading={loading}
                            ariaLabel={isLogin ? 'Sign in to your account' : 'Create your account'}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </AccessibleButton>
                    </form>

                    {/* Toggle login/register */}
                    <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <AccessibleButton
                            variant="secondary"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setAnnouncement(`Switched to ${!isLogin ? 'login' : 'registration'} form.`);
                            }}
                            ariaLabel={isLogin ? 'Switch to create account form' : 'Switch to sign in form'}
                        >
                            {isLogin ? 'Create Account' : 'Sign In'}
                        </AccessibleButton>
                    </div>

                    {/* Demo mode notice */}
                    {!auth && (
                        <div
                            style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: '#fef3c7',
                                borderRadius: '8px',
                                fontSize: '0.875rem'
                            }}
                            role="note"
                        >
                            <strong>Demo Mode:</strong> Firebase is not configured.
                            Authentication is simulated for demonstration purposes.
                        </div>
                    )}
                </div>

                {/* Live region for announcements */}
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

export default Login;
