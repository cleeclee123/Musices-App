import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Spotitfy from "./pages/Spotify";

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
				<Route path = "/spotify" component = {Spotitfy} />
      		</Switch>
    	</Router> 

	);

}
  
export default App;
