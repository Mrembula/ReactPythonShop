import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainLayout from './layout/MainLayout.jsx';
import ProductFullPage from "./components/ui/Product/ProductFullPage.jsx";
import NotFoundPage from "./components/ui/NotFound/NotFound.jsx";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AddCounterBasket } from "./components/ui/CounterPages/AddCountBasket.jsx";
import { CheckItemInCart } from "./components/ui/CounterPages/ItemInCart.jsx";
import CartBasketIcon from "./components/ui/NavBar/NavbarButtons/BasketIcon/BasketIcon.jsx";
import 'react-toastify/dist/ReactToastify.css';
import SignUpPage from "./components/ui/LoginPage/SignUpPage.jsx";
import CheckoutPage from "./components/ui/CheckOut/CheckoutPage.jsx";
import { AuthProvider } from "./components/ui/Authentication/AuthProvider.jsx";
import AuthenticationRoute from "./components/ui/Authentication/AthenticationRoute.jsx";
import LoginPage from "./components/ui/LoginPage/LoginPage.jsx";
import UserProfileIcon from "./components/ui/NavBar/NavbarButtons/UserProfileIcon/UserProfileIcon.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AddCounterBasket>
                    <CheckItemInCart>
                        <Routes>
                            <Route element={<AuthenticationRoute />} >
                                <Route path="/profile" element={<UserProfileIcon />} />
                            </Route>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/cart" element={<CartBasketIcon />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="product/:slug" element={<ProductFullPage />} />
                            <Route path="/" element={<MainLayout />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </CheckItemInCart>
                </AddCounterBasket>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;