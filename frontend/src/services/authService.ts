import api from "./api";

async function login(nomeUsuario: string, senhaUsuario: string) {

    // Faz uma requisição com os dados de login
    const response = await api.post("/auth/login", {
        nomeUsuario,
        senhaUsuario,
    });

    // Salva os dados do usuário no navegador
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("idUsuario", response.data.idUsuario);
    localStorage.setItem("nomeUsuario", response.data.nomeUsuario);

    return response.data;
}

export { login };