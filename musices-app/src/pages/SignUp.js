import React, { useState } from "react";
import { Route, Link, NavLink, Redirect } from 'react-router-dom'
import SignIn from "./SignIn";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, useAuthState } from "../firebase/config";
import { Timestamp, addDoc, collection } from "firebase/firestore";
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


const SignUp = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const [agree, setAgree] = useState(false);
    const checkboxHandler = () => {
        setAgree(!agree);
    }
        
    const { name, email, password, error, /* loading */ } = data;
    const { isAuthenticated } = useAuthState();
    
                
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const collectionRef = collection(db, "users");
        const payload = { name, email, password, createdAt: Timestamp.fromDate(new Date()) };
        const docRef = await addDoc(collectionRef, payload);

        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            setData({
                name: "",
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
        }, 1000);
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
                        <NavLink to= "/signin" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or 
                        <NavLink exact to="/signup" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
                    </div> 

                        <Route exact path="/signup" component = {SignUp}> </Route>
                        <Route path="/signin" component = {SignIn}> </Route>
                

                    <div className = "FormCenter">
                        <section>
                            <form className = "FormFields" onSubmit = {handleSubmit}>
                                <fieldset>
                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "name"> Full Name </label>
                                        <input 
                                            className = "FormField__Input"
                                            type = "text"   
                                            name = "name"
                                            id = "name"
                                            placeholder = "Enter your full name" 
                                            value = {name}
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
                                            onChange = {handleChange} 
                                        />
                                    </div>

                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                        <input 
                                            className = "FormField__Input" 
                                            type = "email" 
                                            name = "email"
                                            id = "email" 
                                            placeholder = "Enter your email" 
                                            value = {email}
                                            onChange = {handleChange}
                                        />
                                    </div>
                                    
                                    <div className = "FormField">
                                        <input 
                                            className = "FormField__Checkbox" 
                                            type = "checkbox" 
                                            name = "agree"
                                            id = "agree"  
                                            onChange = {checkboxHandler}    
                                        /> 
                                        <label className = "FormField__CheckboxLabel" htmlfor = "agree"> 
                                            I agree all statements in <a href = "/about" className = "FormField__TermsLink"> terms of service </a> 
                                        </label>
                                    </div>

                                    {error ? <p className = "error"> {error} </p> : null}

                                    <div className = "FormField">

                                        
                                        <button className = "FormField__Button mr-20" type = "submit" disabled = {!agree + !name + !password + !email} onClick = {redirectSpot} > 
                                            {isAuthenticated ? <Redirect to = "/dashboard" /> : "Sign Up"}
                                        </button>
                                
                                        
                                        <Link to = "/signin" className = "FormField__Link"> I'm already member </Link>
                                    </div>
                                    
                                </fieldset>    
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    ); 
}

export default SignUp;

