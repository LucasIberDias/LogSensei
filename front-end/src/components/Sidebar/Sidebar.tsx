import {
    Box,
    List,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBoxIcon from "@mui/icons-material/AddBox";

import SidebarItem from "./SidebarItem";

function Sidebar() {

    return (
        <Box
            sx={{
                width: 240,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 64,
                backgroundColor: "primary.main",
                color: "white",
            }}
        >
            <List>

                <SidebarItem
                    icon={<DashboardIcon />}
                    text="Dashboard"
                    path="/"
                />

                <SidebarItem
                    icon={<AssignmentIcon />}
                    text="Ordem"
                    path="/ordem"
                />

                <SidebarItem
                    icon={<LocalShippingIcon />}
                    text="Cargas"
                    path="/cargas"
                />

                <SidebarItem
                    icon={<FactCheckIcon />}
                    text="Controle"
                    path="/controle-carregamento"
                />

                <SidebarItem
                    icon={<AddBoxIcon />}
                    text="Cadastros"
                    path="/cadastros"
                />

            </List>
        </Box>
    );
}

export default Sidebar;