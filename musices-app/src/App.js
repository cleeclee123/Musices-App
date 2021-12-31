import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from "./pages/Home";
import About from "./pages/About";
import Musices from "./pages/Musices";

const code = new URLSearchParams(window.location.search).get("code")

function App() {
	return (
		<Router>
      		<Navbar />
      		<Switch>
        		<Route path = '/home' exact component = {Home} />
        		<Route path = '/about' exact component = {About} />
				<Route path = '/Musices' exact component = {Musices} />
				<Route path = '/signin' exact component = {Login} /> {code ? <Dashboard code = {code} /> : <Login />} 
      		</Switch>
    	</Router> 

	);

}
  
export default App;
