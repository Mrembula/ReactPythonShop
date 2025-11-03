import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import api from "../../../api.js";
import {handleLogout, setLocalStorageData, setUserData } from "../../../cartUtils.js";
// , handleAddToCart, setToken, token, Authorization
import { useAuth } from "../Authentication/AuthProvider.jsx";
import {useCheckItems} from "../CounterPages/ItemInCart.jsx";
import {toast} from "react-toastify";

// --- Local Storage Helpers ---
const getAnonymousCartCode = () => localStorage.getItem('cart_code');

const setCartCode = (code) => {
    localStorage.setItem('cart_code', code);
};

const LoginPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { authenticate, setAuthenticate } = useAuth();
    const { setInCartStatus } = useCheckItems();


    // Took me 3 weeks to debug using POST(JWT re-directs back to login page as user tries to login) => This worked
    // JWT isn't working anymore, it's removed. Can't authenticate user
    useEffect(() => {
        console.log("Login page mounted"); // Debugging log
        const token = localStorage.getItem("auth_token");

        if(!token) {
            console.log("No token found!, Skipping API call");
            return;
        }
        // Create a new token
        // Forgot the reason to this function. Why remove token
        api.post('/remove_token/', {},{
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('auth_token')}`,
                "Content-Type": "application/json",
            }
        }).then(() => {
            handleLogout();
            setInCartStatus({});
        }).catch(error => console.error("Error removing token:", error))
    }, []); // Re-run only when the route changes


    useEffect(() => {
        if (!authenticate.isAuth) {
            setTimeout(() => {  // Short delay to allow state to update properly
                navigate("/login");
            }, 300);
        }
    }, [authenticate.isAuth]);


    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate();

    const handleChange = (event) => {

        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        })
    }


    const handleLogin = async (e) => {
        e.preventDefault();

        // 1. Get the current anonymous cart code
        const anonymousCartCode = getAnonymousCartCode();
        try {
            // 2. Send request to the custom /login/ view
            const response = await api.post('login/', {
                email: loginData.email,
                password: loginData.password,
                cart_code: anonymousCartCode || null, // Send code, or null if none exists
            });

            // 3. Process the successful response
            const data = response.data;
            // Save tokens and user data
            setUserData(data.user);

            // Save the final cart code (the user's permanent cart ID)
            if (data.cart_code) {
                console.log("Setting new cart code:", data.cart_code);
                setCartCode(data.cart_code);
                localStorage.setItem("access", data.token['access']);
                localStorage.setItem("refresh", data.token['refresh']);
                setLocalStorageData(data, setAuthenticate)
                authenticate.isAuth = true;
            }
            // Navigate to the homepage or profile page
            navigate('/');

        } catch (error) {
            // Handle login errors (e.g., 401 Invalid credentials)
            toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.'); //Not working
            console.error('Login failed:', error.response?.data || error.message);
        }
    };

    return (
        <div style={{ backgroundColor: 'white', opacity: 0.8, width: '100vw', minHeight: '100vh', display: 'flex' }}>
            <div className="d-flex justify-content-center min-vw-100">
                <div className="container" style={{ maxWidth: '700px' }}>
                    <div className="m-5 p-3 bg-light border rounded-4 shadow-lg">
                        <h2 className="mt-6 text-center text-3xl frontextrabold text-gray-900">
                            Login
                        </h2>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    style={{border: 'none', borderBottom: '2px solid #ced4da', borderRadius: '0'}}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    className="form-control"
                                    required
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    style={{border: 'none', borderBottom: '2px solid #ced4da', borderRadius: '0'}}
                                />
                                <span className="text-gray-500"
                                      onClick={togglePasswordVisibility}
                                >
                                            {isPasswordVisible ? '👁️' : '🕶️'}
                                        </span>
                            </div>
                            <div className="mb-3">
                                <p>Forgot Password</p>
                            </div>
                            <div className="mb-3 d-flex justify-content-between">
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                    Submit
                                </button>
                                <Link to="/signup">
                                    <button type="button"
                                            className="w-full py-2 px-4 border rounded-md bg-white text-gray-500 hover:bg-gray-50">
                                        <FaUser className="h-5 w-5"/>
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;