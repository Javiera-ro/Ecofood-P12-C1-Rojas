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
//import RutaEmpresa from "../components/RutaEmpresa";
import RegistroEmpresa from "../pages/auth/RegistroEmpresa";
//import RegistroEmpresa from "../pages/auth/RegistroEmpresa";
import HomeCliente from "../pages/cliente/HomeCliente";
import VerProducto from "../pages/cliente/VerProducto";
import MisPedidos from "../pages/cliente/MisPedidos";
import EditarPerfil from "../pages/cliente/EditarPerfil";
import SolicitudesEmpresa from "../pages/admin/Empresas/SolicitudesEmpresa";
import DashboardEmpresa from "../pages/admin/Empresas/DashboardEmpresas";

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

        <Route path="/empresas" element={
            <ProtectedByRole allowed={["empresa"]}>
                <AdminLayout />
            </ProtectedByRole>}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashboardEmpresa />} />
            <Route path="perfil" element={<PerfilEmpresa />} />
            <Route path="productos" element={<ProductosEmpresa />} />
            <Route path="solicitudes" element={<SolicitudesEmpresa />} />
        </Route>

        <Route path="/home" element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>} />
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />
        <Route path="/cliente" element={<HomeCliente />} />
        <Route path="/cliente/productos" element={<VerProducto />} />
        <Route path="/cliente/mis-pedidos" element={<MisPedidos />} />
        <Route path="/cliente/editar-perfil" element={<EditarPerfil />} />
        <Route path="/cliente/mis-solicitudes" element={<MisPedidos />} />
    </Routes>
    );
}