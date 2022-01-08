import React, { Component } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState } from '../firebase/config'
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuthState();

    return ( 
        <div className = 'dashboard-main'> 
            <h1> Hello, you are now signed in </h1>
            <h1> Welcome {user?.email} </h1> 
            <button onClick={() => signOut(getAuth())}>Sign out</button>
            
        </div>
    )   
}

export default Dashboard;