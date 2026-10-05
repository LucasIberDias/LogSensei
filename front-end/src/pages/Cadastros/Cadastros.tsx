import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { temPermissao } from "../../services/permissionService";



import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import CardCadastro from "../../components/Cards/CardCadastros";
import PageHeader from "../../components/PageHeader/PageHeader";

function Cadastros() {
    const navigate = useNavigate();

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
                    title="Cadastros"
                    description="Gerencie os cadastros do sistema"
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

                    {(temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR")) && (
                        <CardCadastro
                            title="Usuários"
                            description="Controle de Usuários"
                            icon={<PersonAddIcon />}
                            onClick={() => navigate("/usuarios")}
                        />
                    )}

                    {(temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR") || temPermissao("ANALISTA")) && (
                        <CardCadastro
                            title="Clientes"
                            description="Controle de Clientes"
                            icon={<GroupsIcon />}
                            onClick={() => navigate("/clientes")}
                        />
                    )}

                </Box>

            </Box>

        </Box>
    );
}

export default Cadastros;