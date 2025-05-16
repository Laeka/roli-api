const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Crear un nuevo hogar
router.post('/', homeController.createHome);

// Obtener todos los hogares de un usuario
router.get('/', homeController.getHomesByUser);

// Obtener un hogar por ID
router.get('/:id', homeController.getHomeById);

// Actualizar la configuración de un hogar
router.patch('/:id/config', homeController.updateHomeConfig);

// Agregar un nuevo módulo a un hogar
router.post('/:id/modules', homeController.addModuleToHome);

// Actualizar un módulo de un hogar
router.patch('/:homeId/modules/:moduleId', homeController.updateModuleInHome);

// Agregar un usuario a un hogar existente
router.post('/:homeId/users', homeController.addUserToHome);

router.delete('/:homeId/users/:userIdToRemove', homeController.removeUserFromHome);

module.exports = router;
