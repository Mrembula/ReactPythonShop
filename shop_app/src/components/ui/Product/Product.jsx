import { useCheckItems } from "../CounterPages/ItemInCart.jsx"
import "./Product.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {useNavigate} from "react-router-dom";
import { handleAddToCart, addItem } from "../../../cartUtils.js";
import {toast, ToastContainer} from "react-toastify";
import {useCountItemsContext} from "../CounterPages/AddCountBasket.jsx";


const Product = ({product, onClose}) => {
    const navigate = useNavigate();
    const {inCartStatus, setInCartStatus} = useCheckItems();
    const { setCartItemCount } = useCountItemsContext();

    const handleFullDetails = () => {
        if (!product) {
            console.error("Product is undefined!");
            return;
        }
        navigate(`/product/${product.slug}`, { state: { product } }); // Pass data via state
        onClose();  // Close the modal
    };

    return(
        <>
            <div className="modal-backdrop"></div>
            <div className="modal fade show" id="productModal" tabIndex="-1"
                 aria-labelledby="productModalLabel"
                 style={{display: "block"}}
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">{product.name}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    onClick={onClose}
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-black">
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <img src={product.image_url}
                                     style={{width: "18rem"}}
                                     className="img-fluid mb-3" alt={product.name}/>
                            </div>
                            <p>{product.description}</p>
                            <hr />
                                <p>$ {product.price}</p>
                            <hr/>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-light"
                                    onClick={handleFullDetails}
                             data-bs-dismiss="modal"
                            >Full details</button>

                            {/* Buttons on the right */}
                            <div className="d-flex">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={onClose}
                                    data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary"
                                        onClick={() => {
                                            handleAddToCart(product, setInCartStatus);
                                            toast.success("Item has been successfully added to cart");
                                            setCartItemCount(prevCount => prevCount + 1);
                                            addItem(product.id);
                                        }}
                                        disabled={inCartStatus[product.id] || false}
                                >{inCartStatus[product.id] ? "Item in Cart" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>

        </>
    )
}
export default Product;