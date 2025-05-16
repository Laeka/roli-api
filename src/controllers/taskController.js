const Task = require('../models/Task');
const User = require('../models/User');

// Crear tarea
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener tareas por hogar
exports.getTasksByHome = async (req, res) => {
  try {
    const tasks = await Task.find({ hogar: req.params.homeId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener tareas por usuario
exports.getTasksByUser = async (req, res) => {
  try {
    const tasks = await Task.find({ usuarioAsignado: req.params.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

    // Si estamos completando la tarea, asignar puntos al usuario
    if (req.body.estado === 'completada' && task.estado !== 'completada') {
      try {
        // Usar findByIdAndUpdate en lugar de save para evitar validaciones completas
        const puntosParaAgregar = task.puntos || 0;
        console.log(`Intentando actualizar puntos para usuario ${task.usuarioAsignado}, agregando ${puntosParaAgregar} puntos`);
        
        const updateResult = await User.findByIdAndUpdate(
          task.usuarioAsignado,
          { $inc: { puntos: puntosParaAgregar } },
          { new: true, select: 'puntos' }
        );
        
        if (updateResult) {
          console.log(`Puntos actualizados exitosamente: ${updateResult.puntos}`);
          // Incluir los puntos actualizados en la respuesta
          req.body.puntosActualizados = updateResult.puntos;
        } else {
          console.warn(`No se encontró el usuario ${task.usuarioAsignado} para actualizar puntos`);
        }
      } catch (error) {
        console.error("Error al actualizar puntos del usuario:", error.message);
      }
    }

    // Actualizar la tarea
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    console.error("Error al actualizar tarea:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial de tareas completadas por hogar
exports.getCompletedTasksByHome = async (req, res) => {
  try {
    const tasks = await Task.find({ hogar: req.params.homeId, estado: 'completada' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Estadísticas de los últimos 7 días por hogar
exports.getStatsByHome = async (req, res) => {
    try {
      const { homeId } = req.params;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      // Tareas completadas
      const completedTasks = await Task.find({
        hogar: homeId,
        estado: 'completada',
        completadaEn: { $gte: sevenDaysAgo }
      });
  
      // Emociones positivas (ejemplo: 'Bien', 'Calmado')
      const DailyLog = require('../models/DailyLog');
      const positiveEmotions = await DailyLog.find({
        hogar: homeId,
        fecha: { $gte: sevenDaysAgo },
        emocion: { $in: ['Bien', 'Calmado'] }
      });
  
      res.json({
        tareasCompletadas: completedTasks.length,
        emocionesPositivas: positiveEmotions.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Función auxiliar para calcular la racha de días consecutivos
function calcularRachaDias(fechas) {
  if (fechas.length === 0) return 0;

  // Convertir a solo fechas (sin horas) y eliminar duplicados
  const diasUnicos = [...new Set(fechas.map(f => {
    const d = new Date(f);
    d.setHours(0,0,0,0);
    return d.getTime();
  }))].sort((a, b) => b - a); // Orden descendente

  let racha = 0;
  let hoy = new Date();
  hoy.setHours(0,0,0,0);

  for (let i = 0; i < diasUnicos.length; i++) {
    if (diasUnicos[i] === hoy.getTime() - (racha * 24 * 60 * 60 * 1000)) {
      racha++;
    } else {
      break;
    }
  }
  return racha;
}

// Endpoint de estadísticas incluyendo la racha
exports.getStatsByHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Tareas completadas en los últimos 7 días
    const completedTasks = await Task.find({
      hogar: homeId,
      estado: 'completada',
      completadaEn: { $gte: sevenDaysAgo }
    });

    // Fechas de tareas completadas
    const fechasCompletadas = completedTasks.map(t => t.completadaEn);

    // Calcular racha
    const rachaDias = calcularRachaDias(fechasCompletadas);

    // Emociones positivas (ejemplo: 'Bien', 'Calmado')
    const DailyLog = require('../models/DailyLog');
    const positiveEmotions = await DailyLog.find({
      hogar: homeId,
      fecha: { $gte: sevenDaysAgo },
      emocion: { $in: ['Bien', 'Calmado'] }
    });

    res.json({
      tareasCompletadas: completedTasks.length,
      emocionesPositivas: positiveEmotions.length,
      rachaDias
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};