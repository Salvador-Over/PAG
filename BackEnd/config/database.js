const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('colchoneria', 'root', '123456', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente en el puerto 3307.');
    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
        console.log('Por favor, verifica:');
        console.log('1. Que MySQL esté instalado y corriendo en el puerto 3307');
        console.log('2. Que las credenciales sean correctas');
        console.log('3. Que la base de datos colchoneria exista');
    }
};

testConnection();

module.exports = sequelize; 