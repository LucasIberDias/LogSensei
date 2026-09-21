import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function Header() {

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("idUsuario");
        localStorage.removeItem("nomeUsuario");

        window.location.href = "/login";
    }

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    return (
        <AppBar position="fixed">

            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >

                <Typography variant="h6">
                    LogSensei
                </Typography>

                <Typography variant="body1">
                    {nomeUsuario}
                </Typography>

                <Button
                    color="inherit"
                    onClick={handleLogout}
                >
                    Sair
                </Button>

            </Toolbar>

        </AppBar>
    );
}

export default Header;