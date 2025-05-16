// Rutas para registro y login
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registro de usuarios
router.post('/register', async (req, res) => {
  console.log('Datos recibidos en req.body para /register:', req.body);
  try {
    const {
      nombres,
      apellidos,
      telefono,
      email,
      estadoRegion,
      residencia,
      habitacion,
      universidad,
      username,
      contrasena,
    } = req.body;

    // Validar que el usuario o correo no existan
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario o correo electrónico ya existe' });
    }

    const user = await User.create({
      nombres,
      apellidos,
      telefono,
      email,
      estadoRegion,
      residencia,
      habitacion,
      universidad,
      username,
      contrasena,
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login de usuarios
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, contrasena } = req.body;

    // Buscar usuario por correo o username
    const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });

    if (user && (await user.matchPassword(contrasena))) {
      res.json({ message: 'Login exitoso', userId: user._id });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
