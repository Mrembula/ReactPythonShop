import NavBar from "../NavBar/NavBar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";

const FullPagePlaceHolder = () => {

    return (
        <>
            <div className="Product__container text-white">
                <NavBar />
                <div className="container product mt-5">
                    <div className="row">
                        <div className="col-md-6 image-space card-img-top"
                             style={{ backgroundColor: 'gray' }}>
                            <img src={null} className="img-fluid" alt={null} />
                        </div>
                        <div className="col-md-6 card-body card-text placeholder-glow">
                            <h2>{name}</h2>
                            <p className="placeholder col-6 placeholder-sm"></p>
                            <p className="placeholder col-lg-12 placeholder-sm"></p>
                            <p className="placeholder col-12 placeholder-lg"></p>
                            <button className="btn btn-primary col-12 placeholder-sm"></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FullPagePlaceHolder;