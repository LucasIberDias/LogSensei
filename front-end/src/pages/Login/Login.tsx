import { useState, type KeyboardEvent } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import { login } from "../../services/authService";

function Login() {

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senhaUsuario, setSenhaUsuario] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {

        if (!nomeUsuario.trim() || !senhaUsuario.trim()) {
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

    function handleKeyDown(event: KeyboardEvent) {

        if (event.key === "Enter" && !carregando) {
            handleLogin();
        }

    }

    return (
        <Box
            sx={() => ({
                minHeight: "95vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            })}
        >

            <Paper
                elevation={8}
                sx={{
                    width: "100%",
                    maxWidth: 1100,
                    minHeight: 600,
                    display: "flex",
                    overflow: "hidden",
                    borderRadius: 3,
                }}
            >

                <Box
                    sx={(theme) => ({
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: {
                            xs: 3,
                            sm: 5,
                            md: 7,
                        },
                        backgroundColor: theme.palette.background.paper,

                        [theme.breakpoints.down("md")]: {
                            width: "100%",
                        },
                    })}
                >

                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                        }}
                    >

                        <Box
                            sx={{
                                textAlign: "center",
                                mb: 5,
                            }}
                        >

                            <Typography
                                variant="h3"
                                sx={(theme) => ({
                                    fontWeight: 700,
                                    color: theme.palette.primary.main,
                                    mb: 1,
                                })}
                            >
                                LogSensei
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                            >
                                Entre na sua conta para continuar
                            </Typography>

                        </Box>

                        {erro && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                }}
                            >
                                {erro}
                            </Alert>
                        )}

                        <TextField
                            label="Usuário"
                            value={nomeUsuario}
                            onChange={(event) =>
                                setNomeUsuario(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={carregando}
                            autoFocus
                            fullWidth
                            sx={{ mb: 2.5 }}
                        />

                        <TextField
                            label="Senha"
                            type={mostrarSenha ? "text" : "password"}
                            value={senhaUsuario}
                            onChange={(event) =>
                                setSenhaUsuario(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={carregando}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    setMostrarSenha(
                                                        (prev) => !prev
                                                    )
                                                }
                                                edge="end"
                                                tabIndex={-1}
                                            >
                                                {mostrarSenha ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="button"
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleLogin}
                            disabled={carregando}
                            sx={{
                                py: 1.4,
                                borderRadius: 2,
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                            }}
                        >
                            {carregando ? (
                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />
                            ) : (
                                "Entrar"
                            )}
                        </Button>

                    </Box>

                </Box>

                <Box
                    sx={(theme) => ({
                        width: "50%",
                        backgroundColor: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        [theme.breakpoints.down("md")]: {
                            display: "none",
                        },
                    })}
                >

                    {/* 
                        A imagem será colocada aqui depois.

                        Exemplo:

                        <Box
                            component="img"
                            src={imagemLogin}
                            alt="LogSensei"
                            sx={{
                                width: "80%",
                                maxWidth: 500,
                            }}
                        />
                    */}

                </Box>

            </Paper>

        </Box>
    );
}

export default Login;