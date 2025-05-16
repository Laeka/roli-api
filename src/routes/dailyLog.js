const express = require('express');
const router = express.Router();
const dailyLogController = require('../controllers/dailyLogController');

// Obtener registros diarios por hogar
router.get('/:homeId', dailyLogController.getDailyLogsByHome);

// Crear o actualizar registro diario
router.post('/:homeId', dailyLogController.createOrUpdateDailyLog);

module.exports = router;