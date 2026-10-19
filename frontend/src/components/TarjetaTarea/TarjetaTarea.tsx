import { Badge, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Tarea } from "../../types/Tarea";
import { colorPorPrioridad, formatearFecha } from "../../utils/formato";

type Props = {
  tarea: Tarea;
  onCompletar: (tarea: Tarea) => void;
  onReabrir: (tarea: Tarea) => void;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (tarea: Tarea) => void;
};

const TarjetaTarea = ({
  tarea,
  onCompletar,
  onReabrir,
  onEditar,
  onEliminar,
}: Props) => {
  return (
    <Card className={tarea.completada ? "h-100 border-success" : "h-100"}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <Card.Title className="mb-0">
            <Link to={`/tareas/${tarea._id}`} className="text-decoration-none">
              {tarea.titulo}
            </Link>
          </Card.Title>
          <Badge bg={colorPorPrioridad[tarea.prioridad]}>{tarea.prioridad}</Badge>
        </div>

        {tarea.descripcion && (
          <Card.Text className="text-secondary">{tarea.descripcion}</Card.Text>
        )}

        <Badge bg={tarea.completada ? "success" : "secondary"}>
          {tarea.completada ? "Completada" : "Pendiente"}
        </Badge>

        {tarea.fechaLimite && (
          <small className="text-secondary d-block mt-2">
            Vence el {formatearFecha(tarea.fechaLimite)}
          </small>
        )}

        {tarea.etiquetas.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-2">
            {tarea.etiquetas.map((etiqueta, indice) => (
              <Badge key={`${etiqueta}-${indice}`} pill bg="info">
                {etiqueta}
              </Badge>
            ))}
          </div>
        )}
      </Card.Body>

      <Card.Footer className="bg-transparent d-flex flex-wrap gap-2">
        {tarea.completada ? (
          <Button size="sm" variant="outline-secondary" onClick={() => onReabrir(tarea)}>
            Reabrir
          </Button>
        ) : (
          <Button size="sm" variant="outline-success" onClick={() => onCompletar(tarea)}>
            Completar
          </Button>
        )}
        <Button size="sm" variant="outline-primary" onClick={() => onEditar(tarea)}>
          Editar
        </Button>
        <Button size="sm" variant="outline-danger" onClick={() => onEliminar(tarea)}>
          Eliminar
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default TarjetaTarea;
