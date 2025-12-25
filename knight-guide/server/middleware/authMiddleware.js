import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Initialize Firebase Admin (if service account available)
let firebaseAdmin = null;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

if (existsSync(serviceAccountPath)) {
    try {
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        firebaseAdmin = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.warn('Firebase Admin initialization failed:', error.message);
    }
} else {
    console.warn('Firebase service account not found. Auth middleware will use demo mode.');
}

/**
 * Authentication middleware
 * Verifies Firebase ID tokens for protected routes
 */
export async function authMiddleware(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Demo mode: allow requests without auth in development
            if (process.env.NODE_ENV !== 'production') {
                req.user = {
                    uid: 'demo-user',
                    email: 'demo@knight-guide.app',
                    demoMode: true
                };
                return next();
            }

            return res.status(401).json({
                error: 'No authorization token provided',
                code: 'MISSING_TOKEN'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify token with Firebase Admin
        if (firebaseAdmin) {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                emailVerified: decodedToken.email_verified,
                demoMode: false
            };
        } else {
            // Demo mode fallback
            if (process.env.NODE_ENV !== 'production') {
                req.user = {
                    uid: 'demo-user',
                    email: 'demo@knight-guide.app',
                    demoMode: true
                };
            } else {
                return res.status(503).json({
                    error: 'Authentication service unavailable',
                    code: 'AUTH_SERVICE_UNAVAILABLE'
                });
            }
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({
                error: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }

        // Demo mode in development
        if (process.env.NODE_ENV !== 'production') {
            req.user = {
                uid: 'demo-user',
                email: 'demo@knight-guide.app',
                demoMode: true
            };
            return next();
        }

        res.status(500).json({
            error: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
}

/**
 * Optional auth middleware - doesn't require auth but adds user if available
 */
export async function optionalAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ') && firebaseAdmin) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                demoMode: false
            };
        }
    } catch (error) {
        // Ignore auth errors for optional auth
        console.log('Optional auth skipped:', error.message);
    }

    next();
}

export default authMiddleware;
