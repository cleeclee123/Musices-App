import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';


const Dashboard = () => {
    const { user } = useAuthState();
    const [currentUser, setCurrentUser] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [token, setToken] = useState('');

    const docRef = doc(db, 'users', user?.uid);

    onSnapshot(docRef, (doc) => {
        setCurrentUser(doc.data());
    })

    var Buffer = require('buffer/').Buffer

    useEffect(()=>{
        axios('https://accounts.spotify.com/api/token', {
            'method': 'POST',
            'headers': {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer('f5910041cd764887a9ddb43e035a8b8a' + ':' + '5ee27ed26cac40d6a98aa43ce98478b5').toString('base64')),
            },
            data: 'grant_type=client_credentials'
        }).then(tokenresponse => {
            console.log(tokenresponse.data.access_token);
            setToken(tokenresponse.data.access_token);
        }).catch(error => console.log(error));
    }, []);

    return ( 
        <div className = 'dashboard-main'> 

            <div className = 'dashboard-user-info'> 
                <p>
                    Hello, you are now signed in <br></br>
                    Name:  {currentUser.name } <br></br>
                    Email: {user?.email} <br></br>
                    UID: {user?.uid} <br></br>
                    Access Token: {token} 
                </p>
            </div>

           
            <div className = 'signout-button-parent'>
                <Link to = "/home">
                    <button className = "signout-button" onClick = {() => signOut(getAuth())}> Sign out </button>
                </Link>
            </div>
            
            <div className = 'player-login-parent'>        
                <Link to = "/player"> <button className = "player-login" > Go to Player </button> </Link>
            </div>

        </div>
    )   
};

export default Dashboard;