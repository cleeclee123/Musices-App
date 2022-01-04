import React, { useState } from 'react';
import useAuth from '../useAuth';

export default function Dashboard({ code }) {
	const accessToken = useAuth(code);
	const[search, setSearch] = useState("");

	const SearchBar = () => (
		<form action = "/" method = "get">
			<label htmlFor="header-search">
				<span className="visually-hidden">Search blog posts</span>
			</label>
			<input
				type="text"
				id="header-search"
				placeholder="Search blog posts"
				name="s" 
			/>
			<button type="submit">Search</button>
		</form>
	);

	return (
		<SearchBar/>
	)
}