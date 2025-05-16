const User = require('../models/User');

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-contrasena');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar información personal
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    ).select('-contrasena');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener logros y ranking del mes
exports.getAchievementsAndRanking = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('logros rankingMes');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({
      logros: user.logros,
      rankingMes: user.rankingMes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo.' });
    }

    user.fotoPerfil = req.file.path;
    await user.save();

    res.json({ message: 'Imagen de perfil actualizada', fotoPerfil: user.fotoPerfil });
  } catch (error) {
    console.error("Error al subir imagen a Cloudinary:", error);
    res.status(500).json({ error: error.message });
  }
};
