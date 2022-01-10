import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import Loading from '../components/Loading';

export const AuthContext = createContext();
export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
};



