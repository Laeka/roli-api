const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  estado: { type: String, enum: ['hecho', 'pendiente', 'sin realizar'], default: 'pendiente' },
  fechaActualizacion: { type: Date, default: Date.now },
  fechaVencimiento: { type: Date },
});

const moduleConfigSchema = new mongoose.Schema({
  horarioTrabajo: { type: Boolean, default: false },
  normasCasa: { type: Boolean, default: false },
  convivencia: { type: Boolean, default: false },
});

const homeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  modulos: [moduleSchema],
  configuracion: moduleConfigSchema,
});

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
