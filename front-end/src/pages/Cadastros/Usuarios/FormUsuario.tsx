import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

interface FormUsuarioProps {
    abrir: boolean;
    fechar: () => void;
}

function FormUsuario({ abrir, fechar }: FormUsuarioProps) {

    return (
        <Dialog
            open={abrir}
            onClose={fechar}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Novo usuário
            </DialogTitle>

            <DialogContent>
                <TextField
                    fullWidth
                    label="Nome de usuário"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Cargo"
                    margin="normal"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={fechar}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={fechar}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FormUsuario;