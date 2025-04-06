const fs = require('fs');
const path = require('path');

// Load the opus data
const opusData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../server-data/opus.json'), 
    'utf8'
));

// Helper function to normalize opus names (keeping numbers)
const normalizeOpusName = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Only remove non-alphanumeric except periods
        .trim();
};

describe('Opus Data Integrity Tests', () => {
    beforeAll(() => {
        // Ensure logs directory exists
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
    });

    test('Check for duplicate opusName + composer combinations', () => {
        const opusMap = new Map();
        const duplicates = [];

        opusData.forEach((opus, index) => {
            if (!opus.opusname || !opus.composer) return; // Skip if missing required fields

            const normalizedOpusName = normalizeOpusName(opus.opusname);
            const key = `${normalizedOpusName}___${opus.composer}`;

            if (opusMap.has(key)) {
                // Found a duplicate
                const existingForms = opusMap.get(key).forms;
                if (!existingForms.includes(opus.form)) {
                    existingForms.push(opus.form);
                }
                // Store original opusname if different
                const existingOpusNames = opusMap.get(key).opusnames;
                if (!existingOpusNames.includes(opus.opusname)) {
                    existingOpusNames.push(opus.opusname);
                }
            } else {
                opusMap.set(key, {
                    opusnames: [opus.opusname],
                    composer: opus.composer,
                    forms: [opus.form]
                });
            }
        });

        // Find entries with multiple forms
        opusMap.forEach(entry => {
            if (entry.forms.length > 1 || entry.opusnames.length > 1) {
                duplicates.push({
                    opusnames: entry.opusnames,
                    composer: entry.composer,
                    forms: entry.forms
                });
            }
        });

        // Log the duplicates in a readable format
        if (duplicates.length > 0) {
            console.log('\nFound potential duplicates:');
            duplicates.forEach(dup => {
                console.log(`\nComposer: ${dup.composer}`);
                console.log(`  Opus names: ${dup.opusnames.join(', ')}`);
                console.log(`  Forms: ${dup.forms.join(', ')}`);
            });
        }

        // Create a detailed log file
        const logContent = duplicates.length > 0 
            ? `Found ${duplicates.length} potential duplicates:\n\n` + 
              JSON.stringify(duplicates, null, 2)
            : 'No potential duplicates found.';

        fs.writeFileSync(
            path.join(__dirname, 'logs', 'duplicate-opus.log'),
            logContent
        );

        // Optional: You can comment this out if you don't want the test to fail on duplicates
        expect(duplicates).toHaveLength(0);
    });
}); 