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
import Diario from "../pages/Diario/Diario";
import Transferencia from "../pages/Transferencia/Transferencia";

import Layout from "../components/Layout/Layout";

import { temPermissao } from "../services/permissionService";

function AppRoutes() {
    const token = localStorage.getItem("token");

    const podeAcessarGeral =
        temPermissao("GERENTE LOGISTICA") ||
        temPermissao("DESENVOLVEDOR");

    const podeAcessarPadrao =
        podeAcessarGeral ||
        temPermissao("ANALISTA");

    const podeAcessarFilial = temPermissao("FILIAL");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    element={
                        token
                            ? <Layout />
                            : <Navigate to="/login" replace />
                    }
                >
                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/ordem"
                        element={
                            podeAcessarPadrao
                                ? <Ordem />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/cargas"
                        element={
                            podeAcessarPadrao
                                ? <Cargas />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/cadastros"
                        element={
                            podeAcessarPadrao
                                ? <Cadastros />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/usuarios"
                        element={
                            podeAcessarGeral
                                ? <Usuarios />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/clientes"
                        element={
                            podeAcessarPadrao
                                ? <Clientes />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/produtos"
                        element={
                            podeAcessarPadrao
                                ? <Produtos />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/veiculos"
                        element={
                            podeAcessarPadrao
                                ? <Veiculos />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/diario"
                        element={
                            podeAcessarFilial
                                ? <Diario />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/transferencia"
                        element={
                            podeAcessarFilial
                                ? <Transferencia />
                                : <Navigate to="/" replace />
                        }
                    />
                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={token ? "/" : "/login"}
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;