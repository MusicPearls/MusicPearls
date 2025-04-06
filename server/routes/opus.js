const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { fetchData } = require('../utils');



function calculateWeightedScores(data, key, popularityField) {
    const stats = {};
    data.forEach(opus => {
        const groupKey = opus[key];
        if (!stats[groupKey]) {
            stats[groupKey] = {
                totalPopularity: 0,
                pieceCount: 0,
                totalRecordings: 0
            };
        }
        stats[groupKey].totalPopularity += opus[popularityField];
        stats[groupKey].pieceCount += 1;
        stats[groupKey].totalRecordings += opus.recordingCount;
    });

    return Object.entries(stats).map(([group, values]) => {
        const avgPopularity = values.totalPopularity / values.pieceCount;
        const pieceWeight = Math.log2(values.pieceCount + 1);
        const recWeight = Math.log2(values.totalRecordings + 1);
        return {
            [key]: group,
            score: avgPopularity * pieceWeight * recWeight
        };
    }).sort((a, b) => b.score - a.score);
}

function handleComposerRequest(allOpus, composerName) {
    const composerOpus = allOpus
        .filter(item => item.composer === composerName && item.composerRelevant)
        .map(({ opusname, composer, form, composerPopularity, recordingCount, representativeTrack }) => ({
            opusname, composer, form, composerPopularity, recordingCount, representativeTrack
        }));

    const formScores = calculateWeightedScores(composerOpus, 'form', 'composerPopularity');
    const topForms = formScores.slice(0, 3).map(entry => entry.form);

    composerOpus.sort((a, b) => b.composerPopularity - a.composerPopularity);

    return { composerOpus, topForms };
}

function handleFormRequest(allOpus, formName) {
    const formOpus = allOpus
        .filter(item => item.form === formName && item.formRelevant)
        .map(({ opusname, composer, form, formPopularity, recordingCount, representativeTrack }) => ({
            opusname, composer, form, formPopularity, recordingCount, representativeTrack
        }));

    const composerScores = calculateWeightedScores(formOpus, 'composer', 'formPopularity');
    const topComposers = composerScores.slice(0, 3).map(entry => entry.composer);

    formOpus.sort((a, b) => b.formPopularity - a.formPopularity);

    return { formOpus, topComposers };
}


/**
 * @swagger
 * /opus:
 *   get:
 *     summary: Get list of works from composer and/or musical form
 *     description: Retrieves the list of all works from composer and/or musical form
 *     parameters:
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         description: Composer's name
 *       - in: query
 *         name: form
 *         schema:
 *           type: string
 *         description: Musical form
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async function(req, res) {
    const composerName = req.query.composer || null;
    const formName = req.query.form || null;

    try {
        const allOpus = await fetchData('opus.json');

        if (composerName && !formName) {
            const { composerOpus, topForms } = handleComposerRequest(allOpus, composerName);
            return res.json({ Opus: composerOpus, TopForms: topForms });
        }

        if (formName && !composerName) {
            const { formOpus, topComposers } = handleFormRequest(allOpus, formName);
            return res.json({ FormOpus: formOpus, TopComposers: topComposers });
        }

        if (formName && composerName) {
            return res.status(400).send('Bad Request: Select either composer or form');
        }

        return res.status(400).send('Bad Request: No composer or musical form requested');
    } catch (error) {
        console.error('Error reading opus data:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;