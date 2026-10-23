import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { Tarea } from "../../types/Tarea";
import { ubicarEstrellas } from "../../utils/estrellas";

type Props = {
  tareas: Tarea[];
};

const MapaEstrellas = ({ tareas }: Props) => {
  // Valor derivado: se recalcula en cada render a partir de las tareas
  const estrellas = ubicarEstrellas(tareas);

  return (
    <nav className="nb-mapa" aria-label="Mapa de tareas">
      {estrellas.map(({ tarea, x, y, duracion, retraso, escalaMinima, opacidadMinima }) => {
        const clases = [
          "nb-estrella",
          `nb-estrella-${tarea.prioridad}`,
          tarea.completada ? "nb-estrella-completada" : "",
        ].join(" ");

        // Posición y ritmo de cada estrella, como variables CSS
        const estilo = {
          left: `${x}%`,
          top: `${y}%`,
          "--nb-duracion": `${duracion}s`,
          "--nb-retraso": `${retraso}s`,
          "--nb-escala-min": escalaMinima,
          "--nb-opacidad-min": opacidadMinima,
        } as CSSProperties;

        return (
          <Link
            key={tarea._id}
            to={`/tareas/${tarea._id}`}
            className={clases}
            style={estilo}
            aria-label={`${tarea.titulo} (prioridad ${tarea.prioridad}${
              tarea.completada ? ", completada" : ""
            })`}
          >
            <span className="nb-estrella-punto" />
            {/* El título solo se ve con hover o con el foco del teclado */}
            <span className="nb-estrella-titulo" aria-hidden="true">
              {tarea.titulo}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MapaEstrellas;
