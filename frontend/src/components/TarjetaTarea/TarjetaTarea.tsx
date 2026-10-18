import { Badge, Button, Card } from "react-bootstrap";
import type { Tarea } from "../../types/Tarea";

type Props = {
  tarea: Tarea;
  onEditar: (tarea: Tarea) => void;
  onEliminar: (tarea: Tarea) => void;
};

const TarjetaTarea = ({ tarea, onEditar, onEliminar }: Props) => {
  return (
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
      <Card.Footer className="bg-transparent d-flex gap-2">
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
