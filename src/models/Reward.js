const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  puntosCosto: { type: Number, required: true },
  hogar: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  creadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estado: { type: String, enum: ['disponible', 'canjeada'], default: 'disponible' },
  canjeadaPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fechaCanje: { type: Date },
}, { 
  timestamps: true,
  // Asegurarse de que MongoDB genere un nuevo _id
  _id: true 
});

// Pre-save hook para logging
rewardSchema.pre('save', function(next) {
  console.log('Guardando recompensa:', {
    id: this._id,
    nombre: this.nombre,
    puntosCosto: this.puntosCosto,
    hogar: this.hogar
  });
  next();
});

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward; 