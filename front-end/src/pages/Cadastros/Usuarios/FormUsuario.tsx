import { useEffect, useState } from "react";

import {
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

import { buscarCargos } from "../../../services/usuariosService";

interface FormUsuarioProps {
    abrir: boolean;
    fechar: () => void;
}

function FormUsuario({ abrir, fechar }: FormUsuarioProps) {

    const [cargos, setCargos] = useState<string[]>([]);
    const [cargo, setCargo] = useState("");

    useEffect(() => {
        if (!abrir) return;

        async function carregarCargos() {
            try {
                const resposta = await buscarCargos();
                setCargos(resposta);
            } catch (error) {
                console.error("Erro ao buscar cargos:", error);
            }
        }

        carregarCargos();
    }, [abrir]);

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

                <TextField
                    fullWidth
                    label="Nome de usuário"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    margin="normal"
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Cargo</InputLabel>

                    <Select
                        value={cargo}
                        label="Cargo"
                        onChange={(event) => setCargo(event.target.value)}
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
                    onClick={fechar}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormUsuario;