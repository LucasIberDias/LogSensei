import { Box } from "@mui/material";

import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import PageHeader from "../../../components/PageHeader/PageHeader";

function Usuarios() {
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
                    title="Usuarios"
                    description="Gerencie os usuarios do sistema"
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

export default Usuarios;