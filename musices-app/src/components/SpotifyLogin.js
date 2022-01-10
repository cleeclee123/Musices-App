import React from "react";
import './SpotifyLogin.css';

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=f5910041cd764887a9ddb43e035a8b8a&response_type=code&redirect_uri=http://localhost:3000/&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
    return (
        <div className = "spotifylogin-main">
            <button className = "spotify-login"> <a href = {AUTH_URL}>
                Login With Spotify
            </a> </button>
        </div>
    )
}