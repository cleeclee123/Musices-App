import React from 'react';
import "./Navbar.css"
import {  Link } from "react-router-dom";

const Navbar= () =>{
  	return (
		<header class = "header">

			<div className = 'logo-home'>
            	<img className = "logo-home-image" src = "images/musices-logo-removebg-preview.png" alt =""/>  
            </div> 
    
			<div class = "mid"> 

				<ul class = "navbar">
					<li> <b> <Link to = "/home"> Home </Link> </b> </li>
					<li> <b> <Link to = "/about"> About </Link> </b> </li>
					<li> <b> <Link to = "/signup"> Sign Up </Link> </b> </li>
					<li> <b> <Link to = "/signin"> Sign In </Link> </b> </li>
					<li> <b> <Link to = "/dashboard"> Dashboard </Link> </b> </li>
					<li> <b> <Link to = "/user"> User </Link></b> </li>

					<li> 
						<a className = "navbar-link" href = "/signup">
							<button className = "navbar-button"> <b> Click Me! </b> </button>
						</a> 
					</li>

				</ul>
			</div>

    	</header>
  	);
}

export default Navbar;