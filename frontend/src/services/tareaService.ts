import axios from "axios";
import type { Tarea } from "../types/Tarea";

const BASE_URL = `${import.meta.env.VITE_API_URL}/tareas`;

export async function obtenerTareas(): Promise<Tarea[]> {
	const respuesta = await axios.get<Tarea[]>(BASE_URL);
	return respuesta.data;
}