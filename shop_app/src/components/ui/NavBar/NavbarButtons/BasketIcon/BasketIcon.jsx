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
    const [cartItems, setCartItems] = useState({ cart_items: []});
    const [error, setError] = useState(null);
    const {setInCartStatus} = useCheckItems();
    const [cartData, setCartData] = useState({})
    const [inCart, setInCart] = useState([]) // Stores product in the cart
    const navigate = useNavigate();
    const { authenticate } = useAuth();


    useEffect(() => {
        api.get(`cart_items/${cartCode}`)
            .then((response) => {
                console.log("Cart item useEffect");
                setCartItems(response.data);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "An error occurred");
            });
    }, [cartCode]);

    // Reason I wrote this user effect is because my data isn't synchronizing well
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) return;
        // Assign cart items to the inCart state
        console.log("set in cart useEffect", cartItems);
        setInCart(cartItems);
        console.log(inCart);
        setCartData({
            total_price: cartItems.total_price?.toFixed(2) || 0.00,
            tax: cartItems.tax?.toFixed(2) || 0.00,
            grand_total: cartItems.grand_total?.toFixed(2) || 0.00,
        });
    }, [cartItems])
    const cartLength = inCart ? inCart.length : 0;

    // Add more function the Checkout Button
    const handleCheckout = () => {
        if (!authenticate.username) {
            setTimeout(() => {
                navigate("/login");
            });
        }
        console.log("This user data: ", authenticate);
        console.log("This is user cart code", localStorage.getItem("cart_code"))
        api.post("save_cart_code/", {
            "user": authenticate,
            "cart_code": localStorage.getItem("cart_code"),
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
        });
        navigate("/checkout", { state: { cartItems } });
    };

    const handleRemoveClick = (cartCode, item) =>  {
        const backendId = item.id;
        const itemId = item['product'].id;
        const productId = String(itemId);

        const updatedItems = cartItems.cart_items.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        if (!cartCode || !productId) {
            console.error("Cart code or item ID is missing!");
            return;
        }

        // Change the cart total when item is deleted
        const cartPrice = {
            grandTotal: cartItems.grand_total,
            tax: cartItems.tax,
            totalPrice: cartItems.total_price,
            quantity: cartItems.cart_items?.[0]?.quantity || 0, // First item's quantity or fallback
            itemTotalPrice: cartItems.cart_items?.[0]?.total_price || 0 // First item's total_price or fallback
        };

        api.delete(`delete_item/${cartCode}/${backendId}`, {
            data: cartPrice,
        })
            .then((response) => {
                setCartItems(response.data);
                // Status for item in cart and deleting item
                const cartStatus = JSON.parse(localStorage.getItem("inCartStatus")) || {};
                delete cartStatus[productId]; // Remove item from localStorage
                localStorage.setItem("inCartStatus", JSON.stringify(cartStatus));

                setInCartStatus((prevState) => ({
                    ...prevState,
                    [productId]: false,
                }))
                localStorage.setItem("inCartStatus", JSON.stringify(cartStatus));

            })
            .catch((err) => {
                console.error("Error removing item:", err.response?.data || err.message || "An unknown error occurred");
            });
    };
    // This might be one of my funniest codes pertaining to
    const handleQuantityUpdate = (cartItem, newQuantity, cartCode) => {
        // Optimistically update the frontend state
        const cartItemId = cartItem.id;
        setCartItems((prevState) => {
            // Ensure the object has a products array
            if (Array.isArray(prevState.cart_items)) {
                return {
                    ...prevState, // Spread the other properties (e.g., totalPrice, grandTotal)
                    cart_items: prevState.cart_items.map((item) =>
                        cartItemId === item.id
                            ? { ...item, quantity: newQuantity } // Update quantity if IDs match
                            : item
                    ),
                };
            } else {
                // Fallback in case products is not an array
                console.warn("No products array found in prevState!");
                return prevState; // Or return a default state if necessary
            }
        });
        // Realised I placed myself in a trap by using arrays. Have to loop through data
        const backend = cartItems['cart_items'].find(item => item.id === cartItemId);
        const backendId = backend['product']['id'];

        api.put(`cart_items/${cartCode}`, { backendId, quantity: newQuantity })
            .then((response) => {
                // Update both cart items and cart data from backend response
                setCartItems(response.data); // Assuming `response.data.cart_items` is your array
            })
            .catch((err) => {
                console.error("Error updating item quantity:", err);
                setError(
                    err.response?.data?.error ||
                    "An error occurred while updating the cart."
                );
            });
    };


    return (
        <div className={`${styles.BasketContainer} text-white`}>
            <Navbar />
            <h1 className={`${styles.HeadTitle} text-center`}>Your Cart</h1>
            <div className={`${styles.GridTemplateColumn}`}>
                <div>
                    {inCart && inCart.length > 0 ? (
                        inCart.map((item) => (
                            <div key={item.id} className={`${styles.Card} mb-4`}>
                                <div>
                                    <div className={`${styles.CartDetail} d-flex`}>
                                        <div className={`${styles.ImageBody}`}>
                                            <img
                                                src={item['product'].image_url}
                                                alt="Product"
                                                className={`${styles.CartImage}`}
                                            />
                                        </div>
                                        <div className={`${styles.CartBody} card-body`}>
                                            <div className={`${styles.ProductDetail}`}>
                                                <h4 className={`${styles.CardTitle}`}>{item['product'].name}</h4>
                                                <p className="card-text">{item['product'].category}</p>
                                                <p>In Stock</p>
                                            </div>
                                            <div className={`${styles.ItemPrice}`}>
                                                <h4 className={`${styles.CardTitle}`}>Price</h4>
                                                <p className="card-text">
                                                    ${Number(item['product'].price).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <h4 className={`${styles.CardTitle} text-center`}>Quantity</h4>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item['quantity']}
                                                    onChange={(e) => {
                                                        handleQuantityUpdate(item, parseInt(e.target.value, 10), cartCode)}} // Dynamically pass new quantity
                                                    className="form-control w-55"
                                                />
                                            </div>
                                            <div className={`${styles.ItemPrice}`}>
                                                <h4 className={`${styles.CardTitle}`}>Total</h4>
                                                <p>${(item['product'].price * item['quantity']).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${styles.EditTags}`}>
                                        <button className={`${styles.EditTag}`}
                                        >Edit</button>
                                        <button className={`${styles.EditTag}`}
                                           onClick={() => {
                                               handleRemoveClick(cartCode, item)}}
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
                        <p>Subtotal: <span>$ {(cartData.price_total || cartItems.total_price || 0)}</span></p>
                        <p>Tax: <span>$ {(cartData.tax || cartItems.tax || 0)}</span></p>
                        <p className={`${styles.Total}`}>Total: <span>$ {(cartData.grand_total || cartItems.grand_total || 0)}</span>
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