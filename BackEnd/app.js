const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./Routes/usuarios.routes');
const authRoutes = require('./Routes/auth.routes');
const productosRoutes = require('./Routes/productos.routes');
const ventasRoutes = require('./Routes/ventasRoutes');

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app; 