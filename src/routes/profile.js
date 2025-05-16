const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'roli-avatars', // Opcional: una carpeta en Cloudinary para tus avatares
  allowedFormats: ['jpg', 'jpeg', 'png'], // Formatos permitidos
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original o genera uno nuevo
  },
});

const uploadCloud = multer({ storage: storage });

// Obtener perfil de usuario
router.get('/:userId', profileController.getProfile);

// Actualizar información personal
router.patch('/:userId', profileController.updateProfile);

// Obtener logros y ranking del mes
router.get('/:userId/achievements', profileController.getAchievementsAndRanking);

// Endpoint para subir imagen de perfil
router.post('/:userId/avatar', uploadCloud.single('fotoPerfil'), profileController.uploadAvatar);

module.exports = router;
