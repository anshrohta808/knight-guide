import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../data/travel_planner.json');
const OUTPUT_FILE = path.join(__dirname, '../data/travel_planner_clean.json');

function parsePythonLiteral(str) {
    if (!str) return null;
    try {
        // Attempt 1: Simple replacements
        // This is tricky because replacing ' globally breaks words like "Martin's"
        // But the dataset seems to use " for strings with ' inside.
        // Let's try to use a slightly smarter regex or `eval` if we trust the source (we generally shouldn't, but this is a localized dataset)

        // Actually, since this is a hackathon project and running locally, 
        // and we want results fast.
        // We can try to use `Function` constructor to evaluate it as JS if we replace Pythonisms.

        let jsObj = str
            .replace(/None/g, 'null')
            .replace(/False/g, 'false')
            .replace(/True/g, 'true');

        // The structure is Python: [{'key': 'value'}, ...]
        // JS accepts {key: 'value'}, so if we can just treat it as JS code...
        // But keys are quoted in Python 'key'. JS allows that.
        // The issue is strictly string quoting.

        // Let's try using `eval` carefully on the data string.
        // WARNING: unsafe in production with untrusted input.
        // For this task with HF dataset, it's a pragmatic "turbo" solution.

        // We need to ensure it's wrapped in parentheses to be an expression
        const fixedStr = `(${jsObj})`;
        return eval(fixedStr);

    } catch (e) {
        console.warn('  Eval failed, trying regex approach for snippet:', str.substring(0, 50));

        try {
            // Fallback: Aggressive regex replacement (might break some strings)
            let jsonStr = str
                .replace(/'/g, '"')
                .replace(/None/g, 'null')
                .replace(/False/g, 'false')
                .replace(/True/g, 'true')
                .replace(/\(/g, '[') // tuples to lists
                .replace(/\)/g, ']');
            return JSON.parse(jsonStr);
        } catch (e2) {
            console.error('  Failed to parse row.');
            return null;
        }
    }
}

function main() {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error('Input file not found:', INPUT_FILE);
        return;
    }

    const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    console.log(`Loaded ${data.length} rows.`);

    const cleanData = data.map(row => {
        const cleanRow = { ...row };

        // Parse annotated_plan
        if (typeof row.annotated_plan === 'string') {
            cleanRow.parsed_plan = parsePythonLiteral(row.annotated_plan);
        }

        // Parse local_constraint
        if (typeof row.local_constraint === 'string') {
            cleanRow.parsed_constraint = parsePythonLiteral(row.local_constraint);
        }

        return cleanRow;
    });

    // Filter out rows where parsing failed significantly if we want, or keep them.
    // Let's keep them but maybe log how many succeeded.
    const successCount = cleanData.filter(r => r.parsed_plan).length;
    console.log(`Successfully parsed plans for ${successCount} / ${cleanData.length} rows.`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanData, null, 2));
    console.log(`Saved clean dataset to ${OUTPUT_FILE}`);
}

main();
