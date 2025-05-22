const express = require('express');
const router = express.Router();
const productosController = require('../Controller/productos.controller');
const comprasController = require('../Controller/compras.controller');
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
router.get('/', productosController.obtenerProductos);
router.get('/:id', productosController.obtenerProducto);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, productosController.crearProducto);
router.put('/:id', verificarToken, productosController.actualizarProducto);
router.delete('/:id', verificarToken, productosController.eliminarProducto);

// Ruta para procesar compras
router.post('/procesarCompra', comprasController.procesarCompra);

module.exports = router;
