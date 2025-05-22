const Venta = require('../Model/Venta');
const Producto = require('../Model/Producto');

// Registrar una nueva venta
exports.registrarVenta = async (req, res) => {
    try {
        const { Fk_id_Producto, cantidad, precioUnitario, total } = req.body;

        // Verificar que el producto existe
        const producto = await Producto.findByPk(Fk_id_Producto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar stock suficiente
        if (producto.stock < cantidad) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        // Crear la venta
        const venta = await Venta.create({
            Fk_id_Producto,
            cantidad,
            precioUnitario,
            total,
            fechaVenta: new Date()
        });

        // Actualizar el stock del producto
        await producto.update({
            stock: producto.stock - cantidad
        });

        res.status(201).json({
            message: 'Venta registrada exitosamente',
            venta
        });
    } catch (error) {
        console.error('Error al registrar venta:', error);
        res.status(500).json({ 
            message: 'Error al registrar la venta',
            error: error.message 
        });
    }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: Producto,
                    attributes: ['nombre', 'imagen']
                }
            ]
        });
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ 
            message: 'Error al obtener las ventas',
            error: error.message 
        });
    }
};

// Obtener ventas por usuario
exports.obtenerVentasPorUsuario = async (req, res) => {
    try {
        const { Fk_id_Usuario } = req.params;
        const ventas = await Venta.findAll({
            where: { Fk_id_Usuario },
            include: [
                {
                    model: Producto,
                    attributes: ['nombre', 'imagen']
                }
            ]
        });
        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas del usuario:', error);
        res.status(500).json({ 
            message: 'Error al obtener las ventas del usuario',
            error: error.message 
        });
    }
}; 