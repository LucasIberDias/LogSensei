import { useState } from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

import { cadastrarCliente } from "../../../services/clientesService";

interface FormClienteProps {
    abrir: boolean;
    fechar: () => void;
}

function FormCliente({ abrir, fechar }: FormClienteProps) {

    const [codigoCliente, setCodigoCliente] = useState("");
    const [nomeCliente, setNomeCliente] = useState("");
    const [erro, setErro] = useState("");

    async function cadastrarNovoCliente() {

        setErro("");

        try {

            await cadastrarCliente(Number(codigoCliente), nomeCliente.toLowerCase());

            fechar();

        } catch (error: any) {

            console.error("Erro ao cadastrar cliente:", error);

            if (error.response?.status === 403) {
                setErro("Você não tem permissão para cadastrar clientes.");
            } else {
                setErro("Não foi possível cadastrar o cliente.");
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
                Novo cliente
            </DialogTitle>

            <DialogContent>

                {erro && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Código do cliente"
                    margin="normal"
                    type="number"
                    value={codigoCliente}
                    onChange={(event) =>
                        setCodigoCliente(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Nome do cliente"
                    margin="normal"
                    value={nomeCliente}
                    onChange={(event) =>
                        setNomeCliente(event.target.value)
                    }
                />

            </DialogContent>

            <DialogActions>

                <Button onClick={fechar}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={cadastrarNovoCliente}
                >
                    Salvar
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default FormCliente;