const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new spotifyApi({
        redirectUri: 'http://localhost:3000/',
        clientID: 'ea3f794914fb41959f063faa7f5d4760',
        clientSecret: '356f73ead9184670a2702e9b8b544d44',
        refreshToken,
    })

    spotifyApi.refreshToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn,
        }) 
    }).catch(() => {
        res.sendStatus(400);
    })

})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyApi({
        redirectUri: 'http://localhost:3000/',
        clientID: 'ea3f794914fb41959f063faa7f5d4760',
        clientSecret: '356f73ead9184670a2702e9b8b544d44',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(() => {
        console.log(err);
        res.sendStatus(400)
    })
})

app.listen(3001);