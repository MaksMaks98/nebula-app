require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbconnect = require('./config/db');
const tareasRoutes = require('./routes/tarea');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const notFoundHandler = require('./middlewares/notFoundMiddleware');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
app.use(loggingMiddleware);
app.use(cors());
app.use(express.json());
app.use('/api', tareasRoutes);

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'API funcionando' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

dbconnect().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
}).catch(err => {
  console.error('Error al conectar la base de datos:', err);
});

module.exports = app;
