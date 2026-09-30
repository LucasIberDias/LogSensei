import { Box} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import CardCadastro from "../../components/Cards/CardCadastros";
import PageHeader from "../../components/PageHeader/PageHeader";

function Cadastros() {
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

                    <CardCadastro
                        title="Usuários"
                        description="Controle de Usuários"
                        icon={<PersonAddIcon />}
                    />

                </Box>

            </Box>

        </Box>
    );
}

export default Cadastros;