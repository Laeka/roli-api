const DailyLog = require('../models/DailyLog');

// Obtener todos los registros diarios de un hogar
exports.getDailyLogsByHome = async (req, res) => {
  try {
    const logs = await DailyLog.find({ hogar: req.params.homeId }).sort({ fecha: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear o actualizar el registro diario de un hogar
exports.createOrUpdateDailyLog = async (req, res) => {
  try {
    const { fecha, emocion, nota } = req.body;
    const { homeId } = req.params;

    // Busca si ya existe un registro para ese día
    let log = await DailyLog.findOne({ hogar: homeId, fecha: new Date(fecha).setHours(0,0,0,0) });

    if (log) {
      log.emocion = emocion;
      log.nota = nota;
      await log.save();
      return res.json(log);
    } else {
      log = new DailyLog({ hogar: homeId, fecha, emocion, nota });
      await log.save();
      return res.status(201).json(log);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};