const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new spotifyApi({
        redirectUri: 'http://localhost:3000',
        clientID: 'ea3f794914fb41959f063faa7f5d4760',
        clientSecret: '356f73ead9184670a2702e9b8b544d44',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.acess_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
    .catch(() => {
        res.sendStatus(400)
    })
})

app.listen(3001);