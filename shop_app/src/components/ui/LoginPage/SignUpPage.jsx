import React, { useState, useEffect } from 'react';
import shopImage from '../images/shopping-wallpaper_3.jpg';
import { auth, provider, signInWithPopup } from "./firebase.js";
import { handleLogout, setLocalStorageData } from "../../../cartUtils.js";
import { useAuth } from "../Authentication/AuthProvider.jsx";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaGoogle } from 'react-icons/fa';
import api from "../../../api.js";
import { Link } from "react-router-dom";
import error from "../Error/Error.jsx";

const SignUpPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/signup") {
            handleLogout();
            console.log("Logout handle ran because user navigated to login page");
        }
    }, [location.pathname]);


    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { setAuthenticate } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };


    // Google authentication logic
    const GoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            console.log("Token Before Sending:", idToken);

            const response = await api.post("/api/auth",  {}, {
                headers: {
                    "Authorization": `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.data;
            setLocalStorageData(data, setAuthenticate);
             if (data.access_token) {
                 navigate("/");
             }

        } catch (error) {
            console.error("Login Error:", error);
        }
    };


    // Form submission logic
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form reload

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Password not match");
        }

        try {
            const response = await api.post("/signup/", {
                username: formData.fullName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            });
            setLocalStorageData(response.data, setAuthenticate);
            if (response.data.access_token) {
                navigate("/");
            }
        } catch (error) {
            toast.error("Signup Error:", error);
        }
        if (error.response && error.response.data) {
            toast.error("Signup failed. Please try again later");
        }

    };

    return (
        <div style={{ backgroundColor: 'white', opacity: 0.8, minHeight: '100vh', display: 'flex' }}>
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="max-w-md w-full space-y-8 mx-auto">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div className="form-group mb-4">
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    className="form-control w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className="form-control w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="form-control w-full px-3 py-2 border rounded"
                                />
                            </div>

                            <div className="form-group mb-4">
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="form-control w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full py-2 px-4 border rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                                Submit
                            </button>
                        </div>

                        {/* Google login */}
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Link to="/login">
                                <button type="button" className="w-full py-2 px-4 border rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                    <FaUser className="h-5 w-5" />
                                </button>
                            </Link>
                            <button type="button" onClick={GoogleAuth} className="w-full py-2 px-4 border rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                <FaGoogle className="h-5 w-5" />
                            </button>
                        </div>
                        <ToastContainer />
                    </form>
                </div>
            </div>

            <div style={{ backgroundColor: "black", opacity: 1, color: "white", display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <img src={shopImage} alt="shopping-image" className="rounded"/>
            </div>
        </div>
    );
};

export default SignUpPage;

