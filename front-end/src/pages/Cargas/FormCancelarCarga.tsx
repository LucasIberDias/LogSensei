import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

interface FormCancelarCargaProps {
    abrir: boolean;
    fechar: () => void;
    cancelar: () => void;
}

function FormCancelarCarga({
    abrir,
    fechar,
    cancelar,
}: FormCancelarCargaProps) {

    return (
        <Dialog
            open={abrir}
            onClose={fechar}
        >
            <DialogTitle>
                Cancelar carga
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Tem certeza que deseja cancelar esta carga?
                </Typography>

                <Typography
                    sx={{
                        marginTop: 1,
                        color: "error.main",
                        fontWeight: 600,
                    }}
                >
                    Essa ação é irreversível.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={fechar}>
                    NÃO
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={cancelar}
                >
                    SIM, CANCELAR
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormCancelarCarga;