import { Link } from "react-router-dom";
import NavbarSwitcher from "../../components/NavbarSwitcher";
import { useAuth } from "../../context/AuthContext"; // <-- ESTA LÍNEA FALTABA

export default function HomeCliente() {
  const { userData } = useAuth();

  return (
    <>
      <NavbarSwitcher />
      <div className="container mt-4">
        <h2>¡Hola {userData?.nombre || "Cliente"}! 👋</h2>
        <p>Bienvenido/a a EcoFood. ¿Qué deseas hacer?</p>

        <div className="d-grid gap-3 mt-4">
          <Link to="/cliente/productos" className="btn btn-primary">Ver productos</Link>
          <Link to="/cliente/mis-pedidos" className="btn btn-success">Ver mis solicitudes</Link>
          <Link to="/cliente/editar-perfil" className="btn btn-warning">Editar perfil</Link>
        </div>
      </div>
    </>
  );
}