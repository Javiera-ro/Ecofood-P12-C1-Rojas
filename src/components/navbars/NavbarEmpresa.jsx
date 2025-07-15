import { Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { cerrarSesionDirecto } from "../CerrarSesion";

export default function NavbarEmpresa() {
  return (
    <Navbar expand="lg" bg="success" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">EcoFood - Empresa</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-empresa" />
        <Navbar.Collapse id="navbar-empresa">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/empresas/productos">Productos</Nav.Link>
            <Nav.Link as={Link} to="/empresas/perfil">Perfil</Nav.Link>
            <Nav.Link as={Link} to="/empresas/solicitudes">Solicitudes</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Menú" id="empresa-dropdown">
              <NavDropdown.Item as={Link} to="/home">Inicio</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/empresas/solicitudes">Solicitudes</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as="button" className="dropdown-item text-start w-100" onClick={cerrarSesionDirecto}>
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
