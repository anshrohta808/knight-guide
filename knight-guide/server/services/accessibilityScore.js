/**
 * Calculate accessibility score for a location
 * 
 * Scoring criteria (each worth up to 10 points):
 * - Wheelchair/mobility access
 * - Vision accommodations
 * - Hearing accommodations
 * - Cognitive accommodations
 * - Staff training
 * - Accessible restrooms
 * - Parking/transportation
 * - Signage clarity
 * - Online accessibility info
 * - User reviews
 */

export function calculateAccessibilityScore(location) {
    let score = 50; // Base score
    const features = location.accessibilityFeatures || [];
    const category = location.category || '';

    // Wheelchair/Mobility access (up to 15 points)
    if (features.includes('wheelchair')) score += 15;
    else if (features.includes('accessible-paths')) score += 8;

    // Vision accommodations (up to 12 points)
    if (features.includes('vision')) score += 10;
    if (features.includes('audio-guide')) score += 5;
    if (features.includes('braille-menu') || features.includes('braille')) score += 5;

    // Hearing accommodations (up to 10 points)
    if (features.includes('hearing')) score += 10;
    if (features.includes('hearing-loop')) score += 5;

    // Cognitive accommodations (up to 8 points)
    if (features.includes('cognitive')) score += 8;

    // Elevators (5 points)
    if (features.includes('elevators')) score += 5;

    // Category bonuses
    if (category === 'Museum') score += 5; // Museums typically have good accessibility
    if (category === 'Park' && features.includes('accessible-paths')) score += 3;

    // Cap at 100
    return Math.min(Math.max(score, 0), 100);
}

/**
 * Get detailed accessibility breakdown
 */
export function getAccessibilityBreakdown(location) {
    const features = location.accessibilityFeatures || [];

    return {
        mobility: {
            score: features.includes('wheelchair') ? 100 : features.includes('accessible-paths') ? 60 : 20,
            details: features.includes('wheelchair')
                ? 'Full wheelchair accessibility'
                : features.includes('accessible-paths')
                    ? 'Partially accessible paths'
                    : 'Limited mobility access'
        },
        vision: {
            score: features.includes('vision') ? 100 : features.includes('audio-guide') ? 70 : 30,
            details: features.includes('vision')
                ? 'Vision accommodations available'
                : features.includes('audio-guide')
                    ? 'Audio guides available'
                    : 'Limited vision accommodations'
        },
        hearing: {
            score: features.includes('hearing') ? 100 : 40,
            details: features.includes('hearing')
                ? 'Hearing accommodations available'
                : 'Limited hearing accommodations'
        },
        cognitive: {
            score: features.includes('cognitive') ? 100 : 50,
            details: features.includes('cognitive')
                ? 'Cognitive accommodations available'
                : 'Standard environment'
        }
    };
}

/**
 * Filter locations by accessibility requirements
 */
export function filterLocationsByNeeds(locations, needs = []) {
    if (needs.length === 0) return locations;

    return locations.filter(location => {
        const features = location.accessibilityFeatures || [];

        // Check if location meets at least one of the required needs
        return needs.some(need => {
            if (need === 'wheelchair' || need === 'walker' || need === 'limited-walking') {
                return features.includes('wheelchair') || features.includes('accessible-paths');
            }
            if (need === 'blind' || need === 'color-blind') {
                return features.includes('vision') || features.includes('audio-guide');
            }
            if (need === 'deaf' || need === 'hearing-aid') {
                return features.includes('hearing');
            }
            if (need === 'cognitive' || need === 'anxiety') {
                return features.includes('cognitive');
            }
            return false;
        });
    });
}

/**
 * Rank locations by accessibility score
 */
export function rankLocationsByAccessibility(locations, needs = []) {
    return [...locations]
        .map(loc => ({
            ...loc,
            accessibilityScore: calculateAccessibilityScore(loc),
            matchesNeeds: needs.length === 0 ||
                needs.every(need => (loc.accessibilityFeatures || []).includes(need))
        }))
        .sort((a, b) => {
            // Prioritize locations that match user needs
            if (a.matchesNeeds && !b.matchesNeeds) return -1;
            if (!a.matchesNeeds && b.matchesNeeds) return 1;
            // Then sort by score
            return b.accessibilityScore - a.accessibilityScore;
        });
}
