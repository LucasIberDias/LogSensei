import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import type { Carga } from "../../types/carga";

import { listarCargas } from "../../services/cargasService";

import ListaCargas from "./ListaCargas";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";

function Cargas() {

    const [cargas, setCargas] = useState<Carga[]>([]);

    useEffect(() => {
        carregarCargas();
    }, []);

    async function carregarCargas() {

        try {

            const dados = await listarCargas();

            setCargas(dados);

        } catch (erro) {

            console.error("Erro ao carregar cargas:", erro);

        }

    }

    return (

        <Box>

            <Header />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    marginLeft: {
                        xs: 0,
                        md: "240px",
                    },
                    padding: 3,
                    paddingTop: 10,
                }}
            >

                <PageHeader
                    title="Cargas"
                    description="Visualize e Gerencie as cargas cadastradas"
                />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                        },
                        gap: 3,
                    }}
                >

                    <ListaCargas cargas={cargas} />

                </Box>

            </Box>

        </Box>
    );
}

export default Cargas;