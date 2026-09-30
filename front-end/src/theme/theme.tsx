import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#006B45",
            dark: "#004D32",
            light: "#0A8F5A",
        },

        secondary: {
            main: "#A8E6C1",
            dark: "#7FD4A0",
            light: "#D9F5E4",
        },

        background: {
            default: "#F4F6F5",
            paper: "#FFFFFF",
        },

        text: {
            primary: "#12352A",
            secondary: "#52645D",
        },

        success: {
            main: "#168F5A",
        },

        warning: {
            main: "#E7A51A",
        },

        error: {
            main: "#D64545",
        },
    },
});