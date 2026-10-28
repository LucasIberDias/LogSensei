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
import Diario from  "../pages/Diario/Diario";
import Transferencia from "../pages/Transferencia/Transferencia";

import { temPermissao } from "../services/permissionService";

function AppRoutes() {
    const token = localStorage.getItem("token");

    const podeAcessarGeral = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR");
    const podeAcessarPadrao = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR") || temPermissao("ANALISTA");
    const podeAcessarFilial = temPermissao("FILIAL");
    const podeAcessarComum = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR") || temPermissao("ANALISTA") || temPermissao("FILIAL");

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
                        token && podeAcessarComum
                            ? <Ordem />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/cargas"
                    element={
                        token && podeAcessarPadrao
                            ? <Cargas />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/cadastros"
                    element={
                        token && podeAcessarPadrao
                            ? <Cadastros />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        token && podeAcessarGeral
                            ? <Usuarios />
                            : <Navigate to="/login"/>
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        token && podeAcessarPadrao
                            ? <Clientes />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/produtos"
                    element={
                        token && podeAcessarPadrao
                            ? <Produtos />
                            : <Navigate to="/login"/>
                    }
                />

                <Route
                    path="/veiculos"
                    element={
                        token && podeAcessarPadrao
                            ? <Veiculos />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/diario"
                    element={
                        token && podeAcessarFilial
                            ? <Diario />
                            : <Navigate to="/login"/>
                    }
                />

                 <Route
                    path="/transferencia"
                    element={
                        token && podeAcessarFilial
                            ? <Transferencia />
                            : <Navigate to="/" replace />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;