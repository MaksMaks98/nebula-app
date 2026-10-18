import { Modal, Button } from "react-bootstrap";

type Props = {
  mostrar: boolean;
  titulo: string;
  mensaje: string;
  error: string | null;
  onCancelar: () => void;
  onConfirmar: () => void;
};

const ModalConfirmar = ({
  mostrar,
  titulo,
  mensaje,
  error,
  onCancelar,
  onConfirmar,
}: Props) => {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensaje}
        {error && <p className="text-danger mt-3 mb-0">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmar;
