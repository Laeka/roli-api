// Definir el esquema de usuarios
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, },
  username: { type: String, required: true, },
  contrasena: { type: String, required: true },
  rol: { type: String, default: 'usuario' },
  fotoPerfil: { type: String },
  estadoCivil: { type: String },
  telefono: { type: String },
  fechaNacimiento: { type: Date },
  idioma: { type: String },
  logros: [String],
  rankingMes: [{ titulo: String, descripcion: String }],
  puntuacionTotal: { type: Number, default: 0 },
  puntos: { type: Number, default: 0 },
  estadoRegion: { type: String, required: true },
  residencia: { type: String, required: true },
  habitacion: { type: String, required: true },
  universidad: { type: String }, // Opcional
});

// Encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

// Comparar passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.contrasena);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
