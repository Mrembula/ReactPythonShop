import NavBar from '../../NavBar.jsx';
import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import api from "../../../../../api.js";

const UserProfileIcon = () => {
    const cartCode = localStorage.getItem("cart_code");
    const [cartItems, setCartItems] = useState({});
    console.log("Checkout")

    useEffect(() => {
        api.get(`cart_items/${cartCode}`)
        .then((response) => {
            console.log(response.data.cart_items.length);
            console.log(response.data.cart_items[0].product);
            setCartItems(response.data.cart_items);
        })
    }, [cartCode]);

    //  Define the structure of user data
    const mockUserProfile = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+123 456 7890',
        city: 'New York',
        country: 'USA',
        memberSince: 'January 2023',
    };


    return (
        <div className="bg-light py-5">
            <NavBar />
            <div className="container">
                <h1 className="display-4 fw-bold mb-4">Account Overview</h1>

                <div className="row g-4">
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <div className="d-flex align-items-center gap-4 mb-4">
                                    {/* Use a simple image tag for the avatar */}
                                    <img
                                        src="https://via.placeholder.com/150"
                                        alt="Profile"
                                        className="rounded-circle"  // Use Bootstrap's rounded-circle class
                                        style={{ height: '64px', width: '64px' }} //  Set fixed size
                                    />
                                    <div>
                                        <h2 className="h5">{mockUserProfile.fullName}</h2>
                                        <p className="text-muted">{mockUserProfile.email}</p>
                                    </div>
                                </div>
                                <Button variant="outline-primary" className="w-100">
                                    Edit Profile
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-md-8">
                        <Card>
                            <Card.Body>
                                <h2 className="h5 mb-4">Account Overview</h2>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <p className="text-muted small">Full Name:</p>
                                        <p className="fw-semibold">{mockUserProfile.fullName}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small">City:</p>
                                        <p className="fw-semibold">{mockUserProfile.city}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small">Email:</p>
                                        <p className="fw-semibold">{mockUserProfile.email}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small">Country:</p>
                                        <p className="fw-semibold">{mockUserProfile.country}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small">Phone:</p>
                                        <p className="fw-semibold">{mockUserProfile.phone}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small">Member Since:</p>
                                        <p className="fw-semibold">{mockUserProfile.memberSince}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                <Card className="mt-4">
                    <Card.Body>
                        <h2 className="h5 mb-4">Order History</h2>
                        <div className="space-y-4">
                            {cartItems.map((product) => (
                                <div key={product.id} className="p-3 border rounded bg-white">
                                    <div className="row g-3">
                                        <div className="col-md-3">
                                            <p className="text-muted small">Product Name:</p>
                                            <p className="fw-semibold">{product.name}</p>
                                        </div>
                                        <div className="col-md-2">
                                            <p className="text-muted small">Price:</p>
                                            <p className="fw-semibold">${product.price.toFixed(2)}</p>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default UserProfileIcon;
