import { generateItinerary } from '../services/aiService.js';

async function test() {
    console.log('Testing generateItinerary with a known dataset destination...');

    // "Rockford" is the destination in the first row of our fetched dataset
    const params = {
        destination: 'Rockford',
        duration: 3,
        accessibilityNeeds: ['Wheelchair Access'],
        mobilityDetails: 'Uses a wheelchair',
        visionDetails: 'None',
        hearingDetails: 'None',
        cognitiveDetails: 'None'
    };

    try {
        const result = await generateItinerary(params);
        console.log('Result received!');
        console.log('Match Source:', result.match);
        console.log('Destination:', result.destination);
        console.log('Duration:', result.duration);
        console.log('First Day Activities:', JSON.stringify(result.itinerary[0].activities, null, 2));

        if (result.match && result.match.includes('Hugging Face Dataset')) {
            console.log('SUCCESS: Itinerary fetched from dataset.');
        } else {
            console.warn('WARNING: Itinerary did NOT come from dataset (or match string is missing).');
        }
    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();
