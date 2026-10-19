import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import {
  buscarTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
  completarTarea,
  reabrirTarea,
} from "../../services/tareaService";
import type { FiltrosTareas, Tarea, TareaFormulario } from "../../types/Tarea";
import BarraFiltros from "../BarraFiltros/BarraFiltros";
import TarjetaTarea from "../TarjetaTarea/TarjetaTarea";
import ModalTarea from "../ModalTarea/ModalTarea";
import ModalConfirmar from "../ModalConfirmar/ModalConfirmar";

const ListaTareas = () => {
  // Lectura: los datos y sus tres estados
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros: los de la API y la búsqueda por texto (que se resuelve acá)
  const [filtros, setFiltros] = useState<FiltrosTareas>({ prioridad: "", dias: "" });
  const [busqueda, setBusqueda] = useState("");

  // Alta y modificación: un mismo modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tareaEditada, setTareaEditada] = useState<Tarea | null>(null);

  // Baja: qué tarea espera confirmación y si falló el DELETE
  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null);

  // Acciones de negocio (completar / reabrir)
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

    // Un solo efecto para la carga inicial y para cada cambio de filtros, con debounce
  useEffect(() => {
    let ignorar = false;

    const temporizador = setTimeout(() => {
      setCargando(true);
      setError(null);
      buscarTareas(filtros)
        .then((resultado) => {
          if (!ignorar) setTareas(resultado);
        })
        .catch(() => {
          if (!ignorar) setError("No se pudieron cargar las tareas");
        })
        .finally(() => {
          if (!ignorar) setCargando(false);
        });
    }, 400);

    return () => {
      ignorar = true;
      clearTimeout(temporizador);
    };
  }, [filtros]);
  // Valor derivado: se calcula en cada render, sin useEffect ni estado propio
  const tareasVisibles = tareas.filter((tarea) =>
    tarea.titulo.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  const cambiarFiltro = (campo: keyof FiltrosTareas, valor: string) => {
    setFiltros((anteriores) => ({ ...anteriores, [campo]: valor }));
  };

  // Editar, completar y reabrir devuelven la tarea actualizada: se reemplaza por _id
  const reemplazarTarea = (actualizada: Tarea) => {
    setTareas((anteriores) =>
      anteriores.map((tarea) =>
        tarea._id === actualizada._id ? actualizada : tarea,
      ),
    );
  };

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
    const completar = async (tarea: Tarea) => {
    try {
      reemplazarTarea(await completarTarea(tarea._id));
      setErrorAccion(null);
    } catch {
      setErrorAccion("No se pudo completar la tarea");
    }
  };

  const reabrir = async (tarea: Tarea) => {
    try {
      reemplazarTarea(await reabrirTarea(tarea._id));
      setErrorAccion(null);
    } catch {
      setErrorAccion("No se pudo reabrir la tarea");
    }
  };

   return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Mis tareas</h2>
        <Button onClick={abrirAgregar}>Nueva tarea</Button>
      </div>

      <BarraFiltros
        busqueda={busqueda}
        filtros={filtros}
        onCambiarBusqueda={setBusqueda}
        onCambiarFiltro={cambiarFiltro}
      />

      {errorAccion && <p className="text-danger">{errorAccion}</p>}
      {cargando && <p>Cargando...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!cargando && !error && tareasVisibles.length === 0 && (
        <p className="text-secondary">No hay tareas para mostrar.</p>
      )}

      {!cargando && !error && (
        <Row className="g-3">
          {tareasVisibles.map((tarea) => (
            <Col md={6} lg={4} key={tarea._id}>
              <TarjetaTarea
                tarea={tarea}
                onCompletar={completar}
                onReabrir={reabrir}
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
