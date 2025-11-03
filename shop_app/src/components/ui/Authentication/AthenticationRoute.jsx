import React, { useEffect, useContext } from "react";
import api from "../../../api.js";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticationRoute = () => {
    const { authenticate } = useContext(AuthContext);

    const refreshAccessToken = async () => {
        const accessToken = sessionStorage.getItem("auth_token");

        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);

            // Check if token is about to expire (within the next minute)
            if (decodedToken.exp * 1000 - Date.now() < 60000) {
                try {
                    const response = await fetch(`${api}/token/refresh/`, {
                        method: "POST",
                        credentials: "include", // Ensures cookies are sent with the request
                        headers: { "Content-Type": "application/json" }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sessionStorage.setItem("auth_token", data.access);
                        console.log("Received new token:", data.access);
                        return data.access;
                    } else {
                        console.log("Session expired. Please log in.");
                        sessionStorage.removeItem("auth_token");
                        window.location.href = "/login";
                    }
                } catch (error) {
                    console.error("Token refresh error:", error);
                }
            }
        }
        return null;
    };

    // Check token expiration every minute, instead of blindly refreshing
    useEffect(() => {
        const interval = setInterval(refreshAccessToken, 60000); // Runs every minute
        return () => clearInterval(interval); // Cleanup to avoid multiple intervals
    }, []);

    // Authentication check for route access
    return authenticate.isAuth ? <Outlet /> : <Navigate to="/signup" />;
};

export default AuthenticationRoute;
