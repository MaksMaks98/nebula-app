import { useState, useEffect } from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { obtenerTareas } from "../../services/tareaService";
import type { Tarea } from "../../types/Tarea";

const ListaTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    obtenerTareas()
      .then(setTareas)
      .catch(() => setError("No se pudieron cargar las tareas"))
      .finally(() => setCargando(false));
  }, []);

    return (
    <>
      <h2 className="mb-3">Mis tareas</h2>
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!cargando && !error && (
        <Row className="g-3">
          {tareas.map((tarea) => (
            <Col md={6} lg={4} key={tarea._id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{tarea.titulo}</Card.Title>
                  {tarea.descripcion && (
                    <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
                  )}
                  <Badge bg="info">{tarea.prioridad}</Badge>{" "}
                  <Badge bg={tarea.completada ? "success" : "secondary"}>
                    {tarea.completada ? "Completada" : "Pendiente"}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ListaTareas;
