const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('./dashboard', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({ 
        redirectUri: 'http://localhost:3000',
        clientId: 'f5910041cd764887a9ddb43e035a8b8a',
        clientSecret: '5ee27ed26cac40d6a98aa43ce98478b5',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token, 
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400);
    })
})