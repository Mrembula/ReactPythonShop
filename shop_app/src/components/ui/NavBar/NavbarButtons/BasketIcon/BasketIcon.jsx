import React, { useEffect, useState } from "react";
import styles from "./BasketIcon.module.css";
import Navbar from "../../NavBar.jsx";
import { useCheckItems } from "../../../CounterPages/ItemInCart.jsx";
import { useAuth } from "../../../Authentication/AuthProvider.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import api from "../../../../../api.js";

const CartBasketIcon = () => {
    const cartCode = localStorage.getItem("cart_code");
    const [cartData, setCartData] = useState({
        cart_items: [],
        total_price: 0,
        tax: 0,
        grand_total: 0
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { authenticate } = useAuth();
    const { setInCartStatus } = useCheckItems();

    useEffect(() => {
        if (!cartCode) {
            setError("Cart code not found in local storage.");
            setIsLoading(false);
            return;
        }

        api.get(`cart_items/${cartCode}`)
            .then((response) => {
                setCartData(response.data);
                setIsLoading(false);
                }
                // The new data is available here, right after the state is set.
               // console.log("Entire cart data after fetch:", response.data);
            )
            .catch((err) => {
                console.log(err);
                // console.error("Error fetching cart items:", err);
                // setError(err.response?.data?.error || "An error occurred");
                setIsLoading(false);
            });
    }, [cartCode]);


    const handleCheckout = () => {
        console.log(authenticate);
        if (!authenticate.email) {
            setTimeout(() => {
                navigate("/login");
            });
        }
        /*console.log("This user data: ", authenticate);
        console.log("This is user cart code", localStorage.getItem("cart_code"))
         */
        console.log("Check cart data: ", cartData[0]);
        navigate("/checkout", { state: { cartItems: cartData[0] } });
    };


    const handleRemoveClick = async (cartItem) => {
        const backendId = cartItem.id;
        const productId = String(cartItem.product.id);

        if (!cartCode || !backendId) {
            console.error("Cart code or item ID is missing!");
            return;
        }
        try {
            const response = await api.delete(`delete_item/${cartCode}/${backendId}/`);
            console.log("Check remove handle: ", [response.data]);
            let userCart = [response.data];
            setCartData(userCart);

            const cartStatus = JSON.parse(localStorage.getItem("inCartStatus")) || {};
            delete cartStatus[productId];
            localStorage.setItem("inCartStatus", JSON.stringify(cartStatus));
            setInCartStatus((prevState) => ({
                ...prevState,
                [productId]: false,
            }));
        } catch (err) {
            console.error("Error removing item:", err.response?.data || err.message || "An unknown error occurred")
        }
    };


    const handleQuantityUpdate = (cartItem, newQuantity) => {
        const productId = cartItem.product.id;
        // console.log("Checking product Id: ", productId);
        api.put(`product_quantity/${cartCode}/`, { product_id: productId, quantity: newQuantity })
            .then((response) => {
                setCartData([response.data]);
            })
            .catch((err) => {
                console.error("Error updating item quantity:", err);
                setError(
                    err.response?.data?.error ||
                    "An error occurred while updating the cart."
                );
            });
    };

    if (isLoading) {
        return (
            <div className={`${styles.BasketContainer} text-white d-flex justify-content-center align-items-center`}>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.BasketContainer} text-white d-flex justify-content-center align-items-center`}>
                <p>Error: {error}</p>
            </div>
        );
    }

    const cartLength = cartData.length;

    return (
        <div className={`${styles.BasketContainer} text-white`}>
            <Navbar />
            <h1 className={`${styles.HeadTitle} text-center`}>Your Cart</h1>
            <div className={`${styles.GridTemplateColumn}`}>
                <div>
                    {cartData.length > 0 ? (
                        cartData[0].cart_items.map((item) => (
                            <div key={item.id} className={`${styles.Card} mb-4`}>
                                <div>
                                    <div className={`${styles.CartDetail} d-flex`}>
                                        <div className={`${styles.ImageBody}`}>
                                            <img
                                                src={item.product.image_url}
                                                alt="Product"
                                                className={`${styles.CartImage}`}
                                            />
                                        </div>
                                        <div className={`${styles.CartBody} card-body`}>
                                            <div className={`${styles.ProductDetail}`}>
                                                <h4 className={`${styles.CardTitle}`}>{item.product.name}</h4>
                                                <p className="card-text">{item.product.category}</p>
                                                <p>In Stock</p>
                                            </div>
                                            <div className={`${styles.ItemPrice}`}>
                                                <h4 className={`${styles.CardTitle}`}>Price</h4>
                                                <p className="card-text">
                                                    ${Number(item.product.price).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <h4 className={`${styles.CardTitle} text-center`}>Quantity</h4>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        handleQuantityUpdate(item, parseInt(e.target.value, 10))}}
                                                    className="form-control w-55"
                                                />
                                            </div>
                                            <div className={`${styles.ItemPrice}`}>
                                                <h4 className={`${styles.CardTitle}`}>Total</h4>
                                                <p>${Number(item.total_price).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${styles.EditTags}`}>
                                        <button className={`${styles.EditTag}`}
                                        >Edit</button>
                                        <button className={`${styles.EditTag}`}
                                                onClick={() => handleRemoveClick(item)}
                                        >Remove</button>
                                        <button className={`${styles.EditTag}`}>Move to WishList</button>
                                        <button className={`${styles.EditTag}`}>Save for Later</button>
                                    </div>
                                </div>
                            </div>
                        ))) : (
                        <div className={"alert alert-primary my-5"}>
                            <p>Your cart is empty!</p>
                        </div>
                    )}
                </div>
                <div className={`form-group`}>
                    <div className={`${styles.CartSummary}`}>
                        <h5>Cart Summary</h5>
                        <p>Subtotal: <span>$ {Number(cartData[0]?.total_price || 0).toFixed(2)}</span></p>
                        <p>Tax: <span>$ {Number(cartData[0]?.tax || 0).toFixed(2)}</span></p>
                        <p className={`${styles.Total}`}>Total: <span>$ {Number(cartData[0]?.grand_total || 0).toFixed(2)}</span>
                        </p>
                        <button className={`${styles.BtnCheckout}`}
                                disabled={cartLength === 0}
                                onClick={handleCheckout}>Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartBasketIcon;