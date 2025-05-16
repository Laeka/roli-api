const mongoose = require('mongoose');
require('dotenv').config(); // Para cargar variables de entorno desde .env

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/roomlife-db';

mongoose
  .connect(dbUrl)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));
