import express from 'express';
import { generateItinerary, validateItinerary } from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/itinerary/generate
 * Generate an AI-powered accessible travel itinerary
 */
router.post('/generate', async (req, res) => {
    try {
        const {
            destination,
            duration = 1,
            accessibilityNeeds = [],
            mobilityDetails = '',
            visionDetails = '',
            hearingDetails = '',
            cognitiveDetails = ''
        } = req.body;

        // Validation
        if (!destination || typeof destination !== 'string') {
            return res.status(400).json({
                error: 'Destination is required',
                code: 'MISSING_DESTINATION'
            });
        }

        if (duration < 1 || duration > 14) {
            return res.status(400).json({
                error: 'Duration must be between 1 and 14 days',
                code: 'INVALID_DURATION'
            });
        }

        console.log(`Generating itinerary for ${destination}, ${duration} day(s)`);
        console.log('Accessibility needs:', accessibilityNeeds);

        // Generate itinerary using AI service
        const itinerary = await generateItinerary({
            destination: destination.trim(),
            duration: Math.min(Math.max(1, duration), 14),
            accessibilityNeeds,
            mobilityDetails,
            visionDetails,
            hearingDetails,
            cognitiveDetails
        });

        // Validate the itinerary structure
        const validation = validateItinerary(itinerary);
        if (!validation.valid) {
            console.error('Itinerary validation failed:', validation.errors);
            return res.status(500).json({
                error: 'Generated itinerary failed validation',
                code: 'VALIDATION_FAILED'
            });
        }

        res.json(itinerary);
    } catch (error) {
        console.error('Itinerary generation error:', error);

        // Return fallback itinerary on error
        const fallback = getFallbackItinerary(req.body.destination, req.body.duration);
        res.json(fallback);
    }
});

/**
 * Fallback itinerary when AI fails
 */
function getFallbackItinerary(destination = 'Your Destination', duration = 1) {
    const days = [];

    for (let d = 1; d <= Math.min(duration, 7); d++) {
        days.push({
            day: d,
            activities: [
                {
                    time: '09:00',
                    activity: 'Morning Accessible Walking Tour',
                    location: `${destination} City Center`,
                    accessibilityScore: 90,
                    notes: 'Wheelchair accessible with paved pathways. Rest areas available every 200 meters.',
                    features: ['Wheelchair Ramps', 'Rest Areas', 'Accessible Restrooms']
                },
                {
                    time: '12:00',
                    activity: 'Lunch at Accessibility-Certified Restaurant',
                    location: `${destination} Dining District`,
                    accessibilityScore: 95,
                    notes: 'Full wheelchair access, braille menus, staff trained in accessibility assistance.',
                    features: ['Wheelchair Access', 'Braille Menu', 'Trained Staff']
                },
                {
                    time: '14:00',
                    activity: 'Visit Accessible Museum',
                    location: `${destination} Cultural District`,
                    accessibilityScore: 92,
                    notes: 'Free wheelchair loans, audio guides, tactile exhibits, elevator access to all floors.',
                    features: ['Wheelchair Loan', 'Audio Guide', 'Elevators', 'Tactile Exhibits']
                },
                {
                    time: '17:00',
                    activity: 'Accessible Park Visit',
                    location: `${destination} Central Park`,
                    accessibilityScore: 85,
                    notes: 'Paved accessible pathways throughout. Accessible playground and rest facilities.',
                    features: ['Paved Paths', 'Accessible Playground', 'Restrooms']
                }
            ]
        });
    }

    return {
        destination,
        duration,
        generatedAt: new Date().toISOString(),
        isFallback: true,
        itinerary: days
    };
}

export default router;
