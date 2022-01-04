import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
    Route,
    NavLink
} from 'react-router-dom'
import SignIn from "./SignIn";
import Submit from "./SignUpTerms";
import './SignInUp.css';

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [agree, setAgree] = useState(false);

    const onChangeHandler = (fieldName, value) => {
        if (fieldName === "name") {
            setName(value);
        } else if (fieldName === "email") {
            setName(value);
        }
    }
    const checkboxHandler = () => {
        setAgree(!agree);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (name.trim() === "" || email.trim() === "") {
            alert("Require both fields");
        } else {
            alert(name + " " + email);
            setName("");
            setEmail("");
        }
    }
    const btnHandler = () => {
        alert("Submitted");
    }

    render() {
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

                            <form onSubmit = {this.contactOnSubmit.bind(this)} className = "FormFields">
                                <fieldset>

                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "name"> Full Name </label>
                                        <input type = "text" id = "name" className = "FormField__Input" placeholder = "Enter your full name" 
                                            name = "name" value={this.state.fields["name"]} onChange={this.handleChange.bind(this, "name")} />
                                    </div>

                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "password"> Password </label>
                                        <input type = "password" id = "password" className = "FormField__Input" placeholder = "Enter your password" 
                                            name = "password" value = {this.state.fields["password"]} onChange = {this.handleChange.bind(this, "password")} />
                                    </div>

                                    <div className = "FormField">
                                        <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                        <input type = "email" id = "email" className = "FormField__Input" placeholder = "Enter your email" 
                                            name = "email" value = {this.state.fields["email"]} onChange = {this.handleChange.bind(this, "email")} />
                                    </div>
                                    
                                    <div className = "FormField">
                                        <input className = "FormField__Checkbox" type = "checkbox" id = "agree" onChange={this.handleCheckbox} /> 
                                        <label className = "FormField__CheckboxLabel" htmlfor = "agree"> 
                                            I agree all statements in <a href = "/about" className = "FormField__TermsLink"> terms of service </a> 
                                        </label>
                                    </div>

                                    <div className = "FormField">
                                        <button className = "FormField__Button mr-20" /* disabled={!this.handleCheckbox} */ onClick={this.checkboxNoti}> Sign Up </button>
                                        <Link to = "/spotify">
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
}
