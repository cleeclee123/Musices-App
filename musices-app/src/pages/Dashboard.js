import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import SpotifyPlayer from 'react-spotify-web-playback';
import TrackSearchResult from './components/TrackSearchResult';
import WebPlayer from './components/WebPlayer'
import './Dashboard.css';


// cheeky token refresh 
window.setTimeout(function () {
    window.location.reload();
}, 3300000);

const spotifyApi = new SpotifyWebApi({
    clientId: "f5910041cd764887a9ddb43e035a8b8a",  
})

const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
        console.log(currentValue);
        const [key, value] = currentValue.split("=");
        accumulater[key] = value;
        return accumulater;
    }, {});
  
    return paramsSplitUp;
};


const Dashboard = (props) => {
    const { user } = useAuthState();
    const [currentUser, setCurrentUser] = useState([]);
    const [token, setToken] = useState('');

    /* const collectionRef = collection(db, 'users');
    const queryRef = query(collectionRef, where("email", "==", user?.email))
    
    useEffect( () =>
        onSnapshot(queryRef, (snapshot) =>
            setCurrentUser(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ), []
    ); */

    function getName(data) {
        let names = [];
        data.map(each => {
            names.push(each.name);
        })
        return names;
    }

    useEffect(() => {
        if (window.location.hash) {
            const { access_token, expires_in, token_type } =
                getReturnedParamsFromSpotifyAuth(window.location.hash);
    
            localStorage.clear();
    
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("tokenType", token_type);
            localStorage.setItem("expiresIn", expires_in);
        }
    });

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
    }, []);
    
    // Search Bar Stuff
    const [search, setSearch] = useState("");
    const [SearchResults, setSearchResults] = useState([]);
    const [isMounted, setIsMounted] = useState(true);
    const [formData, setFormData] = useState({ userQuery: "" });

    useEffect(() => {
        if (!token) {
            return
        }
        spotifyApi.setAccessToken(token)
    }, [token])

    useEffect(() => {
        if (!token) {
            return
        }
        if (!search) {
            return setSearchResults([]);
        }

        let unmounted = false;

        spotifyApi.searchTracks(search).then(res => {
            setSearchResults(res.body.tracks.items.map(track => {
                if (unmounted) return [];
                setIsMounted(false);

                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) {
                        return image
                    }
                    return smallest
                },  track.album.images[0])

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })

        return () => { 
            unmounted = true;
        }
    }, [search, token])


    const handleClear = () => {
        setFormData({ searchTerm: "" });
    };

    const clearIcon = document.querySelector(".dash-clear-icon");
    const searchBar = document.querySelector(".dash-search-bar");

    window.onload = function() {
        searchBar.addEventListener("keyup", () => {
            if (searchBar.value && clearIcon.style.visibility !== "visible") {
                clearIcon.style.visibility = "visible";
            } else if (!searchBar.value) {
                clearIcon.style.visibility = "hidden";
            }
        });

        clearIcon.addEventListener("click", () => {
            searchBar.value = "";
            clearIcon.style.visibility = "hidden";
        })
    }

    // Playback
    const [playingTrack, setPlayingTrack] = useState();

    function chooseTrack(track) {
        setPlayingTrack(track)
        // setSearch("")
    }
    
    return ( 
        <div className = 'dashboard-main'> 
            <div className = 'dash-currentuser'> 
                <h1> Hi User {/* {getName(currentUser)} */} </h1>
            </div>

            <div className = 'dashboard-search-parent'>
                <h3> Search for Songs, Albums, or Artists </h3>

                <form class = "dash-search-bar-main" >
                    <input 
                        className = "dash-search-bar"
                        name = "searchTerm" 
                        type = "search"
                        value = {search}
                        onChange = {event => setSearch(event.target.value)}
                        placeholder = "Search" 
                        autoComplete = 'off'
                        size = "200" 
                    />
                    {/* <button type = "submit"> <i> Go </i> </button> */}
                    <img 
                        className = "dash-clear-icon" 
                        onClick = {handleClear} 
                        src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxLjk3NiA1MS45NzYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxLjk3NiA1MS45NzY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPGc+Cgk8cGF0aCBkPSJNNDQuMzczLDcuNjAzYy0xMC4xMzctMTAuMTM3LTI2LjYzMi0xMC4xMzgtMzYuNzcsMGMtMTAuMTM4LDEwLjEzOC0xMC4xMzcsMjYuNjMyLDAsMzYuNzdzMjYuNjMyLDEwLjEzOCwzNi43NywwICAgQzU0LjUxLDM0LjIzNSw1NC41MSwxNy43NCw0NC4zNzMsNy42MDN6IE0zNi4yNDEsMzYuMjQxYy0wLjc4MSwwLjc4MS0yLjA0NywwLjc4MS0yLjgyOCwwbC03LjQyNS03LjQyNWwtNy43NzgsNy43NzggICBjLTAuNzgxLDAuNzgxLTIuMDQ3LDAuNzgxLTIuODI4LDBjLTAuNzgxLTAuNzgxLTAuNzgxLTIuMDQ3LDAtMi44MjhsNy43NzgtNy43NzhsLTcuNDI1LTcuNDI1Yy0wLjc4MS0wLjc4MS0wLjc4MS0yLjA0OCwwLTIuODI4ICAgYzAuNzgxLTAuNzgxLDIuMDQ3LTAuNzgxLDIuODI4LDBsNy40MjUsNy40MjVsNy4wNzEtNy4wNzFjMC43ODEtMC43ODEsMi4wNDctMC43ODEsMi44MjgsMGMwLjc4MSwwLjc4MSwwLjc4MSwyLjA0NywwLDIuODI4ICAgbC03LjA3MSw3LjA3MWw3LjQyNSw3LjQyNUMzNy4wMjIsMzQuMTk0LDM3LjAyMiwzNS40NiwzNi4yNDEsMzYuMjQxeiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" 
                    />
                </form>
            </div>

           <div className = 'dashboard-search-results'> 
                {SearchResults.map(track => (
                    <div className = 'dash-result-wrapper'> 
                    {/* <div className = 'dash-result-image-main'> <img className = 'dash-result-image' src = {track.albumUrl} /> </div>
                        <div className = 'dash-result-info' onClick = {chooseTrack} >
                            <div className = 'dash-result-title'> {track.title}  </div>
                            <div className = 'dash-result-artist'> <i> {track.artist} </i> </div>
                            <div className = 'dash-result-uri'> <i> {track.uri} </i> </div>
                        </div> */}

                        <TrackSearchResult 
                            track = {track}
                            chooseTrack = {chooseTrack}
                            key = {track.uri}
                        />
                    </div>
                ))}
           </div>

           <div className = 'dashboard-spotify-player'>
                <WebPlayer
                    accessToken = {token}
                    trackUri = {playingTrack?.uri}
                />
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