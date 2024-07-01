var http = require('http')
var express = require('express');
var request = require('request');
var querystring = require('querystring')
const cookieParser = require('cookie-parser')
const fs = require('fs');
var path = require('path')
const cors = require('cors');
var AWS = require('aws-sdk');
var awsConfig = new AWS.Config({
    credentials: {accessKeyId:'', secretAccessKey:''},
    region: 'us-east-1'
});
var ddb = new AWS.DynamoDB(awsConfig);

// Credentials of Spotify App
var client_id = ''
var client_secret = ''
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// Login page -> Redirects to Spotify authentication page with app credentials
app.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type : 'code',
        client_id: client_id,
        redirect_uri: redirect_uri
    }));
});

// Callback page -> callback address in Spotify app. Receives authentication code and requests access token
//               -> redirects to '/' with access token and refresh token in cookies
app.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {code: code,
               redirect_uri: redirect_uri,
               grant_type: 'authorization_code'},
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))},
        json: true
    };
    
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            var refresh_token = body.refresh_token;
            // res.redirect('/#' + 
            //     querystring.stringify({
            //         access_token: access_token,
            //         refresh_token: refresh_token
            //     }));
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

app.get('/', function(req, res) {
    // console.log(req.cookies.access_token)
    res.sendFile('homepage.html', {root: __dirname})

});

app.get('/composer', function(req, res) {

    var allComposers = JSON.parse(fs.readFileSync('../data/composers.json', 'utf8'));

    var composerName = req.query.name || null

    if (composerName) {
        // Send all opus from chosen composer
        var allOpus = JSON.parse(fs.readFileSync('../data/opus.json', 'utf8'));
        const composerOpus = allOpus.filter(item => item.composer === composerName)
        composerOpus.sort((a, b) => b.popularity - a.popularity);
        res.json({'Opus': composerOpus})
    }

    else {
        let composerInfo = allComposers.composers.map(c => ({name:c.name, birthyear:c.birthyear}));
        composerInfo.sort((a,b) => a.birthyear - b.birthyear)
        res.json({'Composers': composerInfo})
    }
})

app.get('/form', function(req, res) {

    var allOpus = JSON.parse(fs.readFileSync('../data/opus.json', 'utf8'));
    var formName = req.query.formname || null

    if (formName) {
        // Get all opus from the chosen form and rank them by popularity
        var allOpus = JSON.parse(fs.readFileSync('../data/opus.json', 'utf8'));
        const formOpus = allOpus.filter(item => item.form === formName)
        formOpus.sort((a, b) => b.popularity - a.popularity);
        res.json({'FormOpus': formOpus})
    }

    else {
        const uniqueForms = new Set();
        allOpus.forEach(obj => {
            uniqueForms.add(obj['form'])
        })
        formsArr = Array.from(uniqueForms)
        res.json({'Forms': formsArr})
    }
}
);

console.log('Listening on 8888');
app.listen(8888);