import { useLocation } from "react-router-dom";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";
import CheckoutPageProducts from "./CheckoutProduct.jsx";
import CheckoutForm from "./CheckoutForm.jsx";
import CheckoutPaymentForm from "./CheckoutPaymentForm.jsx";

const CheckoutPage = () => {
    const location = useLocation();
    const cartItems = location.state?.cartItems || [];
    console.log("location.state:", location.state);
    console.log("Extracted cartItems:", location.state?.cartItems);


    return (
        <div className="container py-5 ">
            <h1 className="text-4xl font-semibold mb-5 text-center text-white
            ">CHECKOUT</h1>
            <div className="row">
               <CheckoutPageProducts cartItems={cartItems}/>
                <div className="col-lg-6" style={{backgroundColor: "black", opacity: 0.7}}>
                    <div className="card bg-transparent text-white">
                        <div className="card-header">
                            <h2 className="h4 mb-0">Billing Details</h2>
                        </div>
                        <div className="card-body">
                            <form className="form-group">
                                <CheckoutForm />
                                <div className="container p-4 bg-dark text-white">
                                    <h3>Select Payment Method</h3>
                                    <CheckoutPaymentForm />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    <i className="bi bi-bag"></i> Place Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="text-center mt-3">
                    <div className="form-group d-flex justify-content-between mt-4">
                        <Link to="/" className="btn btn-outline-secondary-custom text-white bg-dark p-4">
                            <i className="bi bi-arrow-left text-white me-2"></i>Home
                        </Link>

                        <Link to="/cart" className="btn btn-outline-secondary-custom text-white bg-dark p-4">
                            <i className="bi bi-arrow-90deg-left me-2 text-white"></i>Review Your Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
