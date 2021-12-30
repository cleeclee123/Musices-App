import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Player from "./pages/Player";

function App() {
	return (
    	<Router>
      		<Navbar />

      		<Switch>
        		<Route path = '/' exact component = {Home} />
        		<Route path = '/about' exact component = {About} />
				<Route path = '/player' exact component = {Player} />

      		</Switch>

    	</Router>
  	);
}
  
export default App;
