import { Row, Col, Form } from "react-bootstrap";
import type { FiltrosTareas } from "../../types/Tarea";

type Props = {
  busqueda: string;
  filtros: FiltrosTareas;
  onCambiarBusqueda: (valor: string) => void;
  onCambiarFiltro: (campo: keyof FiltrosTareas, valor: string) => void;
};

const BarraFiltros = ({
  busqueda,
  filtros,
  onCambiarBusqueda,
  onCambiarFiltro,
}: Props) => {
  return (
    <Form onSubmit={(evento) => evento.preventDefault()} className="mb-4">
      <Row className="g-2">
        <Col md={5}>
          <Form.Control
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(evento) => onCambiarBusqueda(evento.target.value)}
          />
        </Col>
        <Col sm={6} md={4}>
          <Form.Select
            value={filtros.prioridad}
            onChange={(evento) => onCambiarFiltro("prioridad", evento.target.value)}
          >
            <option value="">Todas las prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </Form.Select>
        </Col>
        <Col sm={6} md={3}>
          <Form.Control
            type="number"
            min={1}
            placeholder="Vencen en (días)"
            value={filtros.dias}
            onChange={(evento) => onCambiarFiltro("dias", evento.target.value)}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default BarraFiltros;
