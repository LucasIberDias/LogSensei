import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AssignmentIcon from "@mui/icons-material/Assignment";

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

                <ListItemButton onClick={() => navigate("/")}>
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>

                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/cargas")}>
                    <ListItemIcon>
                        <LocalShippingIcon />
                    </ListItemIcon>

                    <ListItemText primary="Cargas" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/veiculos")}>
                    <ListItemIcon>
                        <DirectionsCarIcon />
                    </ListItemIcon>

                    <ListItemText primary="Veículos" />
                </ListItemButton>

                <ListItemButton
                    onClick={() => navigate("/controle-carregamento")}
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>

                    <ListItemText
                        primary="Controle de Carregamento"
                    />
                </ListItemButton>

            </List>

        </Box>
    );
}

export default Sidebar;