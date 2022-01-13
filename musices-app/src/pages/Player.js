import React, { } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'
import './Player.css';


const Player = () => {


    return ( 
        <div className = 'player-main'> 
            <h1 className = 'player-temp'> Player Page </h1>


            <div className = 'signout-button-parent'>
                <Link to = "/home">
                    <button className = "signout-button" onClick = {() => signOut(getAuth())}> Sign out </button>
                </Link>
            </div>
        </div>
    )

}

export default Player;