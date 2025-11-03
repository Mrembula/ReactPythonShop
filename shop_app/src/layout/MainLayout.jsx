import NavBar from "../components/ui/NavBar/NavBar.jsx";
import Main from "../components/ui/Main/Main.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            <Main />
        </>
    )
}

export default MainLayout;