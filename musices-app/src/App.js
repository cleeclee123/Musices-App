import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import Error from './pages/Error';
import Test from './pages/test';
import { AuthProvider } from "./context/auth";
import { AuthContextProvider, auth /* useAuthState */ } from './firebase/config';
import { onAuthStateChanged } from "firebase/auth";

/* 
const AuthenticatedRoute = ({ component: C, ...props }) => {
	const { isAuthenticated } = useAuthState()
	console.log(`AuthenticatedRoute: ${isAuthenticated}`)

	return (
		<Route
			{...props}
			render={routeProps =>
				isAuthenticated ? <C {...routeProps} /> : <Redirect to = "/signin" />
			}
	  	/>
	)
}
  
const UnauthenticatedRoute = ({ component: C, ...props }) => {
	const { isAuthenticated } = useAuthState()
	console.log(`UnauthenticatedRoute: ${isAuthenticated}`)

	return (
		<Route
			{...props}
			render={routeProps =>
		  		!isAuthenticated ? <C {...routeProps} /> : <Redirect to = "/dashboard/" />
			}
	  	/>
	)
}
*/

function App() {
    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setIsLoading(false);
        });
    }, []);
	
	if (isloading) { return <h1> LOADING </h1> }

	
	return ( 
		<AuthContextProvider> 
		<AuthProvider>
			<Router>
				<Navbar />
				<Switch>
					<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
					<Route path = '/home' exact component = {Home} />
					<Route path = '/about' exact component = {About} />
					<Route exact path = "/signup" component = {SignUp} />
        			<Route exact path = "/signin" component = {SignIn} />
					<Route path = "/dashboard"> <Dashboard/> </Route>
					{/* <PrivateRoute path = "/dashboard"> <Dashboard/> </PrivateRoute> */}
					<PrivateRoute path = "/user"> <User/> </PrivateRoute>
					<Route exact path = "/404" component = {Error} />
					<Route exact path = "/test" component = {Test} />
				</Switch>
			</Router> 
		</AuthProvider>
		</AuthContextProvider>
	);

}
  
export default App;
