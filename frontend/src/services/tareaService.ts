import axios from "axios";
import type {
  FiltrosTareas,
  Prioridad,
  Tarea,
  TareaFormulario,
} from "../types/Tarea";


const BASE_URL = `${import.meta.env.VITE_API_URL}/tareas`;
// El formulario maneja todo como texto; tu API espera etiquetas como array
// y fechaLimite como fecha o null. La conversión vive acá, en un solo lugar.
const aDatosApi = (valores: TareaFormulario) => ({
  titulo: valores.titulo.trim(),
  descripcion: valores.descripcion.trim(),
  fechaLimite: valores.fechaLimite || null,
  prioridad: valores.prioridad,
  completada: valores.completada,
  etiquetas: valores.etiquetas
    .split(",")
    .map((etiqueta) => etiqueta.trim())
    .filter((etiqueta) => etiqueta !== ""),
});
// Tus filtros responden 404 cuando no hay coincidencias.
// Para la pantalla eso significa "lista vacía", no "error".
const listaVaciaSiEs404 = (error: unknown): Tarea[] => {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    return [];
  }
  throw error;
};
export const obtenerTareaPorId = async (id: string): Promise<Tarea> => {
  const respuesta = await axios.get(`${BASE_URL}/${id}`);
  return respuesta.data;
};

export async function obtenerTareas(): Promise<Tarea[]> {
	const respuesta = await axios.get<Tarea[]>(BASE_URL);
	return respuesta.data;
}

export const crearTarea = async (valores: TareaFormulario): Promise<Tarea> => {
  const respuesta = await axios.post(BASE_URL, aDatosApi(valores));
  return respuesta.data;
};

export const actualizarTarea = async (
  id: string,
  valores: TareaFormulario,
): Promise<Tarea> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}`, aDatosApi(valores));
  return respuesta.data;
};

export const eliminarTarea = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
// ---------- Endpoints de negocio ----------

export const completarTarea = async (id: string): Promise<Tarea> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}/completar`);
  return respuesta.data;
};

// La API no tiene /reabrir: se usa el PUT común, mandando solo el campo que cambia
export const reabrirTarea = async (id: string): Promise<Tarea> => {
  const respuesta = await axios.put(`${BASE_URL}/${id}`, { completada: false });
  return respuesta.data;
};
export const obtenerTareasPorPrioridad = async (
  nivel: Prioridad,
): Promise<Tarea[]> => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/prioridad/${nivel}`);
    return respuesta.data;
  } catch (error) {
    return listaVaciaSiEs404(error);
  }
};

export const obtenerTareasProximasAVencer = async (
  dias: number,
): Promise<Tarea[]> => {
  try {
    const respuesta = await axios.get(`${BASE_URL}/proximas-vencer/${dias}`);
    return respuesta.data;
  } catch (error) {
    return listaVaciaSiEs404(error);
  }
};

// Elige a qué endpoint llamar según los filtros que haya elegido el usuario
export const buscarTareas = async (
  filtros: FiltrosTareas,
): Promise<Tarea[]> => {
  const dias = Number.parseInt(filtros.dias, 10);

  if (dias > 0) {
    const tareas = await obtenerTareasProximasAVencer(dias);
    // La API no combina los dos filtros: la prioridad se aplica sobre el resultado
    return filtros.prioridad
      ? tareas.filter((tarea) => tarea.prioridad === filtros.prioridad)
      : tareas;
  }

  if (filtros.prioridad) {
    return obtenerTareasPorPrioridad(filtros.prioridad);
  }

  return obtenerTareas();
};
