import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import CerrarSesion from "../../CerrarSesion";
import { Link } from "react-router-dom";

export default function NavAdmin() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid">
        <span className="navbar-brand">Ecofood {user?.email}</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdmin"
          aria-controls="navbarAdmin"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarAdmin">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/empresas" className="nav-link">
                Empresas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/reportes" className="nav-link">
                Reportes
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <CerrarSesion />
          </div>
        </div>
      </div>
    </nav>
  );
}
