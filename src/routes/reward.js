const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');

// Rutas para recompensas
console.log('Configurando rutas de recompensas');

// Crear una recompensa
router.post('/', rewardController.createReward);

// Obtener recompensas por hogar
router.get('/home/:homeId', rewardController.getRewardsByHome);

// Canjear recompensa
router.post('/redeem', rewardController.redeemReward);

// Eliminar recompensa
router.delete('/:id', rewardController.deleteReward);

// Obtener historial de recompensas canjeadas por usuario
router.get('/user/:userId/history', rewardController.getRedeemedRewards);

console.log('Rutas de recompensas configuradas');

module.exports = router; 