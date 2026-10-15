import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

function Layout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                minHeight: "100dvh",
                backgroundColor: "background.default",
            }}
        >
            <Header />
            <Sidebar />

            <Box
                component="main"
                sx={{
                    boxSizing: "border-box",
                    minWidth: 0,
                    width: isMobile
                        ? "100%"
                        : "calc(100% - 240px)",

                    marginTop: "64px",
                    marginLeft: isMobile ? 0 : "240px",

                    minHeight: "calc(100dvh - 64px)",

                    padding: {
                        xs: "16px 12px",
                        sm: "24px",
                    },

                    paddingBottom: isMobile
                        ? "calc(140px + env(safe-area-inset-bottom, 0px))"
                        : "32px",

                    overflowX: "clip",
                    overflowY: "visible",

                    transition: theme.transitions.create(
                        ["margin-left"],
                        {
                            duration: theme.transitions.duration.standard,
                        }
                    ),
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout;