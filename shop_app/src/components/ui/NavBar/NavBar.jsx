import { TwitterX, Facebook, Person, ThreeDotsVertical, ThreeDots, Basket } from 'react-bootstrap-icons';
import { AuthContext } from "../Authentication/AuthProvider.jsx";
import { useCountItemsContext } from "../CounterPages/AddCountBasket.jsx";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';



const NavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [showToolTip, setShowToolTip] = useState(false);
    const { authenticate } = useContext(AuthContext);
    const handleMouseEnter = () => setShowToolTip(true);
    const handleMouseLeave = () => setShowToolTip(false);
    const [userLogin, setUserLogin] = useState('');
    const { cartItemCount } = useCountItemsContext()
    const menu = ['Home', 'Shop', 'About','Contact', userLogin];
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Authenticate", authenticate.user);
        if(authenticate.user !== null) {
           setUserLogin("Logout");
        }
        else {
            setUserLogin("Login");
        }
    }, [authenticate]);

    const navigateToStartMenu = () => {
        navigate('/');
    }

    const signUpHandle = () => {
        if (!authenticate.username) {
            navigate('/signup');
        }
        else {
            navigate('/profile');
        }
    }


    const handleMenuClick = (item, index) => {
        setActiveIndex(index);

        if(item === 'Home') {
            navigateToStartMenu();
        }
        else if(item === "Logout" || item === "Login") {
            navigate("/login");
        }
    }

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed)
    }
    return (
        <>
            <nav>
                <div className="navbar justify-content-between">
                    <div className="navbar__website-logo">
                        <a href="#" className="navbar-brand text-white">SHOP</a>
                    </div>
                    <div className="main--icon">
                        <div className="navbar__content">
                            <ul className="navbar__nav">
                                <li className="nav-item">
                                    {menu.map((item, index) => (
                                        <a key={index} className={`nav-link text-white ${activeIndex === index ? 'active' : ''}`}
                                           href="#"
                                           onClick={() => {
                                               handleMenuClick(item, index);
                                           }
                                        }
                                        >{item}</a>
                                    ))}
                                </li>
                            </ul>
                        </div>
                        <div className="navbar__icon">
                            <div className="nav-icon navbar__icon--x">
                                <TwitterX/>
                            </div>
                            <div className="nav-icon navbar__icon--facbook nav-icon"
                            >
                                <Facebook/>
                            </div>
                            <div className="nav-icon navbar__icon--user nav-icon"
                                 onMouseEnter={handleMouseEnter}
                                 onMouseLeave={handleMouseLeave}
                                 onClick={signUpHandle}
                            >
                                <Person/>
                                {showToolTip && (
                                    <div className="tooltip-container">
                                        <div className="tooltip">
                                            { authenticate.username ? authenticate.username : "Sign Up" }
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="nav-icon navbar__icon--shop-cart">
                                <div className="position-relative d-inline-block">
                                    <Link to="/cart">
                                    <Basket />

                                    {cartItemCount > 0 && (
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                </div>
                            </div>
                        </div>
                        <button onClick={toggleNavbar} className="navbar__toggle">
                            {isCollapsed ? <ThreeDots/> : <ThreeDotsVertical/>}
                        </button>
                    </div>
                </div>
                <div>
                <div  className={`mini__navbar ${isCollapsed ? "collapsed" : "open"}`}>
                        <ul>
                            <li className="p-2">
                                {menu.map((item, index) => (
                                    <a key={index} className="nav-link text-white" href="#">{item}</a>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;