import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../../api.js";

const CountItemsContext = createContext();

const AddCounterBasket  = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);
    const cartCode = localStorage.getItem("cart_code");

    useEffect(() => {
        if (cartCode) {
            api.get(`get_cart_status?cart_code=${cartCode}`)
                .then((res) => {
                    setCartItemCount(res.data.items_count);
                })
                .catch((err) => {
                    console.error(err.message);
                });
        }
    }, [cartCode]);

    return (
        <CountItemsContext.Provider value={{ cartItemCount, setCartItemCount }}>
            {children}
        </CountItemsContext.Provider>
    );
};

const useCountItemsContext = () => useContext(CountItemsContext);
export { AddCounterBasket, useCountItemsContext };