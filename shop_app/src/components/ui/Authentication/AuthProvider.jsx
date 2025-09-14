import React, {useState, useEffect, createContext, useContext} from "react";
import { jwtDecode } from "jwt-decode";

// Create authentication context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authenticate, setAuthenticate] = useState({
        token: localStorage.getItem("auth_token") || null,
        user: null,
        isAuth: false,
    });

    useEffect(() => {
        const token = localStorage.getItem("auth_token");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setAuthenticate({
                        token,
                        user: decoded,
                        isAuth: true,
                    });
                } else {
                    setAuthenticate({ token: null, user: null, isAuth: false });
                }
            } catch {
                setAuthenticate({ token: null, user: null, isAuth: false });
            }
        }
    }, []); // Runs only once on mount


    return (
        <AuthContext.Provider value={{ authenticate, setAuthenticate }}>
            {children}
        </AuthContext.Provider>
    );
};