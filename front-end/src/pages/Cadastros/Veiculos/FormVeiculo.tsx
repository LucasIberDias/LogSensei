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

import { cadastrarVeiculo } from "../../../services/veiculosService";

interface FormVeiculoProps {
    abrir: boolean;
    fechar: () => void;
}

function FormVeiculo({ abrir, fechar }: FormVeiculoProps) {

    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [tipoVeiculo, setTipoVeiculo] = useState("");
    const [capacidadeVeiculo, setCapacidadeVeiculo] = useState("");

    const [erro, setErro] = useState("");

    async function cadastrarNovoVeiculo() {

        setErro("");

        try {

            await cadastrarVeiculo(placaVeiculo.toUpperCase(), tipoVeiculo.toUpperCase(), Number(capacidadeVeiculo));

            fechar();

        } catch (error: any) {

            console.error("Erro ao cadastrar veículo:", error);

            if (error.response?.status === 403) {

                setErro("Você não tem permissão para cadastrar veículos.");

            } else {

                setErro("Não foi possível cadastrar o veículo.");

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
                Novo veículo
            </DialogTitle>

            <DialogContent>

                {erro && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Placa do veículo"
                    margin="normal"
                    value={placaVeiculo}
                    onChange={(event) =>
                        setPlacaVeiculo(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Tipo do veículo"
                    margin="normal"
                    value={tipoVeiculo}
                    onChange={(event) =>
                        setTipoVeiculo(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Capacidade do veículo"
                    margin="normal"
                    type="number"
                    value={capacidadeVeiculo}
                    onChange={(event) =>
                        setCapacidadeVeiculo(event.target.value)
                    }
                />

            </DialogContent>

            <DialogActions>

                <Button onClick={fechar}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={cadastrarNovoVeiculo}
                >
                    Salvar
                </Button>

            </DialogActions>

        </Dialog>
    );
}

export default FormVeiculo;