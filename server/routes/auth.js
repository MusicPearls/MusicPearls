const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Redirects to Spotify authentication
 *     description: Initiates the Spotify OAuth flow
 *     responses:
 *       302:
 *         description: Redirects to Spotify login page
 */
router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type : 'code',
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI
    }));
});

/**
 * @swagger
 * /callback:
 *   get:
 *     summary: Spotify OAuth callback
 *     description: Handles the callback from Spotify authentication
 *     responses:
 *       302:
 *         description: Redirects with access token
 */
router.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        json: true
    };
    
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            res.cookie('access_token', access_token, {
                expires: new Date(Date.now() + 900000)
            })
            res.cookie('refresh_token', refresh_token, {
                expires: new Date(Date.now() + 900000)
            })
            res.redirect('/');
        } else {
            res.redirect('/#' + 
                querystring.stringify({
                    error: 'invalid_token'
                }));
        };
    });
});

module.exports = router; 