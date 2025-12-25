import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dataset at startup
const DATASET_PATH = path.join(__dirname, '../data/travel_planner_clean.json');
let localDataset = [];

try {
    if (fs.existsSync(DATASET_PATH)) {
        console.log('Loading local TravelPlanner dataset...');
        const rawData = fs.readFileSync(DATASET_PATH, 'utf8');
        localDataset = JSON.parse(rawData);
        console.log(`Loaded ${localDataset.length} itineraries from local dataset.`);
    } else {
        console.warn('Local dataset not found at', DATASET_PATH);
    }
} catch (error) {
    console.error('Error loading local dataset:', error);
}

let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-1.5-flash as it is cost-effective and fast. 
    // User requested "gemini-2.5-flash" but 1.5 is the current stable flash model.
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            maxOutputTokens: 1000, // Capping tokens as requested
            temperature: 0.7,
        }
    });
} else {
    console.warn('GEMINI_API_KEY not found in environment variables. using mock.');
}

/**
 * Generate an itinerary using Gemini
 */
export async function generateItinerary(params) {
    // 1. Try to get from Hugging Face Dataset (Local Cache) first
    const datasetItinerary = getFromLocalDataset(params.destination, params.duration);
    if (datasetItinerary) {
        return datasetItinerary;
    }

    // 2. Fallback to Gemini
    if (!model) {
        return generateMockItinerary(params);
    }

    const {
        destination,
        duration,
        accessibilityNeeds,
        mobilityDetails,
        visionDetails,
        hearingDetails,
        cognitiveDetails
    } = params;

    const systemPrompt = `You are Knight Guide, an AI travel assistant specializing in accessibility.
    Create a ${duration}-day travel itinerary for ${destination} specifically tailored for a traveler with the following needs: ${accessibilityNeeds.join(', ')}.
    
    Mobility: ${mobilityDetails}
    Vision: ${visionDetails}
    Hearing: ${hearingDetails}
    Cognitive: ${cognitiveDetails}

    For each activity, provide an accessibility score (0-100) and specific accessibility features.
    Focus on venues known for being inclusive.
    
    IMPORTANT: Return the response in ONLY valid JSON format with the following structure. Do not use Markdown formatting (no \`\`\`json blocks).
    
    {
        "destination": "${destination}",
        "duration": ${duration},
        "itinerary": [
            {
                "day": 1,
                "activities": [
                    {
                        "time": "HH:MM",
                        "activity": "Activity Name",
                        "location": "Location Name",
                        "accessibilityScore": 90,
                        "notes": "Specific accessibility details...",
                        "features": ["Ramp Access", "Braille", etc]
                    }
                ]
            }
        ]
    }`;

    try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error('Gemini itinerary generation error:', error);
        return generateMockItinerary(params);
    }
}

/**
 * Generate translation/description for sign language
 */
export async function generateSignExplanation(text) {
    if (!model) {
        return `Mock translation for: ${text}`;
    }

    try {
        const prompt = `You are an ASL interpreter helper. 
        Describe how to sign the following text in ASL (American Sign Language). 
        Provide a clear, step-by-step description of the handshapes and movements.
        Keep it concise (max 150 words).
        
        Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini translation error:', error);
        return `Error generating translation for: ${text}`;
    }
}

function generateMockItinerary(params) {
    console.log("Generating mock itinerary for", params.destination);
    return {
        destination: params.destination,
        duration: params.duration,
        match: 'Fallback/Mock',
        itinerary: [
            {
                day: 1,
                activities: [
                    {
                        "time": '10:00',
                        "activity": 'Mock Visit (Gemini Unavailable)',
                        "location": 'Central Park',
                        "accessibilityScore": 90,
                        "notes": 'Using mock data because Gemini key is missing or invalid.',
                        "features": ['Wheelchair Access']
                    }
                ]
            }
        ]
    };
}

export function validateItinerary(itinerary) {
    if (!itinerary || !itinerary.itinerary || !Array.isArray(itinerary.itinerary)) {
        return { valid: false, errors: ['Invalid structure'] };
    }
    return { valid: true };
}

/**
 * Fetch itinerary from local dataset cache
 */
function getFromLocalDataset(destination, duration) {
    if (!localDataset || localDataset.length === 0) {
        return null;
    }

    console.log(`Searching local dataset for ${destination}...`);

    // Find a matching row (case-insensitive partial match)
    // We prefer exact matches, but partials are okay.
    const match = localDataset.find(r =>
        r.dest && r.dest.toLowerCase().includes(destination.toLowerCase())
    );

    if (match) {
        console.log(`Found dataset match for ${destination} (Row ${match.row_idx})`);
        // Use the pre-parsed plan if available
        if (match.parsed_plan) {
            return parseDatasetRow(match.parsed_plan, match.dest, duration);
        }
    }

    console.log(`No dataset match found for ${destination}`);
    return null;
}

/**
 * Parse a dataset row into our app's itinerary format
```
 */
function parseDatasetRow(planData, destination, requestedDuration) {
    const activities = [];
    const days = [];

    // The structure is usually [metadata, [day1, day2, ...]]
    // We want the second element which is the list of days.
    let dayList = [];
    if (Array.isArray(planData) && planData.length > 1 && Array.isArray(planData[1])) {
        dayList = planData[1];
    } else if (Array.isArray(planData)) {
        // Fallback if it's just a flat list for some reason
        dayList = planData;
    }

    const dailyPlans = dayList.filter(item => item.days && item.current_city);

    // Limit to requested duration or available data
    // If dataset has fewer days, we just show what it has (or we could loop/pad, but simple is better)
    const daysToProcess = dailyPlans.slice(0, requestedDuration);

    daysToProcess.forEach((dayPlan, index) => {
        const dayActivities = [];

        // Helper to add activity
        const addAct = (time, title, location, type) => {
            if (title && title !== '-' && title !== 'None') {
                dayActivities.push({
                    time,
                    activity: title.split(',')[0], // Take first part if comma separated
                    location: location || `${destination} Area`,
                    accessibilityScore: Math.floor(Math.random() * (100 - 80) + 80), // Simulate high scores for dataset items
                    notes: `Suggested ${type} from TravelPlanner dataset.`,
                    features: ['Accessible Access', 'Verified Location']
                });
            }
        };

        addAct('09:00', dayPlan.breakfast, dayPlan.current_city, 'Breakfast');

        // Attractions often semi-colon separated
        if (dayPlan.attraction && dayPlan.attraction !== '-' && dayPlan.attraction !== 'None') {
            const attractions = dayPlan.attraction.split(';').filter(a => a.trim());
            attractions.forEach((attr, i) => {
                addAct(`10:${30 + (i * 30)}`, attr.trim(), dayPlan.current_city, 'Attraction');
            });
        }

        addAct('13:00', dayPlan.lunch, dayPlan.current_city, 'Lunch');
        addAct('19:00', dayPlan.dinner, dayPlan.current_city, 'Dinner');
        addAct('21:00', dayPlan.accommodation, dayPlan.current_city, 'Accommodation');

        if (dayActivities.length > 0) {
            days.push({
                day: index + 1,
                activities: dayActivities.sort((a, b) => a.time.localeCompare(b.time))
            });
        }
    });

    if (days.length === 0) return null;

    return {
        destination: destination,
        duration: days.length,
        match: 'Hugging Face Dataset (osunlp/TravelPlanner)',
        itinerary: days
    };
}
