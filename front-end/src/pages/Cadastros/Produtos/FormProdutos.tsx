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

import {cadastrarProduto} from "../../../services/produtosService";

interface FormProdutoProps {
    abrir: boolean;
    fechar: () => void;
}

function FormProduto({ abrir, fechar }: FormProdutoProps) {

    const [codigoProduto, setCodigoProduto] = useState("");
    const [nomeProduto, setNomeProduto] = useState("");
    const [medidaProduto, setMedidaProduto] = useState("");
    const [pesoProduto, setPesoProduto] = useState("");
    const [erro, setErro] = useState("");

    async function cadastrarNovoProduto() {

        setErro("");

        try {

            await cadastrarProduto(Number(codigoProduto), nomeProduto, medidaProduto, Number(pesoProduto));

            fechar();

        } catch (error: any) {

            console.error("Erro ao cadastrar produto:", error);

            if (error.response?.status === 403) {
                setErro("Erro ao cadastrar produtos.");
            } else {
                setErro("Não foi possível cadastrar o produto.");
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
                Novo produto
            </DialogTitle>

            <DialogContent>

                {erro && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {erro}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="Código do produto"
                    type="number"
                    margin="normal"
                    value={codigoProduto}
                    onChange={(event) =>
                        setCodigoProduto(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Nome do produto"
                    margin="normal"
                    value={nomeProduto}
                    onChange={(event) =>
                        setNomeProduto(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Medida do produto"
                    margin="normal"
                    value={medidaProduto}
                    onChange={(event) =>
                        setMedidaProduto(event.target.value)
                    }
                />

                <TextField
                    fullWidth
                    label="Peso do produto"
                    type="number"
                    margin="normal"
                    value={pesoProduto}
                    onChange={(event) =>
                        setPesoProduto(event.target.value)
                    }
                />

            </DialogContent>

            <DialogActions>

                <Button onClick={fechar}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={cadastrarNovoProduto}
                >
                    Salvar
                </Button>

            </DialogActions>
        </Dialog>
    );
}

export default FormProduto;