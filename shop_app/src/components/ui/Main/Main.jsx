import ProductPlaceHolder from "../PlaceHolder/ProductPlaceHolder.jsx";
import PageNotFound from "../NotFound/NotFound.jsx";
import React, { useState, useEffect } from 'react';
import Product  from "../Product/Product.jsx";
import MainHeading from "./MainHeading.jsx";
import Error from "../Error/Error.jsx";
import Card from "../Card/Card.jsx";
import api from "../../../api.js";


const Main = () => {
    const title = "Welcome to Your Favourite Store";
    const text = "Discover the latest trends with our modern collection";
    const [activeIndex, setActiveIndex] = useState(null);
    const [error, setError] = React.useState("");
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);


    useEffect(function(){
        setLoading(true)
        console.log("Product Checkout 1");
        api.get("products?timestamp=" + new Date().getTime())
            .then(res => {
                console.log(res.data)
                setProducts(res.data)
                setLoading(false)
                console.log("Product Checkout 2");
                setError("")
            }).catch(err => {
            setLoading(false)
            setError(err.message)
        })
    },[]);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
    }

    const navigateToStartMenu = () => {
        window.location.href = '/';
    }

    const handleMenuClick = (item, index) => {
        setActiveIndex(index);

        if(item === 'Home') {
            navigateToStartMenu();
        }
        else if(item === "Logout" || item === "Login") {
            window.location.href = "/login";
        }
    }


    return (
        <>
            <main className="main-container">
                <div className="main">
                    {title && text ? (
                        <MainHeading
                            title={title}
                            heading={text}
                        />
                    ) : (
                        <PageNotFound/>
                    )}
                    <div className={``}>
                        <div className={`${MainHeading}`}>
                            <h1>Our Product</h1>
                        </div>
                        {error && <Error error={error}/>}
                        {loading ? (
                            <ProductPlaceHolder/>
                        ) : (
                            <>
                                <Card products={products} handleCardClick={handleCardClick}/>
                                {selectedProduct && <Product product={selectedProduct}
                                                             onClose={() => setSelectedProduct(null)}
                                />}
                            </>
                        )}
                    </div>
                </div>
            </main>

        </>
    )
}

export default Main;