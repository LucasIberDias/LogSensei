import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Ordem from "../pages/Ordem/Ordem";
import Cargas from "../pages/Cargas/Cargas";
import Cadastros from "../pages/Cadastros/Cadastros";
import Usuarios from "../pages/Cadastros/Usuarios/Usuarios";
import Clientes from "../pages/Cadastros/Clientes/Clientes";
import Produtos from "../pages/Cadastros/Produtos/Produtos";
import Veiculos from "../pages/Cadastros/Veiculos/Veiculos";


import { temPermissao } from "../services/permissionService";

function AppRoutes() {
    const token = localStorage.getItem("token");

    const podeAcessarUsuarios = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR");
    const podeAcessarPadrao = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR") || temPermissao("ANALISTA");

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        token
                            ? <Dashboard />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/ordem"
                    element={
                        token
                            ? <Ordem />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/cargas"
                    element={
                        token
                            ? <Cargas />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/cadastros"
                    element={
                        token
                            ? <Cadastros />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        token && podeAcessarUsuarios
                            ? <Usuarios />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        token && podeAcessarPadrao
                            ? <Clientes />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/produtos"
                    element={
                        token && podeAcessarPadrao
                            ? <Produtos />
                            : <Navigate to="/" replace />
                    }
                />

                <Route
                    path="/veiculos"
                    element={
                        token && podeAcessarPadrao
                            ? <Veiculos />
                            : <Navigate to="/" replace />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;