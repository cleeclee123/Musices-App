const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const NewsAPI = require('newsapi');
const SpotifyWebApi = require("spotify-web-api-node");
const needle = require('needle');

// declatation/initialization of twitter api bearer token (need to put in env file but im too lazy)
const TWITTER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAAmmYQEAAAAAMtvfIgDuAw9kAo1vKi1mgBmvy88%3DzOrlZzk3e9PkX4XVrWQVWZvBM5kZlTWi9WtIZlxYSNy3Rtf2I7"

// api endpoints for streams
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var weekAgo = new Date();
var ddW = String(weekAgo.getDate()).padStart(2, '0') - 7;
var mmW = String(weekAgo.getMonth() + 1).padStart(2, '0'); 
var yyyyW = weekAgo.getFullYear();

var today = new Date();
var ddC = String(today.getDate()).padStart(2, '0');
var mmC = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyyC = today.getFullYear();

today = yyyyC + '-' + mmC + '-' + ddC;
weekAgo  = yyyyW + '-' + mmW + '-' + ddW;


app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/dashboard',
        clientId: 'f5910041cd764887a9ddb43e035a8b8a',
        clientSecret: '5ee27ed26cac40d6a98aa43ce98478b5',
        refreshToken,
    })

    spotifyApi
    .refreshAccessToken()
    .then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn,
        })
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.post("/signin", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi ({
        redirectUri: 'http://localhost:3000/dashboard',
        clientId: 'f5910041cd764887a9ddb43e035a8b8a',
        clientSecret: '5ee27ed26cac40d6a98aa43ce98478b5',
    })

    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        res.json({
            redirectUri: 'http://localhost:3000/dashboard',
            clientId: 'f5910041cd764887a9ddb43e035a8b8a',
            clientSecret: '5ee27ed26cac40d6a98aa43ce98478b5',
        })
    })
    .catch(error => {
        if (!error.res) {
            // network error
            this.errorStatus = 'Error: Network Error';
        } else {
            this.errorStatus = error.res.data.message;
        }
    })
})

app.get("/lyrics", async (req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})

app.get("/currentNews", (req, res) => {
    const currentNews =
        newsapi.v2.topHeadlines({
            q: req.query.artist,
            language: 'en',
            country: 'us'
        }).then(res => {
            console.log(res);
        });
    res.json({ currentNews })
})

app.listen(3001)

