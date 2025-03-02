import { Box } from "@shopify/polaris";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {


    return (
        <Box>
            <ui-nav-menu>
                <Link to="/">All Rules</Link>
                <Link to="/video-tutorials">Video Tutorials</Link>
                <Link to="/plans">Your Plan</Link>
            </ui-nav-menu>

            <Outlet></Outlet>
        </Box>
    );
};

export default MainLayout;