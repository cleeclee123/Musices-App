import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { useState, useEffect, useContext, createContext } from 'react';
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCDzHh-HS6OLIvb-_XO5ptQ7dKKgHdZgGY",
	authDomain: "musices-app.firebaseapp.com",
	projectId: "musices-app",
	storageBucket: "musices-app.appspot.com",
	messagingSenderId: "984749932392",
	appId: "1:984749932392:web:c50295d0d36e19a2b6a0dd",
	measurementId: "G-7VCY6270PT"
};

export const AuthContext = createContext();

export const AuthContextProvider = props => {
	const [user, setUser] = useState()
	const [error, setError] = useState()
  
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), setUser, setError)
		return () => unsubscribe()
	}, [])

	return <AuthContext.Provider value={{ user, error }} {...props} />
}

export const useAuthState = () => {
	const authenticate = useContext(AuthContext)
	return { ...authenticate, isAuthenticated: authenticate.user != null }
}


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage };
