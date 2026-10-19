import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const PaginaInicio = () => {
  return (
    <section className="py-5">
      <Container className="py-5">
        <Row className="align-items-center g-4">
          <Col md={7}>
            <h1 className="display-5 fw-bold">
              <span className="nb-texto-gradiente">Nebula</span>
            </h1>
            <p className="lead text-secondary">
              Como en una nebulosa, cada tarea nace, evoluciona y se completa.
              Organizá las tuyas por prioridad y no te pierdas ningún vencimiento.
            </p>
            <Link to="/tareas" className="btn btn-primary btn-lg">
              Ver mis tareas
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaginaInicio;
