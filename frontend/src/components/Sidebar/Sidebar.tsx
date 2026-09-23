import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    return (

        <Box
            sx={{
                width: 240,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 64,
                borderRight: "1px solid #ddd",
                backgroundColor: "#fff",
            }}
        >

            <List>

                {/* Dashboard */}

                <ListItemButton
                    onClick={() => navigate("/")}
                >
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Dashboard"
                    />
                </ListItemButton>


                {/* Ordem */}

                <ListItemButton
                    onClick={() => navigate("/ordem")}
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Ordem"
                    />
                </ListItemButton>


                {/* Cargas */}

                <ListItemButton
                    onClick={() => navigate("/cargas")}
                >
                    <ListItemIcon>
                        <LocalShippingIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Cargas"
                    />
                </ListItemButton>


                {/* Controle de Carregamento */}

                <ListItemButton
                    onClick={() => navigate("/controle-carregamento")}
                >
                    <ListItemIcon>
                        <FactCheckIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Controle"
                    />
                </ListItemButton>

            </List>

        </Box>
    );
}

export default Sidebar;