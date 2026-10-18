import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../../services/tareaService";
import type { Tarea, TareaFormulario } from "../../types/Tarea";
import TarjetaTarea from "../TarjetaTarea/TarjetaTarea";
import ModalTarea from "../ModalTarea/ModalTarea";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";

const ListaTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditada, setTareaEditada] = useState<Tarea | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  useEffect(() => {
    obtenerTareas()
      .then(setTareas)
      .catch(() => setError("No se pudieron cargar las tareas"))
      .finally(() => setCargando(false));
  }, []);
  const abrirAgregar = () => {
    setTareaEditada(null);
    setMostrarModal(true);
  };

  const abrirEditar = (tarea: Tarea) => {
    setTareaEditada(tarea);
    setMostrarModal(true);
  };

  // Si falla, el error sube al onSubmit de Formik, que lo muestra en el modal
  const guardarTarea = async (valores: TareaFormulario) => {
    if (tareaEditada) {
      const actualizada = await actualizarTarea(tareaEditada._id, valores);
      setTareas((anteriores) =>
        anteriores.map((tarea) =>
          tarea._id === actualizada._id ? actualizada : tarea,
        ),
      );
    } else {
      const nueva = await crearTarea(valores);
      setTareas((anteriores) => [...anteriores, nueva]);
    }
    setMostrarModal(false);
  };
  const cerrarEliminar = () => {
    setTareaAEliminar(null);
    setErrorEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!tareaAEliminar) return;
    try {
      await eliminarTarea(tareaAEliminar._id);
      setTareas((anteriores) =>
        anteriores.filter((tarea) => tarea._id !== tareaAEliminar._id),
      );
      cerrarEliminar();
    } catch {
      setErrorEliminar("No se pudo eliminar la tarea");
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Mis tareas</h2>
        <Button onClick={abrirAgregar}>Nueva tarea</Button>
      </div>

      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!cargando && !error && (
        <Row className="g-3">
          {tareas.map((tarea) => (
            <Col md={6} lg={4} key={tarea._id}>
              <TarjetaTarea
                tarea={tarea}
                onEditar={abrirEditar}
                onEliminar={setTareaAEliminar}
              />
            </Col>
          ))}
        </Row>
      )}

      <ModalTarea
        mostrar={mostrarModal}
        tarea={tareaEditada}
        onCerrar={() => setMostrarModal(false)}
        onGuardar={guardarTarea}
      />

      <ModalConfirmar
        mostrar={!!tareaAEliminar}
        titulo="Eliminar tarea"
        mensaje={`¿Seguro que querés eliminar "${tareaAEliminar?.titulo ?? ""}"?`}
        error={errorEliminar}
        onCancelar={cerrarEliminar}
        onConfirmar={confirmarEliminar}
      />
    </>
  );
};

export default ListaTareas;
