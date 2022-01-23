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
let port = 3001;
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

const errorMessage = {
    title: "Please Wait",
    detail: "Waiting for new Tweets to be posted...",
};
  
const authMessage = {
    title: "Could not authenticate",
    details: [
      `Please make sure your token is correct.`,
    ],
    type: "https://developer.twitter.com/en/docs/authentication",
};
  
const sleep = async (delay) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

// get method for twitter api tweet streaming 
app.get("api/rules", async (req, res) => {
    if (!TWITTER_TOKEN) {
        res.status(400).send(authMessage);
    }

    const token = TWITTER_TOKEN;
    
    const requestConfig = {
        url: rulesURL,
        auth: {
            bearer: token,
        },
        json: true,
    };

    try {
        const response = await get(requestConfig);

        if (response.statusCode !== 200) {
            if (response.statusCode === 403) {
                res.status(403).send(response.body);
            } else {
                throw new Error(response.body.error.message);
            }
        }

        res.send(response);
    } catch (error) {
        res.send(error);
    }
});

// post method for twitter api tweet streaming 
app.post("/api/rules", async (req, res) => {
    if (!TWITTER_TOKEN) {
        res.status(400).send(authMessage);
    }

    const token = TWITTER_TOKEN;
    
    const requestConfig = {
        url: rulesURL,
        auth: {
            bearer: token,
        },
        json: req.body,
    };

    try {
        const response = await post(requestConfig);

        if (response.statusCode === 200 || response.statusCode === 201) {
            res.send(response);
        } else {
            throw new Error(response);
        }
    } catch (error) {
        res.send(error);
    }
});

// streaming tweets
const streamTweets = (socket, token) => {
    let stream;

    const config = {
        url: streamURL,
        auth: {
            bearer: token,
        },
        timeout: 31000,
    };

    try {
        const stream = request.get(config);

        stream.on(
            "data", (data) => {
                try {
                    const json = JSON.parse(data);

                    if (json.connection_issue) {
                        socket.emit("error", json);
                        reconnect(stream, socket, token);
                    } else {
                        if (json.data) {
                            socket.emit("tweet", json);
                        } else {
                            socket.emit("authError", json);
                        }
                    }
                } catch (error) {
                    socket.emit("heartbeat");
                }
            }
        )
        .on("error", (error) => {
            socket.emit("error", errorMessage);
            reconnect(stream, socket, token);
        });
    } catch (error) {
        socket.emit("authError", authMessage);
    }
};

const reconnect = async (stream, socket, token) => {
    timeout++;
    stream.abort();
    await sleep(2 ** timeout * 1000);
    streamTweets(socket, token);
};

io.on("connection", async (socket) => {
    try {
        const token = TWITTER_TOKEN;
        io.emit("connect", "Clinet connect");
        const stream = streamTweets(io, token);
    } catch (error) {
        io.emit("authError", authMessage);
    }
});

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
app.listen(3001);

