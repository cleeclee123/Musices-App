import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from './components/Login';
import Home from "./pages/Home";
import About from "./pages/About";
import Musices from "./pages/Musices";

const code = new URLSearchParams(window.location.search).get("code")

function App() {
	return (
		<Router>
      		<Navbar />
      		<Switch>
				<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
      			<Route path = '/home' exact component = {Home} />
        		<Route path = '/about' exact component = {About} />
				<Route path = '/Musices' exact component = {Musices} />
				<Route path = '/signin' exact component = {Login} /> 
      		</Switch>
    	</Router> 

	);

}
  
export default App;
