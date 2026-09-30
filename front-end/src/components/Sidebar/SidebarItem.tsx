import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    path: string;
}

function SidebarItem({ icon, text, path }: SidebarItemProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const selected = location.pathname === path;

    return (
        <ListItemButton
            selected={selected}
            onClick={() => navigate(path)}
            sx={{
                "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "white",
                },

                "&.Mui-selected:hover": {
                    backgroundColor: "primary.light",
                },

                "&:hover": {
                    backgroundColor: "primary.light",
                },
            }}
        >
            <ListItemIcon
                sx={{
                    color: "inherit",
                }}
            >
                {icon}
            </ListItemIcon>

            <ListItemText primary={text} />
        </ListItemButton>
    );
}

export default SidebarItem;