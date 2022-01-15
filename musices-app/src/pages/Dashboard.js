import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';
import './Dashboard.css';
import axios from 'axios';
import { transcode } from 'buffer';

// cheeky token refresh 
window.setTimeout(function () {
    window.location.reload();
}, 3300000);


const Dashboard = () => {
    const { user } = useAuthState();
    const [currentUser, setCurrentUser] = useState([]);
    const [token, setToken] = useState('');

    const collectionRef = collection(db, 'users');
    const queryRef = query(collectionRef, where("email", "==", user?.email))
    
    useEffect( () =>
        onSnapshot(queryRef, (snapshot) =>
            setCurrentUser(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ), []
    );

    function getName(data) {
        let names = [];
        data.map(each => {
            names.push(each.name);
        })
        return names;
    }

   var Buffer = require('buffer/').Buffer

    useEffect(() => {
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

    // Search Bar Stuff
    const clearIcon = document.querySelector(".clear-icon");
    const searchBar = document.querySelector(".search");
 
    /* searchBar.addEventListener("keyup", () => {
        if (searchBar.value && clearIcon.style.visibility != "visible") {
            clearIcon.style.visibility = "visible";
        } else if (!searchBar.value) {
            clearIcon.style.visibility = "hidden";
        }
    });

    clearIcon.addEventListener("click", () => {
        searchBar.value = "";
        clearIcon.style.visibility = "hidden";
    }) */

    return ( 
        <div className = 'dashboard-main'> 

            <div className = 'dashboard-user-info'> 
                <small>
                    Name: {getName(currentUser)} <br></br>
                    Email: {user?.email} <br></br>
                    UID: {user?.uid} <br></br>
                    Access Token: {token} <br></br> 
                </small>
            </div>

            <div className = 'dashboard-search-parent'>
                <h3> Search for Songs, Albums, or Artists </h3>

                <form class = "dash-search-bar">
                    <input type = "text" placeholder = "Search.." name = "search" size = "70"/>
                    <button type="submit"> <i class="fa fa-search"> Go </i> </button>
                </form>

            </div>
                
            <div className = 'signout-button-parent'>
                <Link to = "/home">
                    <button className = "signout-button" onClick = {() => signOut(getAuth())}> Sign out </button>
                </Link>
            </div>
            

        </div>
    )   
};

export default Dashboard;