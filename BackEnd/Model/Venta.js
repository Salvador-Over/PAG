const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venta = sequelize.define('Venta', {
    Pk_id_Venta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Fk_id_Usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Fk_id_Producto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fechaVenta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'tbl_ventas',
    timestamps: false
});

// Establecer las relaciones
const Usuario = require('./Usuario');
const Producto = require('./Producto');

Venta.belongsTo(Usuario, { foreignKey: 'Fk_id_Usuario' });
Venta.belongsTo(Producto, { foreignKey: 'Fk_id_Producto' });

module.exports = Venta; 