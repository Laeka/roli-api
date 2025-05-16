// Configuracion Express
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/home');
const taskRoutes = require('./routes/task');
const dailyLogRoutes = require('./routes/dailyLog');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/user');
const rewardRoutes = require('./routes/reward');

require('dotenv').config();
require('./config/db');

// Middlewares
app.use(express.json()); // para parsear bodies request
app.use(cors()); // habilita CORS

// Rutas - mantenemos el prefijo /api para mantener la consistencia con el cliente
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dailyLog', dailyLogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/rewards', rewardRoutes);

const PORT = process.env.PORT || 5001;

app
  .listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT}`))
  .on('error', (err) => {
    console.error('Error al inicar el servidor:', err);
  });
