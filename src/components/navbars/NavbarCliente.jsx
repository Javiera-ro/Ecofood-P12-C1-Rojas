import { Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { cerrarSesionDirecto } from "../CerrarSesion"; 

export default function NavbarCliente() {
  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/cliente">EcoFood - Cliente</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-cliente" />
        <Navbar.Collapse id="navbar-cliente">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/cliente/productos">Ver Productos</Nav.Link>
            <Nav.Link as={Link} to="/cliente/mis-pedidos">Mis Solicitudes</Nav.Link>
            <Nav.Link as={Link} to="/cliente/editar-perfil">Editar Perfil</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Menú" id="cliente-dropdown">
              <NavDropdown.Item as={Link} to="/cliente">Inicio</NavDropdown.Item>
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
