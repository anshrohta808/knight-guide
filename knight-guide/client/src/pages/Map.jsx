import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import AccessibleButton from '../components/AccessibleButton';

/**
 * Map Page - Accessibility map with location filtering
 * 
 * Features:
 * - Color-coded accessibility markers
 * - Filter by disability type
 * - Location details panel
 */
const Map = ({ user, db }) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [filters, setFilters] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState([40.7829, -73.9654]); // Default NYC

    // Filter options
    const filterOptions = [
        { id: 'wheelchair', label: 'Wheelchair', icon: '♿' },
        { id: 'hearing', label: 'Hearing', icon: '👂' },
        { id: 'vision', label: 'Vision', icon: '👁️' },
        { id: 'cognitive', label: 'Cognitive', icon: '🧠' },
    ];

    // Load locations
    useEffect(() => {
        const loadLocations = async (lat, lng) => {
            try {
                // Use user location if available, otherwise default
                const queryLat = lat || userLocation[0];
                const queryLng = lng || userLocation[1];

                const response = await fetch(`/api/map/locations?lat=${queryLat}&lng=${queryLng}`);
                if (response.ok) {
                    const data = await response.json();
                    setLocations(data.locations || []);
                } else {
                    throw new Error('Failed to load locations');
                }
            } catch (err) {
                console.error('Error loading locations:', err);
                // Use demo data
                setLocations(getDemoLocations());
            } finally {
                setLoading(false);
            }
        };

        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newLoc = [latitude, longitude];
                    setUserLocation(newLoc);
                    loadLocations(latitude, longitude);
                },
                (err) => {
                    console.warn("Geolocation access denied or failed", err);
                    loadLocations(); // Loads with default
                }
            );
        } else {
            loadLocations();
        }
    }, []);

    // Demo locations
    const getDemoLocations = () => [
        {
            id: '1',
            name: 'Central Park',
            latitude: 40.7829,
            longitude: -73.9654,
            accessibilityScore: 85,
            accessibilityFeatures: ['wheelchair', 'vision'],
            notes: 'Paved paths, accessible restrooms, tactile guides at visitor center.',
            category: 'Park'
        },
        {
            id: '2',
            name: 'Metropolitan Museum of Art',
            latitude: 40.7794,
            longitude: -73.9632,
            accessibilityScore: 95,
            accessibilityFeatures: ['wheelchair', 'hearing', 'vision', 'cognitive'],
            notes: 'Wheelchair rentals, audio guides, sign language tours, sensory-friendly hours.',
            category: 'Museum'
        },
        {
            id: '3',
            name: 'Times Square',
            latitude: 40.7580,
            longitude: -73.9855,
            accessibilityScore: 78,
            accessibilityFeatures: ['wheelchair', 'hearing'],
            notes: 'Curb cuts throughout, some venues have hearing loops.',
            category: 'Landmark'
        },
        {
            id: '4',
            name: 'Accessible Restaurant Row',
            latitude: 40.7590,
            longitude: -73.9872,
            accessibilityScore: 92,
            accessibilityFeatures: ['wheelchair', 'vision'],
            notes: 'Multiple restaurants with ramp access and braille menus.',
            category: 'Dining'
        },
        {
            id: '5',
            name: 'Brooklyn Bridge Park',
            latitude: 40.7024,
            longitude: -73.9970,
            accessibilityScore: 65,
            accessibilityFeatures: ['wheelchair'],
            notes: 'Mostly accessible paths, some uneven surfaces near water.',
            category: 'Park'
        }
    ];

    // Toggle filter
    const toggleFilter = (filterId) => {
        setFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    // Get filtered locations
    const filteredLocations = filters.length > 0
        ? locations.filter(loc =>
            filters.some(f => loc.accessibilityFeatures?.includes(f))
        )
        : locations;

    return (
        <div className="page">
            <div className="container">
                <h1 style={{ marginBottom: '0.5rem' }}>Accessibility Map</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                    Explore accessible locations near you. Filter by your accessibility needs.
                </p>

                {/* Filters */}
                <section
                    className="card"
                    style={{ marginBottom: '1.5rem' }}
                    aria-label="Accessibility filters"
                >
                    <h2 className="card-header" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                        Filter by Accessibility
                    </h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {filterOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => toggleFilter(option.id)}
                                aria-pressed={filters.includes(option.id)}
                                className={`btn ${filters.includes(option.id) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{
                                    minHeight: '40px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <span aria-hidden="true">{option.icon}</span> {option.label}
                            </button>
                        ))}

                        {filters.length > 0 && (
                            <AccessibleButton
                                variant="secondary"
                                onClick={() => setFilters([])}
                                ariaLabel="Clear all filters"
                                style={{ minHeight: '40px', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                            >
                                Clear All
                            </AccessibleButton>
                        )}
                    </div>

                    <p
                        style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}
                        role="status"
                        aria-live="polite"
                    >
                        Showing {filteredLocations.length} of {locations.length} locations
                    </p>
                </section>

                {/* Map */}
                {loading ? (
                    <div
                        className="card"
                        style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        role="status"
                    >
                        <div style={{ textAlign: 'center' }}>
                            <span className="loading-spinner" style={{ display: 'block', margin: '0 auto 1rem' }} />
                            <p>Loading map...</p>
                        </div>
                    </div>
                ) : (
                    <MapView
                        locations={filteredLocations}
                        center={userLocation}
                        zoom={13}
                        onLocationSelect={setSelectedLocation}
                        filters={filters}
                    />
                )}

                {/* Legend */}
                <section
                    className="card"
                    style={{ marginTop: '1.5rem' }}
                    aria-label="Map legend"
                >
                    <h2 className="card-header" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                        Accessibility Score Legend
                    </h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="score-badge score-high" style={{ minWidth: 'auto' }}>80-100</span>
                            <span>High Accessibility</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="score-badge score-medium" style={{ minWidth: 'auto' }}>50-79</span>
                            <span>Moderate Accessibility</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="score-badge score-low" style={{ minWidth: 'auto' }}>0-49</span>
                            <span>Limited Accessibility</span>
                        </div>
                    </div>

                    <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        Scores are based on: wheelchair access, ramps, elevators, braille signage, audio guides,
                        staff training, and user reviews.
                    </p>
                </section>

                {error && (
                    <div
                        className="error-message"
                        role="alert"
                        style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}
                    >
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Map;
