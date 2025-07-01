import { Routes, Route, Navigate} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from '../pages/RecuperarContraseña';
import AdminLayout from "../components/admin/layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedByRole from "./ProtectedByRole";
import Empresas from "../pages/admin/Empresas/Empresas";
import Clientes from "../pages/admin/clientes/Clientes";
import Administradores from "../pages/admin/administradores/Administradores";
import Reportes from "../pages/admin/Reportes/Reportes";
import PerfilEmpresa from "../pages/admin/Empresas/PerfilEmpresa";
import ProductosEmpresa from "../pages/admin/Empresas/ProductosEmpresa";

export default function AppRouter() {
    return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />
        <Route path="/admin" element={
            <ProtectedByRole allowed={["admin"]}>
                <AdminLayout />
            </ProtectedByRole>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="administradores" element={<Administradores />} />
            <Route path="reportes" element={<Reportes />} />
        </Route>

        <Route path="/home" element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>} />
        <Route path="/empresas/perfil" element={<PerfilEmpresa />} />
        <Route path="/empresas/productos" element={<ProductosEmpresa />} />
    </Routes>
    );
}