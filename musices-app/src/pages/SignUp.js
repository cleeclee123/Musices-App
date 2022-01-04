import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Route,
    NavLink
} from 'react-router-dom'
import SignIn from "./SignIn";
import './SignInUp.css';

class SignUp extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            name: '',
            hasAgreed: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        console.log('The form was submitted with the following data:');
        console.log(this.state);
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
                            <form onSubmit = {this.handleSubmit} className = "FormFields">

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "name"> Full Name </label>
                                    <input type = "text" id = "name" className = "FormField__Input" placeholder = "Enter your full name" 
                                        name = "name" value={this.state.name} onChange={this.handleChange} />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "password"> Password </label>
                                    <input type = "password" id = "password" className = "FormField__Input" placeholder = "Enter your password" 
                                        name = "password" value = {this.state.password} onChange = {this.handleChange} />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__Label" htmlFor = "email"> E-Mail Address </label>
                                    <input type = "email" id = "email" className = "FormField__Input" placeholder = "Enter your email" 
                                        name = "email" value = {this.state.email} onChange = {this.handleChange} />
                                </div>

                                <div className = "FormField">
                                    <label className = "FormField__CheckboxLabel">
                                        <input className = "FormField__Checkbox" type = "checkbox" name = "hasAgreed" value = {this.state.hasAgreed} 
                                            onChange = {this.handleChange} /> I agree all statements in <a href = "/about" 
                                            className = "FormField__TermsLink"> terms of service </a>
                                    </label>
                                </div>

                                <div className = "FormField">
                                    <Link to = "/spotify">
                                        <button className = "FormField__Button mr-20"> Sign Up </button> 
                                    </Link>
                                    <Link to = "/signin" className = "FormField__Link"> I'm already member </Link>
                                </div>  
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUp;