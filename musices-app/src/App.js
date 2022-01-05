import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUpIn/SignUp";
import SignIn from "./pages/SignUpIn/SignIn";
import Spotify from "./pages/Spotify";
import { AuthProvider } from "./pages/SignUpIn/Auth";
import PrivateRoute from "./pages/PrivateRoute";


function App() {
	return (
		
			<Router>
				<Navbar />
				<Switch>
					<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
					<Route path = '/home' exact component = {Home} />
					<Route path = '/about' exact component = {About} />
					<Route path = "/signup" component = {SignUp} />
					<Route path = "/signin" component = {SignIn} />
					<PrivateRoute exact path = "/spotify" component = {Spotify} />
				</Switch>
			</Router> 
		
	);

}
  
export default App;
