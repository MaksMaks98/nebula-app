import { useState, useEffect } from "react";
import { Container, Card, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { obtenerTareaPorId } from "../services/tareaService";
import type { Tarea } from "../types/Tarea";
import { colorPorPrioridad, formatearFecha } from "../utils/formato";

const PaginaDetalleTarea = () => {
  // Lee el :id de la URL /tareas/:id
  const { id } = useParams();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignorar = false;
    obtenerTareaPorId(id)
      .then((resultado) => {
        if (!ignorar) setTarea(resultado);
      })
      .catch(() => {
        if (!ignorar) setError("No se encontró la tarea");
      })
      .finally(() => {
        if (!ignorar) setCargando(false);
      });
    return () => {
      ignorar = true;
    };
  }, [id]);

  return (
    <Container className="py-5">
      <Link to="/tareas" className="btn btn-link px-0 mb-3">
        ← Volver a mis tareas
      </Link>

      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!cargando && !error && tarea && (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start gap-2">
              <Card.Title as="h1" className="h3">
                {tarea.titulo}
              </Card.Title>
              <Badge bg={colorPorPrioridad[tarea.prioridad]}>{tarea.prioridad}</Badge>
            </div>
            <Badge bg={tarea.completada ? "success" : "secondary"}>
              {tarea.completada ? "Completada" : "Pendiente"}
            </Badge>
            <Card.Text className="mt-3">
              {tarea.descripcion || "Sin descripción"}
            </Card.Text>
            <p className="mb-1">
              <strong>Fecha límite:</strong>{" "}
              {tarea.fechaLimite ? formatearFecha(tarea.fechaLimite) : "Sin fecha"}
            </p>
            <p className="mb-1">
              <strong>Etiquetas:</strong>{" "}
              {tarea.etiquetas.length > 0 ? tarea.etiquetas.join(", ") : "Ninguna"}
            </p>
            <small className="text-secondary">
              Creada el {new Date(tarea.createdAt).toLocaleString("es-AR")}
            </small>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default PaginaDetalleTarea;