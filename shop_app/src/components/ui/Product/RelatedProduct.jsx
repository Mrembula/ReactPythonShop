import React from "react";
import './RelatedProduct.module.css';
import { useNavigate } from 'react-router-dom';
import styles  from './RelatedProduct.module.css';


const RelatedProduct = (relatedProducts) => {
    const navigate = useNavigate();
    const product = relatedProducts.relatedProducts;

    return (
        <>
            <div>
                <h2 className="text-center my-4">Related Products</h2>
                <div className={`row ${styles.relatedProducts}`}>
                    {product.map((item) => (
                        <div key={item.id} className={styles.cardSize}>
                            <div className="card">
                                <div className={styles.imageContainer}>
                                    <img
                                        src={item.image_url}
                                        className="card-img-top"
                                        alt={item.name}
                                    />
                                </div>
                                <div className={`card-body ${styles.cardBody}`}>
                                    <h5 className={styles.cardTitle}>{item.name}</h5>
                                    <p><strong>Price:</strong> {item.price}</p>
                                    <a onClick={() =>
                                    {
                                        navigate(`/product/${item.slug}`, { state: { product: item } });
                                        window.scrollTo({ top: 0, behavior: "smooth"});
                                    }} className={`btn btn-primary`}
                                    >
                                        View Details
                                    </a>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default RelatedProduct;