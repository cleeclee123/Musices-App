import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from './pages/Dashboard';
import AuthProvider from "./context/auth";
// import { useAuthState } from 'react-firebase-hooks/auth';



function App() {
	
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
					<Route path = "/dashboard" component = {Dashboard} />
					{/* <Route path = '/dashboard' 
						render = {() => ( this.state.isLoggedIn ? <Dashboard /> : <Redirect to = '/signin' /> )} 
					/> */}
				</Switch>
			</Router> 
		</AuthProvider>
	);

}
  
export default App;
