import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { login } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senhaUsuario, setSenhaUsuario] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {

        if (!nomeUsuario || !senhaUsuario) {
            setErro("Preencha usuário e senha para continuar.");
            return;
        }

        setErro("");
        setCarregando(true);

        try {

            await login(nomeUsuario, senhaUsuario);
            window.location.href = "/";

        } catch (error) {

            console.error("Erro ao fazer login:", error);
            setErro("Usuário ou senha incorretos. Tente novamente.");

        } finally {

            setCarregando(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !carregando) {
            handleLogin();
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                padding: 2,
            }}
        >

            <Paper
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    padding: 5,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2.5,
                }}
            >

                <Box sx={{ textAlign: "center", mb: 1 }}>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                    >
                        LogSensei
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                        Faça login para continuar
                    </Typography>
                </Box>

                {erro && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    label="Usuário"
                    value={nomeUsuario}
                    onChange={(e) => setNomeUsuario(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={carregando}
                    autoFocus
                    fullWidth
                />

                <TextField
                    label="Senha"
                    type={mostrarSenha ? "text" : "password"}
                    value={senhaUsuario}
                    onChange={(e) => setSenhaUsuario(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={carregando}
                    fullWidth
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setMostrarSenha((prev) => !prev)}
                                        edge="end"
                                        tabIndex={-1}
                                    >
                                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={carregando}
                    fullWidth
                    size="large"
                    sx={{ mt: 1, py: 1.2, textTransform: "none", fontSize: "1rem" }}
                >
                    {carregando ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Entrar"
                    )}
                </Button>

            </Paper>

        </Box>
    );
}

export default Login;