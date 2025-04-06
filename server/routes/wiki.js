const express = require('express');
const router = express.Router();
const request = require('request');

/**
 * @swagger
 * /wiki/opus:
 *   get:
 *     summary: Search Wikipedia for opus information
 *     parameters:
 *       - in: query
 *         name: opus
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         required: true
 */
function findBestMatchingTitle(titles, opus, composer) {
    // Parse composer name
    const nameParts = composer.trim().split(' ');
    const lastName = nameParts[nameParts.length - 1];

    // Parse the opus name and catalog number more strictly
    const catalogMatch = opus.match(/\b(bwv|k|op|opus)\b\.?\s*\d+/gi);
    
    // Separate catalog prefix and number
    let catalogPrefix = null;
    let catalogNumber = null;
    if (catalogMatch) {
        const match = catalogMatch[0].toLowerCase();
        catalogPrefix = match.match(/\b(bwv|k|op|opus)\b/i)[0].toLowerCase();
        catalogNumber = match.match(/\d+/)[0];
        
    }
    
    const songParts = opus.toLowerCase()
        .replace(/[.,]/g, '')
        .replace(/\b(no|op|opus|bwv|k)\b\.?\s*/gi, '')
        .trim()
        .split(/\s+/);
    
    const songNumbers = opus.match(/(?:No\.\s*)?(\d+)/gi);
    let highScore = 0;
    let bestMatch = titles[0];

    titles.forEach(title => {
        let score = 0;
        const titleLower = title.toLowerCase();
        
        console.log('\nEvaluating title:', title);
        
        // Check for exact catalog match
        if (catalogPrefix && catalogNumber) {
            const titleCatalogMatch = titleLower.match(/\b(bwv|k|op|opus)\b\.?\s*\d+/gi);
            if (titleCatalogMatch) {
                const titleMatch = titleCatalogMatch[0].toLowerCase();
                const titlePrefix = titleMatch.match(/\b(bwv|k|op|opus)\b/i)[0].toLowerCase();
                const titleNumber = titleMatch.match(/\d+/)[0];
                
                if (titlePrefix === catalogPrefix && titleNumber === catalogNumber) {
                    score += 8;
                    console.log('Catalog match found:', `${titlePrefix} ${titleNumber}`, '(+8 points)');
                }
            }
        }

        const titleParts = titleLower
            .replace(/[.,()]/g, '')
            .split(/\s+/);
        
        // Must have the form in the title
        const form = songParts[0];
        if (!titleLower.includes(form.toLowerCase())) {
            return;
        }

        // Base score for having the form
        score += 3;
        console.log('Form match found:', form, '(+3 points)');

        // Skip generic pages
        const genericTerms = ['list of', 'catalogue', 'verzeichnis', 'complete', 'repertoire'];
        if (genericTerms.some(term => titleLower.includes(term))) {
            return;
        }

        // Composer name is a bonus
        if (title.includes(lastName)) {
            score += 2;
            console.log('Composer match found:', lastName, '(+2 points)');
        }

        // Check additional words, excluding the form word
        const remainingParts = songParts.filter(part => part !== form.toLowerCase());
        remainingParts.forEach(part => {
            if (titleParts.includes(part)) {
                score += 1;
                console.log('Additional word match:', part, '(+1 point)');
            }
        });


        if (score > highScore) {
            highScore = score;
            bestMatch = title;
        }
    });

    console.log('\nFinal selection:', bestMatch, 'with score:', highScore);
    
    return { 
        bestMatch, 
        score: highScore,
        searchedForm: songParts[0],
        catalogInfo: catalogPrefix && catalogNumber ? `${catalogPrefix} ${catalogNumber}` : null,
        composerLastName: lastName
    };
}

router.get('/opus', async function(req, res) {
    const query = req.query
    if (!query) {
        return res.status(400).send('No query parameter given')
    }
    
    const opus = query.opus || null;
    const composer = query.composer || null;

    if (!composer){
        return res.status(400).send('Bad Request. No composer name')
    }

    // Create search parameter for Wikipedia
    const wikiSearchParam = `${opus} (${composer.split(' ').pop()})`

    // Search Wikipedia for relevant articles
    const searchUrl = 'https://en.wikipedia.org/w/api.php';
    const searchParams = {
        action: 'query',
        list: 'search',
        format: 'json',
        srsearch: wikiSearchParam
    }
    
    request({ url: searchUrl, qs: searchParams, json: true}, (err, response, searchData) => {
        if (err) {
            console.error('Error searching Wikipedia: ', err);
            return res.status(500).send('Error searching Wikipedia');
        }
        
        if (searchData.query) {
            const titles = searchData.query.search.map(article => article.title);
            
            // Debug logging
            console.log('Search query:', wikiSearchParam);
            console.log('Found titles:', JSON.stringify(titles, null, 2));
            
            const { bestMatch, score } = findBestMatchingTitle(titles, opus, composer);

            // If no article containing name of composer and musical form of opus, returns not found
            if (score < 4) {
                return res.status(404).json({
                    error: "No matching description found for this musical work",
                    searchQuery: wikiSearchParam,
                    bestScore: score,
                    searchedTitles: titles
                });
            }

            // Get the summary of the best matched Wikipedia article
            wikiTitle = bestMatch;
            const pageQueryParam = {
                action: 'query',
                format: 'json',
                prop: 'extracts|info',
                exintro: true,
                explaintext: true,
                inprop: 'url',
                titles: wikiTitle
            }

            request( {url: searchUrl, qs: pageQueryParam, json: true}, (err, response, opusData) => {
                if (err) {
                    console.error('Error finding the work page: ', err);
                    return res.status(404).send('Work page not found in Wikipedia')
                }
                if (opusData.query) {
                    const opusQuery = opusData.query.pages;
                    const pageKey = Object.keys(opusQuery)[0];
                    const opusSummary = opusQuery[`${pageKey}`].extract.split('\n')[0];
                    const fullUrl = opusQuery[`${pageKey}`].fullurl;
                    return res.json({opus: opus, summary: opusSummary, fullUrl: fullUrl});
                }
                else {
                    return res.status(404).send('No contend found')
                }       
            })
        }
        else {
            res.status(404).send('No search query')
        }
    })
});

/**
 * @swagger
 * /wiki/composer:
 *   get:
 *     summary: Search Wikipedia for composer information
 *     parameters:
 *       - in: query
 *         name: composer
 *         schema:
 *           type: string
 *         required: true
 */
router.get('/composer', async function(req, res) {
    const query = req.query
    const composer = query.composer || null;
    const searchUrl = 'https://en.wikipedia.org/w/api.php';
    if (!composer){
        return res.status(400).send('Bad Request. No composer name')
    }
    else{
        const pageQueryParam = {
            action: 'query',
            format: 'json',
            prop: 'extracts|info',
            exintro: true,
            explaintext: true,
            inprop: 'url',
            titles: composer
        }
        request( {url: searchUrl, qs: pageQueryParam, json: true}, (err, response, wikiData) => {
            if (err) {
                console.error('Error finding the work page: ', err);
                return res.status(400).send('Error fetching Wikipedia')
            }
            if (wikiData.query) {
                const wikiQuery = wikiData.query.pages;
                const pageKey = Object.keys(wikiQuery)[0];
                const wikiSummary = wikiQuery[`${pageKey}`].extract.split('\n')[0];
                const fullUrl = wikiQuery[`${pageKey}`].fullurl;
                return res.json({composer: composer, summary: wikiSummary, url:fullUrl});
            }
            else {
                return res.status(404).send(`${composer} article not found in Wikipedia`)
            }
        })
    }
});

module.exports = router; 