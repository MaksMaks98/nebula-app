import { useState, useEffect } from "react";
import { Container, Card, Badge, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  obtenerTareaPorId,
  actualizarTarea,
  eliminarTarea,
  completarTarea,
  reabrirTarea,
} from "../services/tareaService";
import type { Tarea, TareaFormulario } from "../types/Tarea";
import { colorPorPrioridad, formatearFecha } from "../utils/formato";
import ModalTarea from "../components/ModalTarea/ModalTarea";
import ModalConfirmar from "../components/ModalConfirmar/ModalConfirmar";

const PaginaDetalleTarea = () => {
  // Lee el :id de la URL /tareas/:id
  const { id } = useParams();
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

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
  const guardarTarea = async (valores: TareaFormulario) => {
    if (!tarea) return;
    setTarea(await actualizarTarea(tarea._id, valores));
    setMostrarModal(false);
  };

  const confirmarEliminar = async () => {
    if (!tarea) return;
    try {
      await eliminarTarea(tarea._id);
      navigate("/tareas");
    } catch {
      setErrorEliminar("No se pudo eliminar la tarea");
    }
  };

  const cambiarEstado = async (accion: typeof completarTarea) => {
    if (!tarea) return;
    try {
      setTarea(await accion(tarea._id));
      setErrorAccion(null);
    } catch {
      setErrorAccion("No se pudo actualizar la tarea");
    }
  };

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
              <Badge bg={colorPorPrioridad[tarea.prioridad]}>
                {tarea.prioridad}
              </Badge>
            </div>
            <Badge bg={tarea.completada ? "success" : "secondary"}>
              {tarea.completada ? "Completada" : "Pendiente"}
            </Badge>
            <Card.Text className="mt-3">
              {tarea.descripcion || "Sin descripción"}
            </Card.Text>
            <p className="mb-1">
              <strong>Fecha límite:</strong>{" "}
              {tarea.fechaLimite
                ? formatearFecha(tarea.fechaLimite)
                : "Sin fecha"}
            </p>
            <p className="mb-1">
              <strong>Etiquetas:</strong>{" "}
              {tarea.etiquetas.length > 0
                ? tarea.etiquetas.join(", ")
                : "Ninguna"}
            </p>
            <small className="text-secondary">
              Creada el {new Date(tarea.createdAt).toLocaleString("es-AR")}
            </small>
            <div className="d-flex flex-wrap gap-2 mt-3">
              {tarea.completada ? (
                <Button
                  variant="outline-secondary"
                  onClick={() => cambiarEstado(reabrirTarea)}
                >
                  Reabrir
                </Button>
              ) : (
                <Button
                  variant="outline-success"
                  onClick={() => cambiarEstado(completarTarea)}
                >
                  Completar
                </Button>
              )}
              <Button
                variant="outline-primary"
                onClick={() => setMostrarModal(true)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => setMostrarConfirmar(true)}
              >
                Eliminar
              </Button>
            </div>
            {errorAccion && (
              <p className="text-danger mt-2 mb-0">{errorAccion}</p>
            )}
          </Card.Body>
        </Card>
      )}

      {tarea && (
        <>
          <ModalTarea
            mostrar={mostrarModal}
            tarea={tarea}
            onCerrar={() => setMostrarModal(false)}
            onGuardar={guardarTarea}
          />
          <ModalConfirmar
            mostrar={mostrarConfirmar}
            titulo="Eliminar tarea"
            mensaje={`¿Seguro que querés eliminar "${tarea.titulo}"?`}
            error={errorEliminar}
            onCancelar={() => {
              setMostrarConfirmar(false);
              setErrorEliminar(null);
            }}
            onConfirmar={confirmarEliminar}
          />
        </>
      )}
    </Container>
  );
};

export default PaginaDetalleTarea;
