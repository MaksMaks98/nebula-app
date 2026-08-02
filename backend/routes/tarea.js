const express = require('express');
const router = express.Router();
const Tarea = require('../models/tareaModel');

// GET - Obtener todas las tareas
router.get('/tareas', async (req, res, next) => {
  try {
    const tareas = await Tarea.find();
    res.status(200).json(tareas);
  } catch (err) {
    next(err);
  }
});

// GET - Obtener una tarea por ID
router.get('/tareas/:id', async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json(tarea);
  } catch (err) {
    next(err);
  }
});

// POST - Crear una tarea
router.post('/tareas', async (req, res, next) => {
  try {
    const nuevaTarea = await Tarea.create(req.body);
    res.status(201).json(nuevaTarea);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// PUT - Actualizar una tarea
router.put('/tareas/:id', async (req, res, next) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tareaActualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json(tareaActualizada);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// DELETE - Eliminar una tarea
router.delete('/tareas/:id', async (req, res, next) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (err) {
    next(err);
  }
});

// PUT - Marcar tarea como completada
router.put('/tareas/:id/completar', async (req, res, next) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    tarea.completada = true;
    await tarea.save();
    res.status(200).json(tarea);
  } catch (err) {
    next(err);
  }
});

// GET - Obtener tareas por prioridad
router.get('/tareas/prioridad/:nivel', async (req, res, next) => {
  try {
    const { nivel } = req.params;
    if (!['alta', 'media', 'baja'].includes(nivel)) {
      return res.status(400).json({ mensaje: 'Nivel de prioridad inválido. Usá: alta, media o baja' });
    }
    const tareas = await Tarea.find({ prioridad: nivel });
    if (!tareas.length) return res.status(404).json({ mensaje: 'No hay tareas con esa prioridad' });
    res.status(200).json(tareas);
  } catch (err) {
    next(err);
  }
});

// GET - Obtener tareas próximas a vencer
router.get('/tareas/proximas-vencer/:dias', async (req, res, next) => {
  try {
    const dias = parseInt(req.params.dias);
    if (isNaN(dias) || dias <= 0) {
      return res.status(400).json({ mensaje: 'El parámetro días debe ser un número positivo' });
    }
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() + dias);
    const tareas = await Tarea.find({
      fechaLimite: { $gte: hoy, $lte: limite },
      completada: false
    });
    if (!tareas.length) return res.status(404).json({ mensaje: `No hay tareas que venzan en los próximos ${dias} días` });
    res.status(200).json(tareas);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
