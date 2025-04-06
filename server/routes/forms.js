const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { fetchData } = require('../utils');

/**
 * @swagger
 * /forms:
 *   get:
 *     summary: Get all musical forms
 *     description: Retrieves list of all possible musical forms
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async function(req, res) {    
    try {
        const allOpus = await fetchData('opus.json');
        const allForms = await fetchData('forms.json');

        // Count occurrences of each form
        const formCounts = {};
        allOpus.forEach(opus => {
            formCounts[opus.form] = (formCounts[opus.form] || 0) + 1;
        });

        // Create array of forms with their categories and count
        const forms = allForms.forms.map(form => ({
            name: form.formName,
            category: form.category,
            count: formCounts[form.formName] || 0
        }));

        // Sort forms by count (most frequent first)
        forms.sort((a, b) => b.count - a.count);

        res.json({'Forms': forms});

    } catch (error) {
        console.error('Error reading musical form list: ', error);
        res.status(500).send('Server Error');
}
});

/**
 * @swagger
 * /forms/description:
 *   get:
 *     summary: Get form description
 *     parameters:
 *       - in: query
 *         name: form
 *         schema:
 *           type: string
 *         description: Name of the form
 *     responses:
 *       200:
 *         description: Form description
 */
router.get('/description', async function(req, res) {
    var formName = req.query.form || null
    try {
        const allForms = (await fetchData('forms.json')).forms;
        const formEntry = allForms.find(item => item.formName === formName)
        formDescription = formEntry ? formEntry.description : "Description not found";
        return res.json({form: formName, description: formDescription})
    } catch (error) {
        console.error('Error reading forms list: ', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 