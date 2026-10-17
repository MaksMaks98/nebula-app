// Los mismos valores del enum de prioridad de tu tareaModel.js
export type Prioridad = "alta" | "media" | "baja";

// Lo que devuelve la API: un documento de MongoDB tal como llega en el JSON
export type Tarea = {
  _id: string;
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null; // texto ISO; null si se la borraste
  completada: boolean;
  prioridad: Prioridad;
  etiquetas: string[];
  createdAt: string; // los agrega timestamps: true
  updatedAt: string;
};
