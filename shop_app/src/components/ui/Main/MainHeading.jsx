import React from 'react';
import styles from './Main.module.css';
import { useNavigate } from "react-router-dom";

const MainHeading = ({ title, heading })=> {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate("/");
    }
    return (
        <>
            <div className={`${styles.MainHeading}`}>
                <div className="HeadingH1Big Heading">
                    <h1 className="HeadingH1Big">{title}</h1>
                </div>
                <div className="HeadingH2 Heading">
                    <h6 className="HeadingH2Medium">{heading}</h6>
                </div>
                <div className="HeadingH3 Heading">
                    <input type="button" value="Shop Now" name="shop"
                           onClick={handleReturn}
                           id="shop" className="heading__button" />
                </div>
            </div>
        </>
    )
}

export default MainHeading;