
import api from "./api.js";
import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";


export const isTokenExpired = (token) =>  {
    if(!token) return true; // No token = expired

    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime;// Returns true if expired
}
// Usage
const token = localStorage.getItem("auth_token");
// console.log("This is the localstorage",  localStorage);
if (isTokenExpired(token)) {
    console.log("Token expired. Please log in");
}

export const  addItem = (productId) => {
    console.log("Check local storage:", localStorage)
    const cartCode = localStorage.getItem("cart_code");
    if (!cartCode || !productId) {
        console.error("Missing cartCode or productId");
        return;
    }

    const newItem = {
        cart_code: cartCode, product_id: productId,
    }
    // Error on getting product to cart "Add Item To cart"
        api.post("add_item/", newItem, {})
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.error("Error:", err.message);
                throw err;
            });
}

export const isItemInCart = async (productId) => {
    const cartCode = localStorage.getItem("cart_code");

    try {
        const response = await api.get(`cart_items/${cartCode}`);
        const cartItems = response.data; // Assuming this API returns all items in the cart

        // Check if the product exists in the cart
        return cartItems.some((item) => item.product.id === productId);
    } catch (err) {
        console.error("Error fetching cart items:", err.message);
        return false; // Default to false if there's an error
    }
};

export const handleAddToCart = (product, setInCartStatus) => {
    const productId = String(product.id);
    const cartStatus = JSON.parse(localStorage.getItem("inCartStatus")) || {};
    if (!cartStatus[productId]) {
        cartStatus[productId] = true;
        localStorage.setItem("inCartStatus", JSON.stringify(cartStatus));
        setInCartStatus((prevState) => ({
            ...prevState,
            [productId]: true,
        }));
        console.log(`Added product ${productId} to cart`);
    } else {
        console.warn("Product is already in cart or invalid:", productId);
    }
};

export const setLocalStorageData = (data, setAuthenticate) => {
    if (!data || !data.tokens || !data.tokens.access) {
        console.error("Auth Data Error: Missing token data from API response.");
        return;
    }

    const accessToken = data.tokens.access;
    const refreshToken = data.tokens.refresh;
    const user = data.user;

    try {
        // Store Tokens
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        if (user) {
            const userToSave = {
                id: user.id,
                email: user.email,
                username: user.username,
            };
            localStorage.setItem("user", JSON.stringify(userToSave));
        }

    } catch (error) {
        console.error("!!! CRITICAL LOCAL STORAGE FAILURE: EXECUTION HALTED HERE !!!", error);
        return;
    }

    if (user && accessToken) {
        const decodedTokenUser = jwtDecode(accessToken);

        // setAuthenticate expects the full object defined in AuthProvider.jsx: { token, user, isAuth }
        setAuthenticate({
            token: accessToken,
            user: decodedTokenUser,
            isAuth: true
        });
        console.log("Authentication state updated successfully. User is logged in.");
    }
};

export const handleLogout = () => {
    // Remove user session data
    sessionStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart_code");
    localStorage.removeItem("inCartStatus");
    console.log("User logged out, session cleared.");
}

export const setToken = (accessToken) => {
    localStorage.setItem("auth_token", accessToken);
}

export const setUserData = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export default {
    addItem,
    handleAddToCart,
    handleLogout,
    setLocalStorageData,
    setUserData,
    setToken,
    isItemInCart,
    isTokenExpired,
}
