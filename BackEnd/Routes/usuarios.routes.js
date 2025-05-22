const express = require('express');
const router = express.Router();
const usuariosController = require('../Controller/usuarios.controller');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tu_secreto_jwt_aqui'; // En producción, usar variables de entorno

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
};

// Rutas públicas
router.post('/registro', usuariosController.registrar);
router.post('/login', usuariosController.login);

// Rutas protegidas
router.get('/', verificarToken, usuariosController.obtenerUsuarios);
router.get('/:id', verificarToken, usuariosController.obtenerUsuario);
router.put('/:id', verificarToken, usuariosController.actualizarUsuario);
router.delete('/:id', verificarToken, usuariosController.eliminarUsuario);

module.exports = router;