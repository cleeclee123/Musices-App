import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tracks = () => {
    const [click, setClick] = useState(false);

    const [token, setToken] = useState("");
    const [tracks, setTracks] = useState([]);

    const id = '06HL4z0CvFAxyc27GXpf02';
	const market = 'US';

    var Buffer = require('buffer/').Buffer

    useEffect(()=>{
        if (click) {
            axios('https://accounts.spotify.com/api/token', {
                'method': 'POST',
                'headers': {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (new Buffer('Your Client ID' + ':' + 'Your Client Secret').toString('base64')),
                },
                data: 'grant_type=client_credentials'
            }).then(tokenresponse => {
                console.log(tokenresponse.data.access_token);
                setToken(tokenresponse.data.access_token);

                // Api call for retrieving tracks data
                axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,{
                    'method': 'GET',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenresponse.data.access_token
                    }
                }).then(trackresponse=> {
                    console.log(trackresponse.data.tracks);
                    setTracks(trackresponse.data.tracks);
                }).catch(error=> console.log(error))
            }).catch(error => console.log(error));
        }
	}, [click])


    return (
        <div>
            <button onClick={() => setClick(true)}> Get Tracks </button>
        </div>
    )
} 

export default Tracks;
