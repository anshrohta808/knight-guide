import express from 'express';
import { generateSignExplanation } from '../services/aiService.js';

const router = express.Router();

const CENTERS = [
    { id: 1, name: 'Deaf Community Services', address: '123 Main St, Central City', phone: '(555) 123-4567', status: 'Open' },
    { id: 2, name: 'Access Interpreting', address: '456 Oak Ave, Westside', phone: '(555) 987-6543', status: 'Available 24/7' },
];

router.get('/centers', (req, res) => {
    res.json(CENTERS);
});

router.post('/translate', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // Use AI service to generate a description of the signs
        const explanation = await generateSignExplanation(text);

        res.json({
            original: text,
            explanation: explanation, // New field for the text description
            message: 'Translation processed successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Translation failed' });
    }
});

export default router;
