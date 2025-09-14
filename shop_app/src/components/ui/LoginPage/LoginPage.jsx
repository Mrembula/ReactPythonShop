import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import api from "../../../api.js";
import {handleLogout, setLocalStorageData, handleAddToCart, setToken} from "../../../cartUtils.js";
import { useAuth } from "../Authentication/AuthProvider.jsx";
import {useCheckItems} from "../CounterPages/ItemInCart.jsx";

const LoginPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const location = useLocation();
    const { authenticate, setAuthenticate } = useAuth();
    const { setInCartStatus } = useCheckItems();

    // Took me 3 weeks to debug using POST(JWT re-directs back to login page as user tries to login)
    useEffect(() => {
        console.log("Login page mounted"); // Debugging log
        const token = localStorage.getItem("auth_token");

        if(!token) {
            console.log("No token found!, Skipping API call");
            return;
        }
        // Create a new token
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


    const handleLogin = async (event) => {
        event.preventDefault();

        // const response = await api.get(`/login?email=${encodeURIComponent(loginData.email)}&password=${encodeURIComponent(loginData.password)}`)
        const response = await api.post('/api/token', {
            username: loginData,
            password: loginData.password,
        })
        const data = response.data;
        console.log("User data response ", data);

        data.product_in_cart.forEach(product => {
            setInCartStatus(prevState => ({
                ...prevState,
                [product.id]: true
            }));
            handleAddToCart(product, setInCartStatus);
        })
        setToken(data.access_token );

        if (data.access_token && data.access_token !== "null") {
            localStorage.setItem("cart_code", data.cart_code);
            sessionStorage.setItem("auth_token", data.access_token);
            setLocalStorageData(data.user_data, setAuthenticate);
            authenticate.isAuth = true;
            navigate("/");
        }
    }

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