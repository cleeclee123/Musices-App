import React, { Component } from 'react';
import { useAuthContext } from '../context/auth';
import './Dashboard.css';

const Dashboard = () => {
    return ( 
        <div className = 'dashboard-main'> 
            <h1> Hello, you are now signed in </h1>
            
        </div>
    )   
}

export default Dashboard;