import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Auth = () => {
    const [index, setIndex] = useState(false);
    const toggleIndex = () => {
        setIndex((prevState) => !prevState);
    };
    
    return (
        <div className="container">
            {!index ? <Signin /> : <Signup />}
            <p onClick = {toggleIndex}>
                {!index ? "New user? Click here " : "Already have an acount?"}
            </p>
        </div>
      );
    
    export default Auth;
};