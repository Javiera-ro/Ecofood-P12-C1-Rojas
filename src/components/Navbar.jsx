import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import Swal from "sweetalert2";

export default function Navbar() {
  const cerrarSesion = async () => {
    await signOut(auth);
    Swal.fire("Sesión cerrada", "", "info");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/empresas/productos">EcoFood</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link className="nav-link" to="/empresas/productos">
                Productos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/empresas/perfil">
                Perfil Empresa
              </Link>
            </li>

            {/* ... */}

          </ul>

          <button className="btn btn-outline-light" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
