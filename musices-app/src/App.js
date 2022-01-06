import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from './pages/Dashboard';
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Switch>
					<Route exact path = '/'> <Redirect to = '/home' /> </Route> 
					<Route path = '/home' exact component = {Home} />
					<Route path = '/about' exact component = {About} />
					<Route path = "/signup" component = {SignUp} />
					<Route path = "/signin" component = {SignIn} />
					<PrivateRoute exact path = "/dashboard" component = {Dashboard} />
				</Switch>
			</Router> 
		</AuthProvider>
	);

}
  
export default App;
