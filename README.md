# 🌌 Nebula App

Aplicación para la creación y seguimiento de tareas, desarrollada en stack MERN (MongoDB, Express, React, Node.js).

El nombre viene de las nebulosas: nubes gigantes de gas y polvo interestelar (principalmente hidrógeno y helio) que actúan como "viveros de estrellas" donde nacen nuevos astros, o como restos de estrellas que ya explotaron. La idea es la misma con las tareas: cada una nace, evoluciona y en algún momento "se consume" al completarse — un ciclo de creación y cierre, igual que en una nebulosa.

## Estado del proyecto

- **Backend**: implementado — API REST completa para gestión de tareas.
- **Frontend**: implementado — interfaz en React que consume la API.

## Estructura del repositorio

```text
nebula-app/
├── backend/    API REST (Express + Mongoose)
└── frontend/   Interfaz (React + Vite + TypeScript)
```

## Stack

**Backend**

- Node.js + Express 5
- MongoDB + Mongoose
- dotenv, cors
- nodemon (desarrollo)

**Frontend**

- React 19 + TypeScript + Vite
- react-bootstrap
- axios
- React Router
- Formik + Yup

## Requisitos previos

- [Node.js](https://nodejs.org/) v20.19 o superior (o v22.12 o superior), requerido por Vite
- [MongoDB](https://www.mongodb.com/try/download/community) corriendo localmente (o una URI de conexión a una instancia remota). Con Docker alcanza con:

  ```bash
  docker run -d --name nebula-mongo -p 27017:27017 mongo:7
  ```

## Instalación y puesta en marcha

### Backend

```bash
# 1. Clonar el repositorio
git clone git@github.com:MaksMaks98/nebula-app.git
cd nebula-app/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env si tu instancia de MongoDB no corre en localhost:27017

# 4. Levantar el servidor en modo desarrollo (reinicia solo con cada cambio)
npm run dev

# o en modo producción
npm start
```

El servidor queda disponible en `http://localhost:3000` (o el puerto que definas en `.env`).

### Variables de entorno

| Variable    | Descripción                              | Ejemplo                                              |
|-------------|-------------------------------------------|-------------------------------------------------------|
| `MONGO_URI` | Cadena de conexión a MongoDB              | `mongodb://127.0.0.1:27017/miListaDeTareas`           |
| `PORT`      | Puerto donde escucha el servidor          | `3000`                                                 |

## API — Endpoints

Todas las rutas están montadas bajo el prefijo `/api`.

| Método | Ruta                                 | Descripción                                          |
|--------|---------------------------------------|-------------------------------------------------------|
| GET    | `/api/tareas`                        | Lista todas las tareas                                |
| GET    | `/api/tareas/:id`                    | Obtiene una tarea por su id                           |
| POST   | `/api/tareas`                        | Crea una tarea nueva                                  |
| PUT    | `/api/tareas/:id`                    | Actualiza una tarea existente                         |
| DELETE | `/api/tareas/:id`                    | Elimina una tarea                                     |
| PUT    | `/api/tareas/:id/completar`          | Marca una tarea como completada                       |
| GET    | `/api/tareas/prioridad/:nivel`       | Filtra tareas por prioridad (`alta`/`media`/`baja`)   |
| GET    | `/api/tareas/proximas-vencer/:dias`  | Lista tareas pendientes que vencen dentro de N días   |

Los dos filtros responden **404** cuando no hay ninguna tarea que coincida, y **400** si el parámetro es inválido (nivel desconocido o días no positivos). El frontend traduce el 404 a una lista vacía.

> `proximas-vencer` compara contra la hora actual y las fechas se guardan a medianoche UTC, por lo que una tarea que vence hoy ya no aparece en ese filtro.

### Modelo de Tarea

```js
{
  titulo: String,       // requerido
  descripcion: String,
  fechaLimite: Date,
  completada: Boolean,  // default: false
  prioridad: String,    // 'alta' | 'media' | 'baja', default: 'media'
  etiquetas: [String]
}
```

### Ejemplo — crear una tarea

```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Comprar leche","prioridad":"alta","fechaLimite":"2026-08-03"}'
```

## Frontend

Interfaz en React 19 + TypeScript + Vite que consume la API REST de Nebula (`/api/tareas`):
ABM completo de tareas, marcar como completada y reabrir, y filtros por prioridad y
por vencimiento. La página de inicio muestra las tareas como un **mapa de estrellas**
sobre una nebulosa animada, y toda la app tiene **tema claro y oscuro**.


**Stack:** react-bootstrap, axios, React Router, Formik + Yup.
### Diseño

- **Tema claro y oscuro:** al abrir la app sigue el tema del sistema. Se cambia con el
  botón de la barra de navegación y la elección se recuerda entre visitas.
- **Mapa de estrellas (`/`):** cada tarea es una estrella. El tamaño depende de la
  prioridad (alta, media o baja), las completadas se ven apagadas, el título aparece
  al pasar el mouse y un click abre el detalle. Cada estrella queda siempre en el
  mismo lugar, calculado a partir del `_id` de la tarea.
- **Fondo de nebulosa:** degradados difusos con animación suave. Si el sistema pide
  movimiento reducido, las animaciones se desactivan.

### Cómo correrlo en local

1. Levantá el backend (ver arriba): queda en `http://localhost:3000`.
2. En otra terminal, desde la raíz del repositorio:

   ```bash
   cd frontend
   npm install
   cp .env.example .env    # VITE_API_URL=http://localhost:3000/api
   npm run dev
   ```

3. Abrí `http://localhost:5173`.

### Scripts

| Comando           | Qué hace                                            |
|-------------------|-----------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con recarga automática       |
| `npm run build`   | Chequea los types y genera la versión de producción |
| `npm run preview` | Sirve la versión de producción generada             |
| `npm run lint`    | Revisa el código con ESLint                         |

### Páginas

| Ruta          | Página                                                    |
|---------------|-----------------------------------------------------------|
| `/`           | Inicio: mapa de estrellas con las tareas                  |
| `/tareas`     | Listado, alta, edición, baja, completar/reabrir y filtros |
| `/tareas/:id` | Detalle de una tarea                                      |
| `*`           | Página no encontrada (404)                                |

### Estructura

- `src/types`: forma de los datos (`Tarea`, `TareaFormulario`, `FiltrosTareas`)
- `src/services`: una función por endpoint de la API, con axios
- `src/hooks`: `useTema`, el tema claro/oscuro
- `src/components`: lista, tarjeta, filtros, modales, nebulosa de fondo y mapa de estrellas
- `src/pages`: Inicio, Tareas, Detalle y 404
- `src/utils`: formato de fechas, colores por prioridad y posición de las estrellas
