import React, { } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'
import './Home.css';

const Home = () => {

    return (
        <div className = 'home-main'> 
            <h1> Press Let's Get Started to create a Musices Account </h1>

            <div className = 'signout-button-parent'>
                <Link to = "/home">
                    <button className = "signout-button" onClick = {() => signOut(getAuth())}> Sign out </button>
                </Link>
            </div>
            
            <div className = 'start-main'>
                <a className = "main-link" href = "/signup">
                    <button className = "main-button"> <b> Lets Get Started </b> </button>
                </a> 
            </div>
        </div>
    );
};

export default Home;