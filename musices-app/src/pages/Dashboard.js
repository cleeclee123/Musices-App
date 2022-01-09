import React, { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { doc, onSnapshot } from "firebase/firestore";
import './Dashboard.css';
import SpotifyLogin from '../components/SpotifyLogin';

const Dashboard = () => {
    const { user } = useAuthState();
    const [currentUser, setCurrentUser] = useState([]);
    const docRef = doc(db, 'users', user?.uid)

    onSnapshot(docRef, (doc) => {
        setCurrentUser(doc.data());
    })

    return ( 
        <div className = 'dashboard-main'> 
            <h1> Hello, you are now signed in </h1>
            <h2> Name:  {currentUser.name } </h2>
            <h2> Email: {user?.email} </h2>
            <h2> UID: {user?.uid} </h2> 
            
            <button className = "signout-button" onClick={() => signOut(getAuth())}> Sign out </button>
            
            <div className = 'spot-login'>
                <SpotifyLogin/>
            </div>
            
            
        </div>
    );   
};

export default Dashboard;