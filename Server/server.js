const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const NewsAPI = require('newsapi');
const SpotifyWebApi = require("spotify-web-api-node");
const needle = require('needle');

const PORT = 3001;


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
app.use(cors());
app.use(bodyParser.json());

// declaration/initialization of twitter api bearer token (need to put in env file but im too lazy)
const TWITTER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAAmmYQEAAAAATVzoUpPMqhZJykR9%2FfBCGVk9CNQ%3DeJGrXqUI93cHJzD3DNStIS2MfMukULtXHfDMmQSlAkdVVWSRfU"

// twitter rules and tweet streaming api 
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

// temp rules
const rules = [
    {
        'value': 'music',
        'tag': 'music'
    }
];

async function getAllRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${TWITTER_TOKEN}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }

    return (response.body);
}

async function deleteAllRules() {
    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${TWITTER_TOKEN}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body)
    }

    return (response.body);
}

async function setRules() {
    const data = {
        "add": rules
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${TWITTER_TOKEN}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);
}

function streamConnect(retryAttempt) {
    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${TWITTER_TOKEN}`
        },
        timeout: 20000
    });

    stream.on('data', data => {
        try {
            const json = JSON.parse(data);
            console.log(json);

            retryAttempt = 0;
        } catch (error) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail);
                process.exit(1)
            } else {
                // do nothing casue we good
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1)
        } else {
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;
}

(async () => {
    let currentRules;

    try {
        // gets current applied rules to stream
        currentRules = await getAllRules();

        // delete rules function for tweet streaming
        await deleteAllRules(currentRules);

        // add rules to stream (pass in current artist state from fe?)
        await setRules();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    streamConnect(0);
})

// spotify refresh access token
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

// spotify user auth (me for now)
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

// lyrics library by current artist and current track state for params
app.get("/lyrics", async (req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})

// news api call
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
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(3001);

