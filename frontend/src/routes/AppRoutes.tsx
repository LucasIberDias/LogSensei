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

function AppRoutes() {

    const token = localStorage.getItem("token");

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

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;