import { Alert } from "@mui/material";

interface ErroBoxProps {
    mensagem: string;
}

function ErroBox({ mensagem }: ErroBoxProps) {
    return (
        <Alert
            severity="error"
            sx={{
                marginTop: 2,
            }}
        >
            {mensagem}
        </Alert>
    );
}

export default ErroBox;
