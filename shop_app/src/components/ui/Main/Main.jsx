import ProductPlaceHolder from "../PlaceHolder/ProductPlaceHolder.jsx";
import { useAuth } from "../Authentication/AuthProvider.jsx";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Product  from "../Product/Product.jsx";
import PageNotFound from "../NotFound/NotFound.jsx";
import MainHeading from "./MainHeading.jsx";
import Error from "../Error/Error.jsx";
import React, {useEffect} from 'react';
import api from "../../../api.js";
import {v4 as uuidv4 } from 'uuid';
import Card from "../Card/Card.jsx";
import styles from './Main.module.css';


const Main = () => {
    const title = "Welcome to Your Favourite Store";
    const text = "Discover the latest trends with our modern collection";
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const { setAuthenticate } = useAuth();

    // Check localStorage. Not returning any items for login
    useEffect(() => {
        let userCartCode = localStorage.getItem("user.cart_code");
        let cartCode = localStorage.getItem("cart_code");
        const storedUser = localStorage.getItem("user");

        // Check for authenticated user
        if (storedUser && storedUser !== "null") {
            setAuthenticate(JSON.parse(storedUser));
        }
        if (!cartCode) {  // Ensure cart_code is only created when truly missing
            if (!userCartCode || userCartCode === "No cartCode found") {
                const uniqueId = uuidv4();
                localStorage.setItem("cart_code", uniqueId);
            } else {
                localStorage.setItem("cart_code", userCartCode);
            }
        }
    }, []);


    useEffect(function(){
        setLoading(true)
        api.get("products?timestamp=" + new Date().getTime())
            .then(res => {
                setProducts(res.data)
                setLoading(false)
                setError("")
            }).catch(err => {
                setLoading(false)
                setError(err.message)
        })
    },[]);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
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
                            <PageNotFound />
                    )}
                    <div className={`${styles.ProductHeading}`}>
                        <div className={`${MainHeading}`}>
                            <h1>Our Product</h1>
                        </div>
                        {error && <Error error={error} />}
                        {loading ? (
                            <ProductPlaceHolder />
                        ) : (
                            <>
                                <Card products={products} handleCardClick={handleCardClick} />
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