import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../api.js";

const CountItemsContext = createContext();

const AddCounterBasket  = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);
    const cartCode = localStorage.getItem("cart_code");

    useEffect(() => {
        if (cartCode) {
            api.get(`get_cart_status/${cartCode}`)
                .then((response) => {
                    console.log("This is cart status", response.data);
                    setCartItemCount(response);
                })
                .catch((err) => {
                    if (err.response && err.response.status === 404)
                        setCartItemCount(0);
                    else
                        console.error(err.message);
                });
        }
    }, [cartCode, setCartItemCount]);

    return (
        <CountItemsContext.Provider value={{ cartItemCount, setCartItemCount }}>
            {children}
        </CountItemsContext.Provider>
    );
};

const useCountItemsContext = () => useContext(CountItemsContext);
export { AddCounterBasket, useCountItemsContext };