import { TwitterX, Facebook, Person, ThreeDotsVertical, ThreeDots, Basket } from 'react-bootstrap-icons';
const menu = ['Home', 'Shop', 'About','Contact'];
import {Link} from 'react-router-dom';

const NavBar= () => {
    return (
        <>
            <nav>
                <div className="navbar justify-content-between">
                    <div className="navbar__website-logo">
                        <a href="#" className="navbar-brand text-white">SHOP</a>
                    </div>
                    <div className="main--icon">
                        <div className="navbar__content">
                            <ul className="navbar__nav">
                                <li className="nav-item">
                                    {menu.map((item, index) => (
                                        <a key={index} className={`nav-link text-white`}
                                           href="#"
                                           onClick={() => {
                                               handleMenuClick(item, index);
                                           }
                                           }
                                        >{item}</a>
                                    ))}
                                </li>
                            </ul>
                        </div>
                        <div className="navbar__icon">
                            <div className="nav-icon navbar__icon--x">
                                <TwitterX/>
                            </div>
                            <div className="nav-icon navbar__icon--facbook nav-icon"
                            >
                                <Facebook/>
                            </div>
                            <div className="nav-icon navbar__icon--user nav-icon">
                                <Person/>
                            </div>
                            <div className="nav-icon navbar__icon--shop-cart">
                                <div className="position-relative d-inline-block">
                                    <Link to="/cart">
                                        <Basket />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <button className="navbar__toggle">

                        </button>
                    </div>
                </div>
                <div>
                    <div  className={`mini__navbar `}>
                        <ul>
                            <li className="p-2">
                                {menu.map((item, index) => (
                                    <a key={index} className="nav-link text-white" href="#">{item}</a>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );

}

export default NavBar