# 🌌 Nebula App

Aplicación para la creación y seguimiento de tareas, desarrollada en stack MERN (MongoDB, Express, React, Node.js).

El nombre viene de las nebulosas: nubes gigantes de gas y polvo interestelar (principalmente hidrógeno y helio) que actúan como "viveros de estrellas" donde nacen nuevos astros, o como restos de estrellas que ya explotaron. La idea es la misma con las tareas: cada una nace, evoluciona y en algún momento "se consume" al completarse — un ciclo de creación y cierre, igual que en una nebulosa.

## Estado del proyecto

- **Backend**: implementado — API REST completa para gestión de tareas.
- **Frontend**: pendiente de desarrollo.

## Stack

- Node.js + Express 5
- MongoDB + Mongoose
- dotenv, cors
- nodemon (desarrollo)

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [MongoDB](https://www.mongodb.com/try/download/community) corriendo localmente (o una URI de conexión a una instancia remota)

## Instalación y puesta en marcha

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
