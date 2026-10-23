import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerTareas } from "../services/tareaService";
import type { Tarea } from "../types/Tarea";
import FondoNebulosa from "../components/FondoNebulosa/FondoNebulosa";
import MapaEstrellas from "../components/MapaEstrellas/MapaEstrellas";
import "./PaginaInicio.css";

const PaginaInicio = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignorar = false;
    obtenerTareas()
      .then((resultado) => {
        if (!ignorar) setTareas(resultado);
      })
      .catch(() => {
        if (!ignorar) setError("No se pudieron cargar las estrellas");
      })
      .finally(() => {
        if (!ignorar) setCargando(false);
      });
    return () => {
      ignorar = true;
    };
  }, []);

  return (
    <section className="nb-inicio">
      <FondoNebulosa />
      <MapaEstrellas tareas={tareas} />

      {/* Aparece, queda unos segundos y se desvanece (ver .nb-intro) */}
      <p className="nb-intro">
        Como en una nebulosa, cada tarea nace, evoluciona y se completa.
        Organizá las tuyas por prioridad y no te pierdas ningún vencimiento.
      </p>

      {error && <p className="nb-inicio-aviso text-danger">{error}</p>}
      {!cargando && !error && tareas.length === 0 && (
        <p className="nb-inicio-aviso text-secondary">
          Tu nebulosa todavía no tiene estrellas.{" "}
          <Link to="/tareas">Creá tu primera tarea</Link>
        </p>
      )}
    </section>
  );
};

export default PaginaInicio;
