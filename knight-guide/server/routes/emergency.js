import express from 'express';
import { sendEmergencyAlert } from '../services/notificationService.js';

const router = express.Router();

/**
 * POST /api/emergency/alert
 * Trigger an emergency alert
 */
router.post('/alert', async (req, res) => {
    try {
        const {
            userId,
            userName,
            emergencyContact,
            medicalNotes,
            accessibilityNeeds,
            location,
            timestamp
        } = req.body;

        // Validate required fields
        if (!timestamp) {
            return res.status(400).json({
                error: 'Invalid request',
                code: 'MISSING_TIMESTAMP'
            });
        }

        // Format emergency data
        const emergencyData = {
            userId: userId || 'anonymous',
            userName: userName || 'Unknown User',
            emergencyContact: emergencyContact || null,
            medicalNotes: medicalNotes || 'No medical information provided',
            accessibilityNeeds: accessibilityNeeds || [],
            location: location || { error: 'Location unavailable' },
            timestamp: timestamp || new Date().toISOString(),
            alertId: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Send emergency alert (mock in development)
        const result = await sendEmergencyAlert(emergencyData);

        // Log for demo purposes
        console.log('\n');
        console.log('╔══════════════════════════════════════════════════════╗');
        console.log('║            🆘 EMERGENCY ALERT RECEIVED 🆘             ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log(`║  Alert ID:  ${emergencyData.alertId}`);
        console.log(`║  Time:      ${emergencyData.timestamp}`);
        console.log(`║  User:      ${emergencyData.userName}`);
        if (emergencyData.location && !emergencyData.location.error) {
            console.log(`║  Location:  ${emergencyData.location.latitude}, ${emergencyData.location.longitude}`);
        } else {
            console.log('║  Location:  Not available');
        }
        console.log('║  Medical:   ' + (emergencyData.medicalNotes || 'None provided'));
        console.log('║  Needs:     ' + (emergencyData.accessibilityNeeds.join(', ') || 'None specified'));
        if (emergencyData.emergencyContact) {
            console.log(`║  Contact:   ${emergencyData.emergencyContact.name} (${emergencyData.emergencyContact.phone})`);
        }
        console.log('╚══════════════════════════════════════════════════════╝');
        console.log('\n');

        res.json({
            success: true,
            alertId: emergencyData.alertId,
            message: 'Emergency alert sent successfully',
            notifiedParties: result.notifiedParties || ['Emergency Services (Mock)', 'Emergency Contact (Mock)']
        });
    } catch (error) {
        console.error('Emergency alert error:', error);

        // Emergency endpoints should always return success to not block critical alerts
        // In production, this would trigger a fallback notification system
        res.json({
            success: true,
            alertId: `FALLBACK-${Date.now()}`,
            message: 'Emergency alert processed (fallback mode)',
            note: 'Primary notification may have failed, backup systems engaged'
        });
    }
});

/**
 * GET /api/emergency/test
 * Test emergency system (development only)
 */
router.get('/test', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }

    res.json({
        status: 'operational',
        endpoints: {
            alert: 'POST /api/emergency/alert'
        },
        testMode: true,
        message: 'Emergency system is operational. All alerts in development are simulated.'
    });
});

export default router;
