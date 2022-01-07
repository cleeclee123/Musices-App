import React, { Component } from 'react';
import { useAuthContext } from '../context/auth';
import './Dashboard.css';

const Dashboard = () => {
    return ( 
        <div className = 'dashboard-main'> 
            <h1> Hello, you are now signed in </h1>
            <h2> Name: </h2>
            <h2> Email: </h2>
            <button> Log out </button> 
            
        </div>
    )   
}

export default Dashboard;