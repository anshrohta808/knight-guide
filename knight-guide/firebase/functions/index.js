const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function: Process Emergency Alert
 * Triggered when an emergency alert is created
 */
exports.processEmergencyAlert = functions.firestore
    .document('emergencyAlerts/{alertId}')
    .onCreate(async (snap, context) => {
        const alertData = snap.data();
        const alertId = context.params.alertId;

        console.log(`Processing emergency alert: ${alertId}`);

        try {
            // 1. Get user profile for additional context
            let userProfile = null;
            if (alertData.userId && alertData.userId !== 'anonymous') {
                const userDoc = await db.collection('users').doc(alertData.userId).get();
                if (userDoc.exists) {
                    userProfile = userDoc.data();
                }
            }

            // 2. Log processing
            console.log('Alert details:', {
                alertId,
                userId: alertData.userId,
                location: alertData.location,
                timestamp: alertData.timestamp
            });

            // 3. Update alert status
            await snap.ref.update({
                status: 'processed',
                processedAt: admin.firestore.FieldValue.serverTimestamp(),
                userProfileFound: !!userProfile
            });

            // 4. In production: Trigger actual notifications
            // - Send SMS via Twilio
            // - Send push notifications
            // - Notify monitoring dashboard

            return { success: true, alertId };
        } catch (error) {
            console.error('Error processing emergency alert:', error);

            await snap.ref.update({
                status: 'error',
                errorMessage: error.message
            });

            throw error;
        }
    });

/**
 * Cloud Function: Cleanup Old Data
 * Scheduled function to clean up old emergency alerts (GDPR compliance)
 */
exports.cleanupOldAlerts = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 90); // 90 days retention

        const oldAlerts = await db.collection('emergencyAlerts')
            .where('timestamp', '<', cutoffDate.toISOString())
            .get();

        const batch = db.batch();
        oldAlerts.forEach(doc => {
            batch.delete(doc.ref);
        });

        if (!oldAlerts.empty) {
            await batch.commit();
            console.log(`Deleted ${oldAlerts.size} old emergency alerts`);
        }

        return null;
    });

/**
 * Cloud Function: User Profile Update
 * Triggered when a user profile is updated
 */
exports.onUserProfileUpdate = functions.firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const userId = context.params.userId;

        // Check if emergency contact was updated
        if (JSON.stringify(before.emergencyContact) !== JSON.stringify(after.emergencyContact)) {
            console.log(`Emergency contact updated for user ${userId}`);
            // In production: Verify new emergency contact
        }

        return null;
    });

/**
 * HTTP Function: Health check for monitoring
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: 'healthy',
        service: 'knight-guide-functions',
        timestamp: new Date().toISOString()
    });
});
