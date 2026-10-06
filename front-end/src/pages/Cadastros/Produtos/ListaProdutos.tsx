import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { listarProdutos } from "../../../services/produtosService";

import type { Produto } from "../../../types/produto";

function ListaProdutos() {

    const [produtos, setProdutos] = useState<Produto[]>([]);

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function carregarProdutos() {

        try {

            const produtos = await listarProdutos();

            setProdutos(produtos);

        } catch (error) {

            console.error("Erro ao listar produtos:", error);

        }
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(3, 1fr)",
                },
                gap: 3,
            }}
        >

            {produtos.map((produto) => (

                <Card key={produto.codigoProduto}>

                    <CardContent>

                        <Typography variant="h6">
                            {produto.nomeProduto}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Código: {produto.codigoProduto}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Medida: {produto.medidaProduto}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Peso: {produto.pesoProduto}
                        </Typography>

                    </CardContent>

                </Card>

            ))}

        </Box>
    );
}

export default ListaProdutos;