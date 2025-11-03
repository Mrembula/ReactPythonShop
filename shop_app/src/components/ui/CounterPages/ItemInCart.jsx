import React, { createContext, useContext, useEffect, useState } from "react";

const CheckItemContext = createContext();

const CheckItemInCart = ({ children }) => {
    const [inCartStatus, setInCartStatus] = useState({});

    useEffect(() => {
        // Retrieve the cart from localStorage and sync with `inCartStatus`
        const cartStatus = JSON.parse(localStorage.getItem("inCartStatus")) || {};
        setInCartStatus(cartStatus)
        // console.log("Synced inCartStatus:", cartStatus);
    }, []);


    return (
        <CheckItemContext.Provider value={{ inCartStatus, setInCartStatus }}>
            {children}
        </CheckItemContext.Provider>
    );
};

const useCheckItems = () => useContext(CheckItemContext);

export { CheckItemInCart, useCheckItems };