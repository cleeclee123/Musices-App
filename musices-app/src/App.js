import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUpIn/SignUp";
import SignIn from "./pages/SignUpIn/SignIn";
import Spotify from "./pages/Spotify";
import Auth from "./pages/SignUpIn/Auth";
import { useUserContext } from "./firebase/Context";


function App() {
	const { user, loading, error } = useUserContext();
	return (
			<Router>
				<Navbar />
				<Switch>
					<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
					<Route path = '/home' exact component = {Home} />
					<Route path = '/about' exact component = {About} />
					<Route path = "/signup" component = {SignUp} />
					<Route path = "/signin" component = {SignIn} />
				</Switch>
				
				<div className="App">
					{error && <p className="error">{error}</p>}
					{loading ? <h2>Loading...</h2> : <> {user ? <Spotify /> : <Auth />} </>}
    			</div>

			</Router> 
		
	);

}
  
export default App;
