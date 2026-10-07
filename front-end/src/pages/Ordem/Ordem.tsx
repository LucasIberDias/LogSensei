import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Divider,
    Alert,
} from "@mui/material";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";

import type { Item } from "../../types/item";
import type { Cliente } from "../../types/cliente";
import type { Veiculo } from "../../types/veiculo";

function Ordem() {
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
                    title="Ordem de Carregamento"
                    description="Preencha as informações abaixo para criar uma nova ordem de carregamento "
                />

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



                </Box>

            </Box>

        </Box>
    );
}

export default Ordem;