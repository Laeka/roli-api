const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  descripcion: { type: String, required: true },
  usuarioAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hogar: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  duracion: { type: String }, // Ej: "20 min"
  estado: { type: String, enum: ['pendiente', 'completada', 'vencida'], default: 'pendiente' },
  fechaVencimiento: { type: Date },
  puntos: { type: Number, default: 0 },
  completadaEn: { type: Date }, // Para historial
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;