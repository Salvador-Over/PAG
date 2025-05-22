const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const usuarioRoutes = require('./Routes/usuarios.routes');
const productoRoutes = require('./Routes/productos.routes');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Rutas
app.use('/usu', usuarioRoutes);
app.use('/api/productos', productoRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
    res.status(200).send('Bienvenido al servidor Backend!');
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor y conectar a la base de datos
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente.');
        
        // Sincronizar los modelos con la base de datos
        await sequelize.sync();
        console.log('Base de datos sincronizada.');

        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

startServer();