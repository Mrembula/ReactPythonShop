import React, {useState, useEffect, createContext, useContext} from "react";
// Removed: import { jwtDecode } from "jwt-decode";

// Helper function to decode JWT payload using native JavaScript (fixes dependency error)
const decodeJwt = (token) => {
    if (!token) return null;
    try {
        // JWTs have three parts: Header.Payload.Signature
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;

        // Decode the base64 URL-safe string
        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));

        // Parse the JSON string into an object
        return JSON.parse(payloadJson);
    } catch (_) { // <--- Changed 'e' to '_' to silence ESLint
        // console.error("JWT Decode Error:", e); // Removed for clean console
        return null;
    }
};


// Create authentication context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [authenticate, setAuthenticate] = useState(() => {
        const initialToken = localStorage.getItem("auth_token");

        if (initialToken) {
            try {
                // Use native decoder
                const decoded = decodeJwt(initialToken);

                if (decoded && decoded.exp) {
                    // Check if token is still valid
                    if (Math.floor(decoded.exp * 1000) > Date.now()) {
                        return {
                            token: initialToken,
                            user: decoded,
                            isAuth: true,
                        };
                    } else {
                        localStorage.removeItem("auth_token");
                    }
                }
            } catch (_) { // <--- Changed 'e' to '_'
                // If decoding fails, token is corrupted.
                localStorage.removeItem("auth_token");
            }
        }
        // Default state if no valid token is found
        return { token: null, user: null, isAuth: false };
    });

    // Effect to handle initial load and token validity
    useEffect(() => {
        const token = localStorage.getItem("auth_token");

        if (token) {
            try {
                // Use native decoder
                const decoded = decodeJwt(token);

                if (decoded && decoded.exp) {
                    if (Math.floor(decoded.exp * 1000) > Date.now()) {
                        setAuthenticate({
                            token,
                            user: decoded,
                            isAuth: true,
                        });
                    } else {
                        // Token expired. Clear storage and state.
                        localStorage.removeItem("auth_token");
                        setAuthenticate({ token: null, user: null, isAuth: false });
                    }
                }
            } catch (_) { // <--- Changed 'e' to '_'
                // Token is corrupt. Clear storage and state.
                localStorage.removeItem("auth_token");
                setAuthenticate({ token: null, user: null, isAuth: false });
            }
        }
    }, []);


    return (
        <AuthContext.Provider value={{ authenticate, setAuthenticate }}>
            {children}
        </AuthContext.Provider>
    );
};

/*
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
 */