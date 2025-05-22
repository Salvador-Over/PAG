const express = require('express');
const router = express.Router();
const ventasController = require('../Controller/ventasController');

// Ruta para registrar una venta
router.post('/registrar', ventasController.registrarVenta);

// Ruta para obtener todas las ventas
router.get('/todas', ventasController.obtenerVentas);

// Ruta para obtener ventas por usuario
router.get('/usuario/:Fk_id_Usuario', ventasController.obtenerVentasPorUsuario);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({ message: 'Ruta de ventas funcionando correctamente' });
});

module.exports = router; 