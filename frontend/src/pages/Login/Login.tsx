import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { login } from "../../services/authService";

function Login() {

    // Dados que serão passados pelo usuario
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senhaUsuario, setSenhaUsuario] = useState("");

    // Funcao que envia os dados para o Login
    async function handleLogin() {
        try {
            // Chama a função de login e passa os parametros do usuario
            const response = await login(nomeUsuario, senhaUsuario);

            // Mensagem caso de tudo certo
            console.log(response);
        } catch (error) {
            // Mensagem de erro caso o login não funcione
            console.error("Erro ao fazer login:", error);
        }
    }
    return (
        <Box>

            <Typography variant="h4">
                LogSensei
            </Typography>

            <TextField
                label="Usuário"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
            />

            <TextField
                label="Senha"
                type="password"
                value={senhaUsuario}
                onChange={(e) => setSenhaUsuario(e.target.value)}
            />

            <Button
                variant="contained"
                onClick={handleLogin}
            >
                Entrar
            </Button>

        </Box>
    );
}

export default Login;