import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecuperarContrasena from './pages/RecuperarContrasena';
import ProductosEmpresa from './pages/empresas/ProductosEmpresa';
import PerfilEmpresa from './pages/empresas/PerfilEmpresa';
import RegistroEmpresa from './pages/auth/RegistroEmpresa';


function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/recuperar" element={<RecuperarContrasena />} />
                <Route path="/home" element={<Home />} />
                </Routes>
        </BrowserRouter>
    );
}

export default AppRouter