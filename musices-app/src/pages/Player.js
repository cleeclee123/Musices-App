import React, { } from 'react';
import './Dashboard.css';
import './Player.css';


const Player = () => {


    return ( 
        <div className = 'player-main'> 
            <h1> Player Page </h1>
            <div className = 'spot-login-parent'>        
                <button className = "spot-login" > Login into Spotify </button>
            </div>
        </div>
    )

}

export default Player;