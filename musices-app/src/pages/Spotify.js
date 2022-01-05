import React, { Component } from 'react';
import app from '../firebase/config';
import './Spotify.css';

const Spotify= () => {

    return (
        <div className = 'spotify-main'> 
            <h1> Spotify (Logged into Musices) </h1>
            <button onClick={() => app.auth().signOut()}> Logout </button>
        </div>
    )

}

export default Spotify;