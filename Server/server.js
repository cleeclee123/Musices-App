const express = require("express")
const cors = require("cors")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
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
        }
    )
})

app.post("/signin", (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        rredirectUri: 'http://localhost:3000',
        clientId: 'f5910041cd764887a9ddb43e035a8b8a',
        clientSecret: '5ee27ed26cac40d6a98aa43ce98478b5',
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            res.sendStatus(400)
        }
    )
})

app.listen(3001)