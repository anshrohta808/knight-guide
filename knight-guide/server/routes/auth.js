import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/verify
 * Verify Firebase ID token
 */
router.post('/verify', authMiddleware, (req, res) => {
    // If middleware passes, user is authenticated
    res.json({
        success: true,
        user: {
            uid: req.user.uid,
            email: req.user.email,
        }
    });
});

/**
 * GET /api/auth/profile/:uid
 * Get user profile (demo endpoint)
 */
router.get('/profile/:uid', authMiddleware, async (req, res) => {
    try {
        const { uid } = req.params;

        // Verify user is requesting their own profile
        if (req.user.uid !== uid) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        // In production, this would fetch from Firestore
        // For demo, return mock data
        res.json({
            uid,
            email: req.user.email,
            profile: {
                name: 'Demo User',
                accessibilityNeeds: ['wheelchair', 'vision'],
                emergencyContact: {
                    name: 'Emergency Contact',
                    phone: '+1-555-0123'
                }
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

/**
 * POST /api/auth/profile
 * Update user profile
 */
router.post('/profile', authMiddleware, async (req, res) => {
    try {
        const { profile } = req.body;

        if (!profile) {
            return res.status(400).json({ error: 'Profile data required' });
        }

        // In production, this would save to Firestore
        // For demo, just acknowledge
        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                ...profile,
                updatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
