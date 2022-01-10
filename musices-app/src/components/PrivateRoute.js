import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuthContext } from "../context/auth";

const PrivateRoute = ({ children, ...rest }) => {
	let auth = useAuthContext();
  
	return (
    	<Route
      		{...rest}
      		render={({ location }) =>
        		auth.user ? (
          			children
        		) : (
          			<Redirect
            			to = {{
              				pathname: '/signin',
              				state: { from: location },
            			}}
          			/>
        		)
      		}
    	/>
  	);
};

export default PrivateRoute;