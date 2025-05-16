const Home = require('../models/Home');
const mongoose = require('mongoose');

// Crear un nuevo hogar
exports.createHome = async (req, res) => {
  try {
    const { nombre, primerUsuarioId, configuracion, modulos } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del hogar es requerido.' });
    }
    if (!primerUsuarioId || !mongoose.Types.ObjectId.isValid(primerUsuarioId)) {
      return res.status(400).json({ error: 'Se requiere un primerUsuarioId válido para crear el hogar.' });
    }

    const home = new Home({
      nombre,
      usuarios: [primerUsuarioId], // El primer usuario
      configuracion: configuracion || {},
      modulos: modulos || [],
    });

    await home.save();
    res.status(201).json(home);
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    console.error("Error creando hogar:", error);
    res.status(500).json({ error: 'Error al crear el hogar.' });
  }
};

// Obtener todos los hogares de un usuario (con datos completos de usuarios)
exports.getHomesByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const homes = await Home.find({ usuarios: userId }).populate('usuarios', '-contrasena');
    res.json(homes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un hogar por ID (con datos completos de usuarios)
exports.getHomeById = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id).populate('usuarios', '-contrasena');
    if (!home) return res.status(404).json({ error: 'Hogar no encontrado' });
    res.json(home);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar la configuración de un hogar
exports.updateHomeConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, configuracion, usuarios, modulos } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de hogar inválido.' });
    }

    const home = await Home.findById(id);
    if (!home) {
      return res.status(404).json({ error: 'Hogar no encontrado.' });
    }

    if (nombre) {
      home.nombre = nombre;
    }
    
    // Actualizar configuración si se proporciona
    if (configuracion) {
      if (configuracion.horarioTrabajo !== undefined) home.configuracion.horarioTrabajo = configuracion.horarioTrabajo;
      if (configuracion.normasCasa !== undefined) home.configuracion.normasCasa = configuracion.normasCasa;
      if (configuracion.convivencia !== undefined) home.configuracion.convivencia = configuracion.convivencia;
    }
    
    // Actualizar usuarios si se proporcionan
    if (usuarios && Array.isArray(usuarios)) {
      // Validar que todos los IDs de usuario son válidos
      const validUserIds = usuarios.filter(userId => 
        mongoose.Types.ObjectId.isValid(userId)
      );
      
      if (validUserIds.length > 0) {
        home.usuarios = validUserIds;
      }
    }
    
    // Actualizar módulos si se proporcionan
    if (modulos && Array.isArray(modulos)) {
      home.modulos = modulos;
    }

    await home.save();
    res.json(home);
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    console.error("Error actualizando hogar:", error);
    res.status(500).json({ error: 'Error al actualizar el hogar.' });
  }
};

// Agregar un usuario a un hogar
exports.addUserToHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const { userIdToAdd } = req.body; // ID del usuario a agregar

    if (!mongoose.Types.ObjectId.isValid(homeId)) {
      return res.status(400).json({ error: 'ID de hogar inválido.' });
    }
    if (!userIdToAdd || !mongoose.Types.ObjectId.isValid(userIdToAdd)) {
      return res.status(400).json({ error: 'El userIdToAdd es inválido o no fue proporcionado.' });
    }

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({ error: 'Hogar no encontrado.' });
    }

    if (home.usuarios.includes(userIdToAdd)) {
      return res.status(400).json({ error: 'Este usuario ya pertenece al hogar.' });
    }

    home.usuarios.push(userIdToAdd);
    await home.save();
    res.status(200).json(home); // Devolver el hogar sin poblar por simplicidad
  } catch (error) {
    console.error("Error agregando usuario al hogar:", error);
    res.status(500).json({ error: 'Error al agregar el usuario al hogar.' });
  }
};

exports.removeUserFromHome = async (req, res) => {
  try {
    const { homeId, userIdToRemove } = req.params;

    if (!mongoose.Types.ObjectId.isValid(homeId) || !mongoose.Types.ObjectId.isValid(userIdToRemove)) {
      return res.status(400).json({ error: 'ID de hogar o de usuario a quitar inválido.' });
    }

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({ error: 'Hogar no encontrado.' });
    }

    if (home.usuarios.length === 1 && home.usuarios[0].equals(userIdToRemove)) {
      return res.status(400).json({ error: 'No puedes quitar al único usuario del hogar.' });
    }

    const initialUserCount = home.usuarios.length;
    home.usuarios = home.usuarios.filter(user => !user.equals(userIdToRemove));

    if (home.usuarios.length === initialUserCount) {
      return res.status(404).json({ error: 'El usuario a quitar no fue encontrado en este hogar.' });
    }

    await home.save();
    res.status(200).json(home); // Devolver el hogar sin poblar por simplicidad
  } catch (error) {
    console.error("Error quitando usuario del hogar:", error);
    res.status(500).json({ error: 'Error al quitar el usuario del hogar.' });
  }
};

// Agregar un nuevo módulo a un hogar
exports.addModuleToHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ error: 'Hogar no encontrado' });
    home.modulos.push(req.body);
    await home.save();
    res.status(201).json(home);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un módulo de un hogar
exports.updateModuleInHome = async (req, res) => {
  try {
    const { homeId, moduleId } = req.params;
    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ error: 'Hogar no encontrado' });

    const modulo = home.modulos.id(moduleId);
    if (!modulo) return res.status(404).json({ error: 'Módulo no encontrado' });

    Object.assign(modulo, req.body);
    await home.save();
    res.json(home);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
