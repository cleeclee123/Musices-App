import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, useAuthState } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { Link, Route, NavLink, Redirect } from 'react-router-dom';
import SignUp from "./SignUp";
import './SignUpIn.css';


const CLIENT_ID = 'f5910041cd764887a9ddb43e035a8b8a';
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/dashboard";
const SPACE_DELMITER = "%20"; 
const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELMITER);
const AUTH_URL = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
console.log(AUTH_URL);

const SignIn = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const { email, password, error, /* loading */ } = data;
    const { isAuthenticated } = useAuthState();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            });
            setData({
                email: "",
                password: "",
                error: null,
                loading: false,
            });
        } catch (err) {
            setData({ ...data, error: err.message, loading: false });
        }
    };

    const redirectSpot = () => {
        setTimeout(() => {
            window.location = AUTH_URL;
        }, 500);
    };

    return (
        <div>       
            <div className="Form">
                <div className="Form__Aside"> 
                    <img className = "hat" src = "/images/musices-logo-removebg-preview.png" alt =""/>     
                </div>
                
                <div className="Form__Form">

                    <div className="PageSwitcher">
                        <NavLink to="/signin" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                        <NavLink exact to="/signup" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
                    </div> 

                    <div className="FormTitle">
                        <NavLink to="/signin" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or 
                        <NavLink exact to="/signup" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                    </div> 

                    <Route exact path="/signup" component = {SignUp}> </Route>
                    <Route path="/signin" component = {SignIn}> </Route>

                
        
                    <div className = "FormCenter">
                        <section> 
                            <form className = "FormFields" onSubmit = {handleSubmit}>
                                <fieldset>
                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                        <input 
                                            className = "FormField__Input" 
                                            type = "text"
                                            name = "email" 
                                            id = "email" 
                                            placeholder = "Enter your email" 
                                            value = {email}
                                            onChange = {handleChange}
                                        />
                                    </div>

                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "password"> Password </label>
                                        <input 
                                            className = "FormField__Input"
                                            type = "password" 
                                            name = "password"
                                            id = "password" 
                                            placeholder = "Enter your password" 
                                            value = {password}
                                            onChange = {handleChange} />
                                    </div>

                                    {error ? <p className = "error"> {error} </p> : null}

                                    <div className = "FormField">
                                         
                                        <button className = "FormField__Button mr-20" type = "submit" disabled = {!email + !password} onClick = {redirectSpot} > 
                                            {isAuthenticated ? <Redirect to = "/dashboard" /> : "Sign In"}
                                        </button>

                                        <Link to = "/signup" className = "FormField__Link"> Create an account </Link> 
                                    </div>
                                </fieldset>
                            </form>
                        </section>
                    </div>
                </div>    
            </div>    
        </div>
    );   
};

export default SignIn;