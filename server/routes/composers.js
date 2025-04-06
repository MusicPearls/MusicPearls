const express = require('express');
const router = express.Router();
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { fetchData } = require('../utils');

/**
 * @swagger
 * /composers:
 *   get:
 *     summary: Get all composers
 *     description: Retrieves list of all composers
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async function(req, res) {
    try {
        
        const allComposers = await fetchData('composers.json');
        const composerInfo = allComposers.composers.map(c => ({
            name: c.name,
            birthyear: c.birthyear,
            period: c.period
        }));

        composerInfo.sort((a, b) => a.birthyear - b.birthyear);
        res.json({ 'Composers': composerInfo });

    } catch (error) {
        console.error('Error fetching composer list: ', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 