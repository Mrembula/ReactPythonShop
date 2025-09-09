import {BrowserRouter, Routes, Route} from "react-router-dom"
import MainLayout from './layout/MainLayout.jsx';
import NotFoundPage from "./components/ui/NotFound/NotFound.jsx";

/*
import ProductFullPage from "./components/ui/Product/ProductFullPage.jsx";
import { AddCounterBasket } from "./components/ui/CounterPages/AddCountBasket.jsx";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CheckItemInCart } from "./components/ui/CounterPages/ItemInCart.jsx";
import CartBasketIcon from "./components/ui/NavBar/NavbarButtons/BasketIcon/BasketIcon.jsx";
import 'react-toastify/dist/ReactToastify.css';
import SignUpPage from "./components/ui/LoginPage/SignUpPage.jsx";
import CheckoutPage from "./components/ui/CheckOut/CheckoutPage.jsx";
import { AuthProvider } from "./components/ui/Authentication/AuthProvider.jsx";
import AuthenticationRoute from "./components/ui/Authentication/AthenticationRoute.jsx";
import LoginPage from "./components/ui/LoginPage/LoginPage.jsx";
import UserProfileIcon from "./components/ui/NavBar/NavbarButtons/UserProfileIcon/UserProfileIcon.jsx";
<Route path="/" element={<MainLayout />} />
                            <Route element={<AuthenticationRoute />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="product-detail/:slug" element={<ProductFullPage />} />
                            <Route path="/cart" element={<CartBasketIcon />} />
                            <Route path="/profile" element={<UserProfileIcon />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <CheckItemInCart>
            <AddCounterBasket>
                <BrowserRouter>
                    <AuthProvider>
                        <Routes>

                        </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </AddCounterBasket>
        </CheckItemInCart>
*/
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
        )
    }

export default App;