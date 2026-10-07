import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionBoxProps {
    titulo: string;
    descricao?: string;
    icone?: ReactNode;
    children: ReactNode;
}

function SectionBox({
    titulo,
    descricao,
    icone,
    children,
}: SectionBoxProps) {

    return (
        <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",

                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,

                overflow: "hidden",

                boxShadow: 1,

                backgroundColor: "background.paper",
            }}
        >

            <Box
                sx={{
                    backgroundColor: "secondary.light",

                    padding: "10px 18px",

                    display: "flex",
                    alignItems: "center",

                    gap: 1.2,
                }}
            >

                {icone && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",

                            color: "primary.main",

                            "& svg": {
                                fontSize: 23,
                            },
                        }}
                    >
                        {icone}
                    </Box>
                )}

                <Box>

                    <Typography
                        sx={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "primary.main",
                            lineHeight: 1.2,
                        }}
                    >
                        {titulo}
                    </Typography>

                    {descricao && (
                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "text.secondary",
                                marginTop: "2px",
                            }}
                        >
                            {descricao}
                        </Typography>
                    )}

                </Box>

            </Box>

            <Box
                sx={{
                    width: "100%",
                    boxSizing: "border-box",

                    backgroundColor: "background.paper",

                    padding: 2.5,
                }}
            >
                {children}
            </Box>

        </Box>
    );
}

export default SectionBox;