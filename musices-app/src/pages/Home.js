import React, { Component } from 'react';
import './Home.css';

export default class Home extends Component {
    render() {
        return (
            <div className = 'home-main'> 
                <h1> Press Let's Get Started to create a Musices Account </h1>
                
                <div className = 'start-main'>
                    <a className = "main-link" href = "/signup">
                        <button className = "main-button"> <b> Lets Get Started </b> </button>
                    </a> 
                </div>
            </div>
        )
    }
}