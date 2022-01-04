import React, { useState } from 'react';
import './SignInUp.css';

const TermsOfService = () => {
    const [agree, setAgree] = useState(false);

    const checkboxHandler = () => {
        setAgree(!agree);
    }

    const btnHandler = () => {
        alert('The buttion is clickable!');
    };

    return (
        <div className="App">
            <div className="container">

                <div className = "FormField">
                    <input className = "FormField__Checkbox" type = "checkbox" id = "agree" onChange={checkboxHandler} /> 
                    <label className = "FormField__CheckboxLabel" htmlfor = "agree"> 
                        I agree all statements in <a href = "/about" className = "FormField__TermsLink"> terms of service </a> 
                    </label>
                </div>

                <button disabled={!agree} className="btn" onClick={btnHandler}>
                    Continue
                </button>

            </div>
        </div>
    );
};

export default {TermsOfService};