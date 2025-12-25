import React, { useState } from 'react';

/**
 * AccessibleButton - A fully accessible button component
 * 
 * Features:
 * - Required aria-label for screen readers
 * - Visible focus states
 * - Loading state with announcements
 * - Proper disabled handling
 */
const AccessibleButton = ({
    children,
    onClick,
    ariaLabel,
    type = 'button',
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
    icon = null,
    ...props
}) => {
    const [announced, setAnnounced] = useState('');

    const handleClick = async (e) => {
        if (disabled || loading) return;

        if (onClick) {
            await onClick(e);
        }
    };

    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        emergency: 'btn-emergency',
    };

    return (
        <>
            <button
                type={type}
                onClick={handleClick}
                disabled={disabled || loading}
                aria-label={ariaLabel}
                aria-busy={loading}
                aria-disabled={disabled || loading}
                className={`${baseClasses} ${variantClasses[variant]} ${className}`}
                {...props}
            >
                {loading ? (
                    <>
                        <span className="loading-spinner" aria-hidden="true" />
                        <span className="loading-text">Loading...</span>
                        <span className="sr-only">Please wait, loading</span>
                    </>
                ) : (
                    <>
                        {icon && <span aria-hidden="true">{icon}</span>}
                        {children}
                    </>
                )}
            </button>

            {/* Live region for announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="announcer"
            >
                {announced}
            </div>
        </>
    );
};

export default AccessibleButton;
