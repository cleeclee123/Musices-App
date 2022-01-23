const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const NewsAPI = require('newsapi');
const SpotifyWebApi = require("spotify-web-api-node");
const needle = require('needle');
const util = require('util');
const request = require("request");
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const PORT = 3000;

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

const app = express();
const post = util.promisify(request.post);
const get = util.promisify(request.get);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIO(server);

// declatation/initialization of twitter api bearer token (need to put in env file but im too lazy)
const TWITTER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAAmmYQEAAAAAMtvfIgDuAw9kAo1vKi1mgBmvy88%3DzOrlZzk3e9PkX4XVrWQVWZvBM5kZlTWi9WtIZlxYSNy3Rtf2I7"

let timeout = 0;

// api endpoints for streams
const rulesURL = new URL (
    'https://api.twitter.com/2/tweets/search/stream/rules'
);
const streamURL = new URL (
    'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'
);

const rules = [
    { value: 'GIVE' }
]

/* app.get("/lyrics", async (req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
}) */

// Get stream rules
async function getRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TWITTER_TOKEN}`,
        },
    })
    console.log(response.body)
    return response.body
}

// Set stream rules
async function setRules() {
    const data = {
        add: rules,
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',

            Authorization: `Bearer ${TWITTER_TOKEN}`,
        },
    })

    return response.body
}

// Delete stream rules
async function deleteRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null
    }

    const ids = rules.data.map((rule) => rule.id)

    const data = {
        delete: {
            ids: ids,
        },
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',

            Authorization: `Bearer ${TWITTER_TOKEN}`,
        },
    })

    return response.body
}

function streamTweets(socket) {
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    })

    stream.on('data', (data) => {
        try {
            const json = JSON.parse(data)
            console.log(json)
            socket.emit('tweet', json)
    } catch (error) {

    }
  })

  return stream
}

io.on('connection', async () => {
    console.log('Client connected...')

    let currentRules

    try {
        //   Get all stream rules
        currentRules = await getRules()

        // Delete all stream rules
        await deleteRules(currentRules)

        // Set rules based on array above
        await setRules()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

    const filteredStream = streamTweets(io)

    let timeout = 0
    filteredStream.on('timeout', () => {
        // Reconnect on error
        console.warn('A connection error occurred. Reconnecting…')
        setTimeout(() => {
            timeout++
            streamTweets(io)
        }, 2 ** timeout)
        streamTweets(io)
    })
})

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

// server.listen(port);
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
app.listen(3001);

