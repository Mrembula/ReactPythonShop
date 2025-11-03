import React from 'react';
import '../Main/Main.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductPlaceHolder = () => {
    const productNum = [...Array(21).keys()].slice(0)

    return (
        <>
            <div className="product__sale">
                <div className="card__container px-lg-5 d-flex flex-wrap">
                    {productNum.map((index) => (
                   <div className="card card-size" key={index} aria-hidden="true">
                       <div className="image__container card-img-top" style={{ backgroundColor: 'gray' }}>
                           <img src={null} />
                       </div>
                       <div className="card-body card-text placeholder-glow">
                           <h5 className="placeholder col-12 placeholder-sm"></h5>
                           <p className="placeholder col-12 placeholder-sm"></p>
                       </div>
                   </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProductPlaceHolder;