import {
    AppBar,
    Toolbar,
    Typography,
    Button,
} from "@mui/material";

function Header() {

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("idUsuario");
        localStorage.removeItem("nomeUsuario");

        window.location.href = "/login";
    }

    const nomeUsuario = localStorage.getItem("nomeUsuario");

    const nomeFormatado = nomeUsuario
        ? nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1)
        : "";

    return (
        <AppBar
            position="fixed"
            sx={{
                height: "64px",
                backgroundColor: "primary.main",
                boxShadow: 2,
            }}
        >
            <Toolbar
                sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    px: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    LogSensei
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 500,
                    }}
                >
                    {nomeFormatado}
                </Typography>

                <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Sair
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;