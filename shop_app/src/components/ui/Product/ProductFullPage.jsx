import { useCountItemsContext } from "../CounterPages/AddCountBasket.jsx";
import { useCheckItems } from "../CounterPages/ItemInCart.jsx"
import React, { useEffect, useState} from 'react';
import styles from"./Product.module.css";
import api from "../../../api.js"
import {useLocation, useParams} from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import FullPagePlaceHolder from "../PlaceHolder/FullPagePlaceHolder.jsx";
import RelatedProduct from "./RelatedProduct.jsx";
import { handleAddToCart, addItem } from '../../../cartUtils.js'
import {toast, ToastContainer} from "react-toastify";

const ProductFullPage = () => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams(); // Get 'slug' from the URL
    const location = useLocation();
    const { product } = location.state || {};
    const { cartItemCount,setCartItemCount } = useCountItemsContext()
    const {inCartStatus, setInCartStatus} = useCheckItems();

    // Fix similar products backend. Return those an object of similar products

    useEffect(() => {
        //Fetch the product details
        api.get(`product/${slug}`)
            .then(response => {
                console.log("similar data return: ", response.data)
                const similarProducts = response.data.similar_products;
                setRelatedProducts(similarProducts);
                setLoading(false)
            })
            .catch(err => {
                console.error("Error getting product", err);
                setError("Failed to fetch product details");
                setLoading(false)
            })
    },[slug]);

    useEffect(() => {
        console.log("FullPageProduct cartItemCount updated:", cartItemCount);
    }, []);

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    // If product data is missing, show the placeholder
    if (!product || product.slug !== slug)  {
        return <FullPagePlaceHolder />;
    }

    return (
        <>
            <div className={`${styles.ProductContainer} text-white`}>
                <NavBar cartItemCount={cartItemCount} /> {/* Confused to this why isn't this updating after adding to cart. But count happens in the backend */}
                <div className="container product mt-5">
                    <div className="row">
                        <div className={`col-md-6 ${styles.imageSpace}`}>
                            <img src={product.image_url} alt={product.name}
                                 className={`img-fluid ${styles.productImg}`}/>
                        </div>
                        <div className="col-md-6">
                            <h2>{product.name}</h2>
                            <p><strong>SKU:</strong>{product.slug}</p>
                            <p><strong>Price:</strong>{product.price}</p>
                            <p>{product.description}</p>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    toast.success("Item has been successfully added to cart");
                                    handleAddToCart(product, setInCartStatus);
                                    setCartItemCount(prevCount => prevCount + 1); {/* Card item add 2 item of the same thing. I don't see where this is happening */}
                                    addItem(product.id);
                                }}
                                disabled={inCartStatus[product.id] || false} // Disable if the item is in the cart
                                >
                                {inCartStatus[product.id] ? "Item in Cart" : "Add to Cart"}
                            </button>
                            <ToastContainer />
                        </div>
                </div>
            </div>
            <RelatedProduct relatedProducts={relatedProducts}/>
        </div>
</>
)
    ;
};

export default ProductFullPage;