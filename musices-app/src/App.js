import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Musices from "./pages/Musices";


function App() {
	return (
    	<Router>
      		<Navbar />

      		<Switch>
        		<Route path = '/' exact component = {Home} />
        		<Route path = '/about' exact component = {About} />
				<Route path = '/Musices' exact component = {Musices} />

      		</Switch>

    	</Router>
  	);
}
  
export default App;
