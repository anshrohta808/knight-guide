/**
 * Notification Service for Emergency Alerts
 * 
 * In production, this would integrate with:
 * - Twilio for SMS
 * - SendGrid for email
 * - Push notification services
 * 
 * For MVP, we use console logging (mock)
 */

/**
 * Send emergency alert
 * @param {Object} data - Emergency data
 * @returns {Object} - Result with notified parties
 */
export async function sendEmergencyAlert(data) {
    const {
        alertId,
        userId,
        userName,
        emergencyContact,
        medicalNotes,
        accessibilityNeeds,
        location,
        timestamp
    } = data;

    const notifiedParties = [];

    // 1. Notify emergency services (mock)
    await mockNotifyEmergencyServices(data);
    notifiedParties.push('Emergency Services (Mock)');

    // 2. Notify emergency contact if available
    if (emergencyContact?.phone) {
        await mockSendSMS(emergencyContact.phone, formatEmergencyMessage(data));
        notifiedParties.push(`${emergencyContact.name} (${emergencyContact.phone})`);
    }

    // 3. Log to system for tracking
    logEmergencyToSystem(data);
    notifiedParties.push('System Log');

    return {
        success: true,
        alertId,
        notifiedParties,
        timestamp: new Date().toISOString()
    };
}

/**
 * Mock emergency services notification
 */
async function mockNotifyEmergencyServices(data) {
    // In production: Integrate with local emergency APIs or services
    console.log('[MOCK] Emergency services notified');
    console.log('[MOCK] Location:', data.location);
    return { success: true };
}

/**
 * Mock SMS sending
 */
async function mockSendSMS(phone, message) {
    // In production: Use Twilio or similar
    console.log(`[MOCK SMS] To: ${phone}`);
    console.log(`[MOCK SMS] Message: ${message.substring(0, 100)}...`);
    return { success: true, messageId: `mock-${Date.now()}` };
}

/**
 * Format emergency message for SMS
 */
function formatEmergencyMessage(data) {
    const lines = [
        '🆘 KNIGHT GUIDE EMERGENCY ALERT',
        '',
        `User: ${data.userName}`,
        `Time: ${new Date(data.timestamp).toLocaleString()}`,
    ];

    if (data.location && !data.location.error) {
        lines.push(`Location: ${data.location.latitude}, ${data.location.longitude}`);
        lines.push(`Maps: https://maps.google.com/?q=${data.location.latitude},${data.location.longitude}`);
    } else {
        lines.push('Location: Unable to determine');
    }

    lines.push('');
    lines.push('Medical Notes:');
    lines.push(data.medicalNotes || 'None provided');

    if (data.accessibilityNeeds?.length > 0) {
        lines.push('');
        lines.push('Accessibility Needs:');
        lines.push(data.accessibilityNeeds.join(', '));
    }

    return lines.join('\n');
}

/**
 * Log emergency to system for audit trail
 */
function logEmergencyToSystem(data) {
    const logEntry = {
        type: 'EMERGENCY_ALERT',
        alertId: data.alertId,
        timestamp: data.timestamp,
        userId: data.userId,
        hasLocation: !!(data.location && !data.location.error),
        hasMedicalNotes: !!data.medicalNotes,
        hasEmergencyContact: !!(data.emergencyContact?.phone)
    };

    // In production: Write to database, monitoring system, etc.
    console.log('[SYSTEM LOG]', JSON.stringify(logEntry));
}

/**
 * Send non-emergency notification
 */
export async function sendNotification(userId, message, type = 'info') {
    console.log(`[NOTIFICATION] ${type.toUpperCase()} to ${userId}: ${message}`);
    return { success: true };
}

/**
 * Test notification system
 */
export async function testNotificationSystem() {
    console.log('Testing notification system...');

    const testData = {
        alertId: 'TEST-123',
        userId: 'test-user',
        userName: 'Test User',
        emergencyContact: { name: 'Test Contact', phone: '+1-555-0000' },
        medicalNotes: 'Test medical notes',
        accessibilityNeeds: ['wheelchair'],
        location: { latitude: 40.7128, longitude: -74.0060 },
        timestamp: new Date().toISOString()
    };

    const result = await sendEmergencyAlert(testData);
    console.log('Test result:', result);

    return result;
}
