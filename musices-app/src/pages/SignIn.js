import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";
import { Link, Route, NavLink, } from 'react-router-dom';
import SignUp from "./SignUp";
import './SignUpIn.css';

const SignIn = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });
    // const history = useHistory()

    const { email, password, error, loading } = data;

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

                                    <button className = "FormField__Button mr-20"  type = "submit" disabled = {loading}> 
                                        {loading ? "Logging in ..." : "Sign In"}                                    
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