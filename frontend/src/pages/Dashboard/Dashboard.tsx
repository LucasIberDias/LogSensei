import { Box, Typography } from "@mui/material";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

function Dashboard() {

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    return (
        <Box>

            <Header />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    marginLeft: "240px",
                    padding: 4,
                    paddingTop: 10,
                }}
            >

                <Typography variant="h4">
                    Dashboard
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ marginTop: 2 }}
                >
                    Bem-vindo, {nomeUsuario}!
                </Typography>

            </Box>

        </Box>
    );
}

export default Dashboard;