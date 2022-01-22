import React, { useState, useEffect, createContext } from 'react';
import { getAuth, signOut } from 'firebase/auth'
import { useAuthState, db } from '../firebase/config'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from 'react-router-dom';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import TrackSearchResult from './components/TrackSearchResult';
import WebPlayer from './components/WebPlayer'
import './Dashboard.css';


// cheeky token refresh (idk if it actually works) (just refreshes the page lol)
window.setTimeout(function () {
    window.location.reload();
}, 3300000);

const spotifyApi = new SpotifyWebApi({
    clientId: "f5910041cd764887a9ddb43e035a8b8a",  
})

// Access Token getter from URL after validation/agreement of request after sign in/sign up
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
    const { user } = useAuthState(); // current user call from firebase auth
    // set state for dashboard variables
    const [currentUser, setCurrentUser] = useState([]); // store current user 
    const [token, setToken] = useState(''); // stores generated token from spotify api
    const [search, setSearch] = useState(""); // current user search/query
    const [SearchResults, setSearchResults] = useState([]); // artist, title, album image from spotify api given search
    const [isMounted, setIsMounted] = useState(true); // for useEffect Clean up function
    const [formData, setFormData] = useState({ userQuery: "" }); // for clearing search bar
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");
    const [news, setNews] = useState("");
    const [currentArtist, setCurrentArtist] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");

    // Firebase call to get current user's name
    // useAuthState from firebase Authentication only stores identifier (email), dates, and uid. 
    // Sign Up collects user's name, email, password, and date created in firestore database. 
    
    // cross reference's useAuthState current user's email with the email in firestore, if match
    // grabs user's name from firestore and displays on dashboard (greeting)

    /* 
    const collectionRef = collection(db, 'users');
    const queryRef = query(collectionRef, where("email", "==", user?.email))
    
    useEffect( () =>
        onSnapshot(queryRef, (snapshot) =>
            setCurrentUser(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        ), []
    ); 
    */

    function getName(data) {
        let names = [];
        data.map(each => {
            names.push(each.name);
        })
        return names;
    }

    // Access token, token type, and expires set in local storage
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

    // Retrieves access token from local storage
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            setToken(localStorage.getItem("accessToken"));
        }
    }, []);
    
    // hook that sets current access token with the spotify api
    useEffect(() => {
        if (!token) {
            return
        }
        spotifyApi.setAccessToken(token)
    }, [token])

    // hook for getting the artist, song title, and uri from spotify api given search
    useEffect(() => {
        if (!token) {
            return
        }
        if (!search) {
            return setSearchResults([]);
        }

        // useEffect clean up function
        let unmounted = false;

        // uses 'search' as our request to spotify-web-api-node 
        spotifyApi.searchTracks(search).then(res => {
            // maps everything to track as entry variable (track.title, track.artist, track.etc)
            setSearchResults(res.body.tracks.items.map(track => {

                // clean up function/handles bad searchs (returns emptyt array)
                if (unmounted) return [];
                setIsMounted(false);

                // Gets the smallest available image from spotify
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) {
                        return image
                    }
                    return smallest
                },  track.album.images[0])

                // Sets the data we want from the spotify api
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })

        // clean up function return
        return () => { 
            unmounted = true;
        }
    }, [search, token])

    // Clear function ('x' on the end of the search bar)
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

    // Spotify Web Playback SDK 
    // Current Track handler, keeps track of what track is clicked
    // After click, clears search bar, clears lyrics 
    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch("");
        setCurrentArtist("");
        setCurrentTitle("");
        setLyrics("");
    }
    
    // hook call to the server (api) to access the lyrics
    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            }  
        }).then(res => {
            setCurrentTitle(playingTrack.title)
            setCurrentArtist(playingTrack.artist)
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    
    return ( 
        <div className = 'dashboard-main'> 
            <div className = 'dash-currentuser'> 
                <h1> Hi {user?.email} </h1>
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
                {SearchResults.length === 0 && (
                    <div className = 'dash-result-lyrics'>
                        <div className = "dash-result-lyrics-artist">
                            {currentArtist}
                        </div> 
                        <div className = 'dash-result-lyrics-title'>
                            {currentTitle}
                        </div>
                        {lyrics}
                    </div>
                )}
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