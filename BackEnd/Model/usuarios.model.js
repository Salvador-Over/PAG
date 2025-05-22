const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        defaultValue: 'usuario'
    }
}, {
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                console.log('Hash de contraseña antes de crear usuario');
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
                console.log('Contraseña hasheada:', usuario.password);
            }
        }
    }
});

// Método para comparar contraseñas
Usuario.prototype.comparePassword = async function(candidatePassword) {
    console.log('Comparando contraseñas:');
    console.log('Contraseña candidata:', candidatePassword);
    console.log('Contraseña almacenada:', this.password);
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Resultado de la comparación:', result);
    return result;
};

module.exports = Usuario;