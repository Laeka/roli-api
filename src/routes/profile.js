const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const multer = require('multer');

// Configuración de multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // crea la carpeta uploads en la raíz si no existe
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

// Obtener perfil de usuario
router.get('/:userId', profileController.getProfile);

// Actualizar información personal
router.patch('/:userId', profileController.updateProfile);

// Obtener logros y ranking del mes
router.get('/:userId/achievements', profileController.getAchievementsAndRanking);

// Endpoint para subir imagen de perfil
router.post('/:userId/avatar', upload.single('fotoPerfil'), profileController.uploadAvatar);

module.exports = router;