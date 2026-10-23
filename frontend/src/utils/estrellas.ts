import type { Tarea } from "../types/Tarea";

export type Estrella = {
  tarea: Tarea;
  x: number; // porcentaje del ancho
  y: number; // porcentaje del alto
  duracion: number; // segundos del titileo
  retraso: number; // segundos (negativo: arranca a mitad de ciclo, así no titilan todas juntas)
  escalaMinima: number; // cuánto se achica al titilar: da la idea de distintas distancias
  opacidadMinima: number;
};

// Zona donde pueden caer las estrellas: deja libre el borde y la barra de navegación
const X_MIN = 6;
const X_MAX = 94;
const Y_MIN = 16;
const Y_MAX = 90;
const DISTANCIA_MINIMA = 7; // en puntos porcentuales, para que no se encimen
const INTENTOS = 12;

// Convierte el _id en un número: la misma tarea da siempre el mismo número
const semilla = (texto: string) => {
  let hash = 2166136261;
  for (const caracter of texto) {
    hash ^= caracter.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// Generador de números "al azar" pero repetibles a partir de una semilla (mulberry32)
const generador = (inicial: number) => {
  let estado = inicial;
  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Cada tarea queda siempre en el mismo lugar del mapa, aunque se recargue la página.
// Se ordenan por _id: como Mongo genera ids crecientes, una tarea nueva no mueve a las anteriores.
export const ubicarEstrellas = (tareas: Tarea[]): Estrella[] => {
  const ordenadas = [...tareas].sort((a, b) => a._id.localeCompare(b._id));
  const ubicadas: Estrella[] = [];

  for (const tarea of ordenadas) {
    const azar = generador(semilla(tarea._id));
    let x = 0;
    let y = 0;

    for (let intento = 0; intento < INTENTOS; intento++) {
      x = X_MIN + azar() * (X_MAX - X_MIN);
      y = Y_MIN + azar() * (Y_MAX - Y_MIN);
      const libre = ubicadas.every(
        (otra) => Math.hypot(otra.x - x, otra.y - y) >= DISTANCIA_MINIMA,
      );
      if (libre) break;
    }

    ubicadas.push({
      tarea,
      x,
      y,
      duracion: 2.5 + azar() * 5,
      retraso: -azar() * 7,
      escalaMinima: 0.35 + azar() * 0.3,
      opacidadMinima: 0.35 + azar() * 0.35,
    });
  }

  return ubicadas;
};
