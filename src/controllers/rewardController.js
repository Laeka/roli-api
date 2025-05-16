const Reward = require('../models/Reward');
const User = require('../models/User');

// Crear recompensa
exports.createReward = async (req, res) => {
  try {
    console.log('Creando recompensa con datos:', req.body);
    
    // Validar datos requeridos
    if (!req.body.nombre || !req.body.puntosCosto || !req.body.hogar) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos', 
        required: ['nombre', 'puntosCosto', 'hogar'],
        received: Object.keys(req.body)
      });
    }
    
    // Crear una copia limpia de los datos sin _id para evitar duplicados
    const rewardData = { 
      nombre: req.body.nombre,
      descripcion: req.body.descripcion || '',
      puntosCosto: req.body.puntosCosto,
      hogar: req.body.hogar,
      creadorId: req.body.creadorId || req.userId
    };
    
    // Si por alguna razón aún hay un _id, elimínalo explícitamente
    if ('_id' in rewardData) {
      console.log('Eliminando _id existente para asegurar que se genere uno nuevo');
      delete rewardData._id;
    }
    
    // Crear nuevo objeto de recompensa
    const reward = new Reward(rewardData);
    
    // Guardar la recompensa
    await reward.save();
    console.log('Recompensa creada con éxito:', reward._id);
    
    // Devolver la recompensa creada
    res.status(201).json(reward);
  } catch (error) {
    console.error('Error al crear recompensa:', error.message, error.stack);
    res.status(400).json({ error: error.message });
  }
};

// Obtener recompensas por hogar
exports.getRewardsByHome = async (req, res) => {
  try {
    console.log('Buscando recompensas para el hogar:', req.params.homeId);
    
    const rewards = await Reward.find({ 
      hogar: req.params.homeId,
      estado: 'disponible'
    });
    
    console.log(`Se encontraron ${rewards.length} recompensas disponibles`);
    res.json(rewards);
  } catch (error) {
    console.error('Error al buscar recompensas:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Canjear recompensa
exports.redeemReward = async (req, res) => {
  const { rewardId, userId } = req.body;
  
  try {
    // Obtener la recompensa
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }
    
    if (reward.estado !== 'disponible') {
      return res.status(400).json({ error: 'Esta recompensa ya ha sido canjeada' });
    }
    
    // Obtener el usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Verificar que tenga puntos suficientes
    if (!user.puntos || user.puntos < reward.puntosCosto) {
      return res.status(400).json({ error: 'Puntos insuficientes para canjear esta recompensa' });
    }
    
    // Actualizar la recompensa
    reward.estado = 'canjeada';
    reward.canjeadaPor = userId;
    reward.fechaCanje = new Date();
    await reward.save();
    
    // Descontar puntos al usuario usando findByIdAndUpdate para evitar validación
    const puntosActualizados = user.puntos - reward.puntosCosto;
    console.log(`Descontando ${reward.puntosCosto} puntos al usuario ${userId}. Puntos actuales: ${user.puntos}, nuevos puntos: ${puntosActualizados}`);
    
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      { puntos: puntosActualizados },
      { new: true, select: 'puntos' }
    );
    
    console.log(`Puntos actualizados correctamente: ${userUpdated.puntos}`);
    
    res.json({ 
      message: 'Recompensa canjeada exitosamente',
      reward,
      puntos: userUpdated.puntos 
    });
  } catch (error) {
    console.error('Error al canjear recompensa:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar recompensa
exports.deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ error: 'Recompensa no encontrada' });
    }
    res.json({ message: 'Recompensa eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial de recompensas canjeadas por un usuario
exports.getRedeemedRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ 
      canjeadaPor: req.params.userId,
      estado: 'canjeada'
    }).sort({ fechaCanje: -1 });
    
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 