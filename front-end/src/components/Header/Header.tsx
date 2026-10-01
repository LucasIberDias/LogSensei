import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

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
        localStorage.removeItem("cargo");

        window.location.href = "/login";
    }

    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const cargoUsuario = localStorage.getItem("cargo");

    const nomeFormatado = nomeUsuario
        ? nomeUsuario.charAt(0).toUpperCase() + nomeUsuario.slice(1)
        : "";

    const cargoFormatado = cargoUsuario
        ? cargoUsuario
            .toLowerCase()
            .split(" ")
            .map(
                palavra =>
                    palavra.charAt(0).toUpperCase() + palavra.slice(1)
            )
            .join(" ")
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
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <PersonIcon fontSize="small" />
                    {nomeFormatado + " - " + cargoFormatado}
                </Typography>

                <Button
                    color="inherit"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
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