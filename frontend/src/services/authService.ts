import api from "./api";

async function login(nomeUsuario: string, senhaUsuario: string) {
    const response = await api.post("/auth/login", {
        nomeUsuario,
        senhaUsuario,
    }
    );

    return response.data;
}

export { login };