import React, {Component, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import {
    Route,
    NavLink
} from 'react-router-dom'
import SignIn from "./SignIn";
import Submit from "./SignUpTerms";
import './SignInUp.css';
import { FirebaseContext } from "../../src/firebase/Context";

const SignUp = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [agree, setAgree] = useState(false);

    const { firebase } = useContext(FirebaseContext);

    const onChangeHandler = (fieldName, value) => {
        if (fieldName === 'name') {
            setName(value);
        } else if (fieldName == 'password') {
            setPassword(value);
        } else if (fieldName === 'email') {
            setEmail(value);
        }
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (name.trim() === "" || password.trim() === "" || email.trim() === "") {
            alert("Require all fields");
        } else {
            alert(name + " " + email + " " + password);
            setName("");
            setEmail("");
        }
    }
    const checkboxHandler = () => {
        setAgree(!agree);
    }
    const btnHandler = () => {
        alert("Submitted");
    }

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

                        <form onSubmit = {(event) => {
                            onSubmitHandler(event);
                            firebase
                                .auth()
                                .createUserWithEmailAndPassword(email, password)
                                .then(() => alert("signed up"))
                                .catch((error) => alert(error.message));
                        }}>

                            <fieldset>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "name"> Full Name </label>
                                    <input type = "text" id = "name" className = "FormField__Input" placeholder = "Enter your full name" 
                                        name = "name" value = {name} onChange = {(event) => { onChangeHandler("name", event.target.value)}} />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "password"> Password </label>
                                    <input type = "password" id = "password" className = "FormField__Input" placeholder = "Enter your password" 
                                        name = "password" value = {password} onChange = {(event) => { onChangeHandler("password", event.target.value)}} />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                    <input type = "email" id = "email" className = "FormField__Input" placeholder = "Enter your email" 
                                        name = "email" value = {email} onChange = {(event) => { onChangeHandler("email", event.target.value)}} />
                                </div>
                                
                                <div className = "FormField">
                                    <input className = "FormField__Checkbox" type = "checkbox" id = "agree" onChange = {checkboxHandler} /> 
                                    <label className = "FormField__CheckboxLabel" htmlfor = "agree"> 
                                        I agree all statements in <a href = "/about" className = "FormField__TermsLink"> terms of service </a> 
                                    </label>
                                </div>

                                <div className = "FormField">
                                    <Link to = "/spotify">
                                        <button type = "submit" className = "FormField__Button mr-20" disabled = {!agree} /* onClick = {btnHandler} */ > Sign Up </button>
                                    </Link>
                                    <Link to = "/signin" className = "FormField__Link"> I'm already member </Link>
                                </div>
                                
                            </fieldset>    
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;

