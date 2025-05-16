const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Crear tarea
router.post('/', taskController.createTask);

// Obtener tareas por hogar
router.get('/home/:homeId', taskController.getTasksByHome);

// Obtener tareas por usuario
router.get('/user/:userId', taskController.getTasksByUser);

// Actualizar tarea (estado, usuario asignado, etc.)
router.patch('/:id', taskController.updateTask);

// Eliminar tarea
router.delete('/:id', taskController.deleteTask);

// Obtener historial de tareas completadas por hogar
router.get('/home/:homeId/historial', taskController.getCompletedTasksByHome);

router.get('/home/:homeId/historial', taskController.getCompletedTasksByHome);
router.get('/home/:homeId/estadisticas', taskController.getStatsByHome);

module.exports = router;