import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { doc, onSnapshot } from "firebase/firestore";
import './Dashboard.css';
// import SpotifyLogin from '../components/SpotifyLogin';

const CLIENT_ID = 'f5910041cd764887a9ddb43e035a8b8a';
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/dashboard";
const SPACE_DELMITER = "%20"; 
const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELMITER);

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=f5910041cd764887a9ddb43e035a8b8a&response_type=code&redirect_uri=http://localhost:3000/dashboard&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


const Dashboard = () => {
    const { user } = useAuthState();
    const [currentUser, setCurrentUser] = useState([]);
    const docRef = doc(db, 'users', user?.uid);

    onSnapshot(docRef, (doc) => {
        setCurrentUser(doc.data());
    })

    const handleLogin = () => {
        window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    };

    return ( 
        <div className = 'dashboard-main'> 
            <h1> Hello, you are now signed in </h1>
            <h2> Name:  {currentUser.name } </h2>
            <h2> Email: {user?.email} </h2>
            <h2> UID: {user?.uid} </h2> 
            
            <div> 
                <button className = "signout-button" onClick={() => signOut(getAuth())}> Sign out </button>
            </div>

            <div className = 'spot-login-parent'>            
                <button className = "spot-login" onClick = {handleLogin}> Login into Spotify </button>
            </div>

        </div>
    );   
};

export default Dashboard;