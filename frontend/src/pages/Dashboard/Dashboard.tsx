import { Box, Typography } from "@mui/material";

function Dashboard() {

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    return (
        <Box sx={{ padding: 4 }}>

            <Typography variant="h4">
                Dashboard
            </Typography>

            <Typography variant="body1">
                Bem-vindo, {nomeUsuario}!
            </Typography>

        </Box>
    );
}

export default Dashboard;