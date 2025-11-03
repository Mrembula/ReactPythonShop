import React from 'react';

const CheckoutPageProducts = (cartItems) => {
    console.log("CheckoutPageProduct: ", cartItems.cartItems.cart_items.length);
    return (
        <div className="col-lg-6" style={{backgroundColor: "black", opacity: 0.7}}>
            <div className="card mb-4 bg-transparent text-white">
                <div className="card-header">
                    <h2 className="h4 mb-0
                            border-bottom border-light border-bottom-4 py-3">Order Summary</h2>
                </div>
                <div className="card-body">
                    {cartItems.cartItems.cart_items.map((product) => (
                        <div key={product.id} className="row align-items-center border-bottom mb-3 pb-3">
                            <div className="col-3">
                                <img
                                    src={product.product.image_url}
                                    alt={product.product.name}
                                    className="img-fluid rounded"
                                />
                            </div>
                            <div className="col-9">
                                <h3 className="h5">{product.product.name}</h3>
                                <p className="">{product.product.description}</p>
                                <p className="small">Quantity: {product.quantity}</p>
                                <p className="font-weight-bold">${product.total_price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between mt-4">
                        <span className="h6 font-weight-bold">Total:</span>
                        <span className="h4 font-weight-bold">${cartItems?.cartItems.grand_total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPageProducts;

