import React, { useCallback, useContext } from 'react';
import { Link, Route, NavLink } from 'react-router-dom';
import { withRouter, Redirect } from 'react-router-dom';
import SignUp from "./SignUp";
import './SignInUp.css';
import app from '../../firebase/config';


const SignIn = () => {
    
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
                        <form /* onSubmit = {handleLogin} */ className = "FormFields" >
                            <fieldset>
                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                    <input type = "email" id = "email" className = "FormField__Input" placeholder = "Enter your email" 
                                        name = "email" /* value = {} onChange = {} */ />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "password"> Password </label>
                                    <input type = "password" id = "password" className = "FormField__Input" placeholder = "Enter your password" name = "password" 
                                        /* value = {} onChange = {} */ />
                                </div>

                                <div className = "FormField">
                                    <Link to = "/spotify">
                                        <button type = "submit" className = "FormField__Button mr-20" > Sign In </button> 
                                    </Link>
                                    <Link to = "/signup" className = "FormField__Link"> Create an account </Link>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>    
            </div>    
        </div>
    );  
};
export default SignIn;