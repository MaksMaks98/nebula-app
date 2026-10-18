import axios from "axios";
import type { Tarea, TareaFormulario } from "../types/Tarea";


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
