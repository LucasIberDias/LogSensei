import { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import {
    buscarCargos,
    cadastrarUsuario
} from "../../../services/usuariosService";

interface FormUsuarioProps {
    abrir: boolean;
    fechar: () => void;
}

function FormUsuario({ abrir, fechar }: FormUsuarioProps) {

    const [nomeUsuario, setNomeUsuario] = useState("");
    const [senhaUsuario, setSenhaUsuario] = useState("");
    const [cargos, setCargos] = useState<string[]>([]);
    const [cargo, setCargo] = useState("");
    const [erro, setErro] = useState("");

    const idUsuario = Number(localStorage.getItem("idUsuario"));

    useEffect(() => {
        if (!abrir) return;

        setErro("");

        async function carregarCargos() {
            try {
                const resposta = await buscarCargos();
                setCargos(resposta);
            } catch (error) {
                console.error("Erro ao buscar cargos:", error);
                setErro("Não foi possível carregar os cargos.");
            }
        }

        carregarCargos();
    }, [abrir]);

    async function cadastrarNovoUsuario() {

        setErro("");

        try {

            await cadastrarUsuario(
                nomeUsuario.toUpperCase(),
                senhaUsuario,
                cargo.toUpperCase(),
                idUsuario
            );

            fechar();

        } catch (error: any) {

            console.error("Erro ao cadastrar usuário:", error);

            if (error.response?.status === 403) {
                setErro("Erro ao cadastrar usuários.");
            } else {
                setErro("Não foi possível cadastrar o usuário.");
            }
        }
    }

    return (
        <Dialog
            open={abrir}
            onClose={fechar}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Novo usuário
            </DialogTitle>

            <DialogContent>

                {erro && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Nome de usuário"
                    margin="normal"
                    value={nomeUsuario}
                    onChange={(event) =>
                        setNomeUsuario(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    margin="normal"
                    value={senhaUsuario}
                    onChange={(event) =>
                        setSenhaUsuario(event.target.value)
                    }
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Cargo</InputLabel>

                    <Select
                        value={cargo}
                        label="Cargo"
                        onChange={(event) =>
                            setCargo(event.target.value)
                        }
                    >
                        {cargos.map((cargo) => (
                            <MenuItem
                                key={cargo}
                                value={cargo}
                            >
                                {cargo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </DialogContent>

            <DialogActions>

                <Button onClick={fechar}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={cadastrarNovoUsuario}
                >
                    Salvar
                </Button>

            </DialogActions>
        </Dialog>
    );
}

export default FormUsuario;