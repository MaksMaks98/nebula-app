import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTema } from "../../hooks/useTema";

const BarraNavegacion = () => {
  const { tema, alternarTema } = useTema();
  const siguiente = tema === "oscuro" ? "claro" : "oscuro";

  return (
    <Navbar expand="lg" sticky="top" className="nb-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-semibold">
          🌌 <span className="nb-texto-gradiente">Nebula</span>
        </Navbar.Brand>

        {/* El botón de tema queda fuera del menú colapsable: siempre visible */}
        <div className="d-flex align-items-center gap-2 order-lg-last ms-lg-3">
          <button
            type="button"
            className="nb-boton-tema"
            onClick={alternarTema}
            aria-label={`Cambiar a tema ${siguiente}`}
            title={`Cambiar a tema ${siguiente}`}
          >
            <span aria-hidden="true">{tema === "oscuro" ? "☀" : "☾"}</span>
          </button>
          <Navbar.Toggle aria-controls="navbar-principal" />
        </div>

        <Navbar.Collapse id="navbar-principal">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/tareas">
              Tareas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;
