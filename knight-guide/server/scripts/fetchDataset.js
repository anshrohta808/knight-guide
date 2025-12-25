import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET = 'osunlp/TravelPlanner';
const OUTPUT_FILE = path.join(__dirname, '../data/travel_planner.json');
const SPLITS = ['train', 'validation', 'test'];

async function fetchSplit(split) {
    console.log(`Fetching ${split} split...`);
    let rows = [];
    let offset = 0;
    const length = 100; // Fetch 100 at a time
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await axios.get('https://datasets-server.huggingface.co/rows', {
                params: {
                    dataset: DATASET,
                    config: 'train', // The config name seems to be 'train' for all splits usually, or default
                    split: split,
                    offset: offset,
                    length: length
                }
            });

            const newRows = response.data.rows;
            if (newRows.length === 0) {
                hasMore = false;
            } else {
                rows = rows.concat(newRows);
                offset += length;
                console.log(`  Fetched ${rows.length} rows for ${split}...`);

                // Safety limit to avoid fetching infinitely if something is wrong
                if (offset > 2000) {
                    console.log('  Reached safety limit (2000 rows). Stopping for this split.');
                    hasMore = false;
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn(`  Split ${split} not found or end reached.`);
                hasMore = false;
            } else {
                console.error(`  Error fetching ${split}:`, error.message);
                hasMore = false;
            }
        }
    }
    return rows;
}

async function main() {
    let allData = [];

    // Try fetching 'train' split first since that's confirmed to exist
    // Note: The 'config' parameter might differ. Usually it's 'default' or same as dataset name.
    // Based on previous code, used 'train' as config.

    for (const split of SPLITS) {
        const splitRows = await fetchSplit(split);
        allData = allData.concat(splitRows);
    }

    console.log(`Total rows fetched: ${allData.length}`);

    // Simplify data structure for saving
    const simplifiedData = allData.map(item => {
        return {
            row_idx: item.row_idx,
            ...item.row
        };
    });

    try {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simplifiedData, null, 2));
        console.log(`Successfully saved dataset to ${OUTPUT_FILE}`);
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

main();
