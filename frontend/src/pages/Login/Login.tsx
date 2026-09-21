import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";

import { login } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senhaUsuario, setSenhaUsuario] = useState("");

    async function handleLogin() {

        try {

            await login(nomeUsuario, senhaUsuario);

            navigate("/");

        } catch (error) {

            console.error("Erro ao fazer login:", error);

        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <Typography
                    variant="h4"
                    sx={{ textAlign: "center" }}
                >
                    LogSensei
                </Typography>

                <TextField
                    label="Usuário"
                    value={nomeUsuario}
                    onChange={(e) =>
                        setNomeUsuario(e.target.value)
                    }
                    fullWidth
                />

                <TextField
                    label="Senha"
                    type="password"
                    value={senhaUsuario}
                    onChange={(e) =>
                        setSenhaUsuario(e.target.value)
                    }
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    fullWidth
                >
                    Entrar
                </Button>

            </Box>

        </Box>
    );
}

export default Login;