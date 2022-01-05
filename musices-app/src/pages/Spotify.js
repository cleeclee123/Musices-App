import React from 'react';
import app from '../firebase/config';
import { useUserContext } from '../firebase/Context';
import './Spotify.css';

const Spotify= () => {
    const { user, logoutUser } = useUserContext();

    return (
        <div className = 'spotify-main'> 
            <h1> Spotify (Logged into Musices) </h1>
            <h2>Name : {user.displayName}</h2>
            <h2>Email : {user.email}</h2>
            <button onClick={logoutUser}>Log out</button>
        </div>
    );
};

export default Spotify;