const fs = require('fs');
const path = require('path');

// Load the opus data
const opusData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../server-data/opus.json'), 
    'utf8'
));

describe('Data Representation Tests', () => {
    beforeAll(() => {
        // Ensure logs directory exists
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }
    });

    test('Check for forms and composers with less than 10 entries', () => {
        const formCounts = new Map();
        const composerCounts = new Map();
        const MINIMUM_ENTRIES = 10;

        // Count occurrences
        opusData.forEach(opus => {
            if (opus.form) {
                formCounts.set(opus.form, (formCounts.get(opus.form) || 0) + 1);
            }
            if (opus.composer) {
                composerCounts.set(opus.composer, (composerCounts.get(opus.composer) || 0) + 1);
            }
        });

        // Find items with low counts
        const lowCountForms = Array.from(formCounts.entries())
            .filter(([form, count]) => count < MINIMUM_ENTRIES)
            .sort((a, b) => a[1] - b[1]);

        const lowCountComposers = Array.from(composerCounts.entries())
            .filter(([composer, count]) => count < MINIMUM_ENTRIES)
            .sort((a, b) => a[1] - b[1]);

        // Log results
        console.log('\nForms with less than 10 entries:');
        lowCountForms.forEach(([form, count]) => {
            console.log(`  ${form}: ${count} entries`);
        });

        console.log('\nComposers with less than 10 entries:');
        lowCountComposers.forEach(([composer, count]) => {
            console.log(`  ${composer}: ${count} entries`);
        });

        // Create detailed log file
        const logContent = {
            summary: {
                totalForms: formCounts.size,
                totalComposers: composerCounts.size,
                lowCountForms: lowCountForms.length,
                lowCountComposers: lowCountComposers.length
            },
            lowCountForms: lowCountForms.map(([form, count]) => ({ form, count })),
            lowCountComposers: lowCountComposers.map(([composer, count]) => ({ composer, count }))
        };

        fs.writeFileSync(
            path.join(__dirname, 'logs', 'low-representation.log'),
            JSON.stringify(logContent, null, 2)
        );

        expect(lowCountForms.length).toBe(0);
        expect(lowCountComposers.length).toBe(0);
    });
}); 