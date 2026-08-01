require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbconnect = require('./config/db');
const tareasRoutes = require('./routes/tarea'); // agregado

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', tareasRoutes); // agregado

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'API funcionando' });
});

dbconnect().then(() => {
  app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
}).catch(err => {
  console.error('Error al conectar la base de datos:', err);
});

module.exports = app;