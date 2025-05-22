const Compra = require('../Model/compras.model');
const Producto = require('../Model/productos.model');

exports.procesarCompra = async (req, res) => {
    try {
        const { Fk_id_Producto, cantidad, precioUnitario, total } = req.body;
        
        console.log('Datos recibidos:', req.body); // Para depuración

        // Verificar que el ID del producto sea válido
        if (!Fk_id_Producto || isNaN(Fk_id_Producto)) {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }

        // Verificar que el producto existe
        const producto = await Producto.findByPk(Fk_id_Producto);
        console.log('Producto encontrado:', producto); // Para depuración

        if (!producto) {
            return res.status(404).json({ 
                message: 'Producto no encontrado',
                idBuscado: Fk_id_Producto
            });
        }

        // Verificar stock suficiente
        if (producto.stock < cantidad) {
            return res.status(400).json({ 
                message: 'Stock insuficiente',
                stockDisponible: producto.stock,
                cantidadSolicitada: cantidad
            });
        }

        // Crear la compra
        const compra = await Compra.create({
            Fk_id_Producto: Fk_id_Producto,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            total: total,
            estado: 'completada',
            fecha: new Date()
        });

        // Actualizar el stock del producto
        await producto.update({
            stock: producto.stock - cantidad
        });

        res.status(201).json({
            message: 'Compra procesada exitosamente',
            compra: {
                id: compra.id,
                producto: producto.nombre,
                cantidad: compra.cantidad,
                total: compra.total,
                fecha: compra.fecha,
                estado: compra.estado
            }
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({
            message: 'Error al procesar la compra',
            error: error.message
        });
    }
}; 