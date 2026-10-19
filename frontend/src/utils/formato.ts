import type { Prioridad } from "../types/Tarea";

// La API guarda fechaLimite a la medianoche UTC ("2026-10-20T00:00:00.000Z").
// En Argentina (UTC-3) eso es el día anterior a las 21 h, así que se formatea en UTC.
export const formatearFecha = (fechaIso: string) =>
  new Date(fechaIso).toLocaleDateString("es-AR", { timeZone: "UTC" });

// <input type="date"> necesita "AAAA-MM-DD": son los 10 primeros caracteres del ISO
export const fechaParaInput = (fechaIso?: string | null) =>
  fechaIso ? fechaIso.slice(0, 10) : "";

// Un color de Bootstrap por cada prioridad
export const colorPorPrioridad: Record<Prioridad, string> = {
  alta: "danger",
  media: "primary",
  baja: "secondary",
};
