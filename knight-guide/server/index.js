import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itinerary.js';
import mapRoutes from './routes/map.js';
import emergencyRoutes from './routes/emergency.js';
import volunteerRoutes from './routes/volunteer.js';
import signLanguageRoutes from './routes/signLanguage.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/sign-language', signLanguageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║         Knight Guide API Server                ║
║        Accessibility-First Travel              ║
╠════════════════════════════════════════════════╣
║  Status:  ✓ Running                            ║
║  Port:    ${PORT}                                 ║
║  Mode:    ${process.env.NODE_ENV || 'development'}                        ║
╚════════════════════════════════════════════════╝
  `);
});
