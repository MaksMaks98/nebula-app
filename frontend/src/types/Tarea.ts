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

// Lo que maneja el formulario de alta y edición
export type TareaFormulario = Pick<Tarea, "titulo" | "prioridad" | "completada"> & {
  descripcion: string; // "" si no tiene
  fechaLimite: string; // "AAAA-MM-DD", o "" si no tiene
  etiquetas: string; // "facultad, urgente": se convierte en array al enviar
};
// Los filtros de la lista, que usan tus endpoints de negocio
export type FiltrosTareas = {
  prioridad: "" | Prioridad; // "" = todas
  dias: string; // lo que se escribe en el input; "" = sin filtro de vencimiento
};
