const mongoose = require('mongoose');

// Función para conectar a MongoDB
const dbconnect = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/miListaDeTareas");
        console.log('Conexión a la base de datos establecida');
    } catch (err) {
        console.error('Error en la conexión a la base de datos:', err);
        process.exit(1); // Detener la aplicación si falla la conexión
    }
}

module.exports = dbconnect;