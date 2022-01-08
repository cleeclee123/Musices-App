import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from './pages/Dashboard';
import AuthProvider from "./context/auth";
import { AuthContextProvider, useAuthState } from './firebase/config'

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
		  		!isAuthenticated ? <C {...routeProps} /> : <Redirect to = "/dashboard" />
			}
	  	/>
	)
  }

function App() {
	return (
		<AuthContextProvider> 
		<AuthProvider>
			<Router>
				<Navbar />
				<Switch>
					<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
					<Route path = '/home' exact component = {Home} />
					<Route path = '/about' exact component = {About} />
					<UnauthenticatedRoute exact path = "/signup" component = {SignUp} />
        			<UnauthenticatedRoute exact path = "/signin" component = {SignIn} />
					<AuthenticatedRoute exact path = "/dashboard" component = {Dashboard} />
				</Switch>
			</Router> 
		</AuthProvider>
		</AuthContextProvider>
	);

}
  
export default App;
