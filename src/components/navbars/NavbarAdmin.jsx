import { Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { cerrarSesionDirecto } from "../CerrarSesion"; // <-- debe exportarse desde ahí

export default function NavbarAdmin() {
  return (
    <Navbar expand="lg" bg="success" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">EcoFood - Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar" />
        <Navbar.Collapse id="admin-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/admin/empresas">Empresas</Nav.Link>
            <Nav.Link as={Link} to="/admin/clientes">Clientes</Nav.Link>
            <Nav.Link as={Link} to="/admin/reportes">Reportes</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Menú" align="end" id="admin-dropdown">
              <NavDropdown.Item as={Link} to="/home">Inicio</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as="button"
                className="dropdown-item text-start w-100"
                onClick={cerrarSesionDirecto}
              >
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
