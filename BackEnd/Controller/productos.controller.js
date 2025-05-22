const Producto = require('../Model/productos.model');
const secret_key = 'mysecretkey';
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '123456',
    database: 'colchoneria'
});

// Buscar productos por categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoria } = req.params;
        const productos = await Producto.find({ categoria });
        if (productos.length === 0) return res.status(404).json({ message: 'No se encontraron productos para esta categoría.' });
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar productos por categoría.' });
    }
};

// Agregar un nuevo producto
exports.addProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        console.log("Se registró un nuevo producto! " + req.body);
        res.status(201).json({ message: 'Producto creado', nuevoProducto });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: 'Error al crear producto.' });
    }
};

// Actualizar un producto por ID
exports.updateProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoUpdate = await Producto.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!productoUpdate) return res.status(404).send({ message: 'No se encontró el producto' });
        console.log("Se modificó el Producto: " + id);
        res.status(200).json({ message: 'Producto modificado', productoUpdate });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send({ message: 'Error al actualizar producto.' });
    }
};

// Borrar un producto por ID
exports.deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoDelete = await Producto.findByIdAndDelete(id);
        if (!productoDelete) return res.status(404).send({ message: 'No se encontró el Producto' });
        console.log("se eliminó el Producto: " + id);
        res.status(200).json({ message: 'Producto eliminado', productoDelete });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send({ message: 'Error al eliminar producto.' });
    }
};

// Mostrar todos los productos en MongoDB
exports.getAllProducts = async (req, res) => {
    try {
        const productos = await Producto.find();
        console.log("Se listaron todos los productos");
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
    const { id } = req.params;
    console.log("ID recibido:", id); // Agregar este log para verificar el ID
    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).send({ message: 'No se encontró el producto' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send({ message: 'Error al obtener el producto' });
    }
};

// Procesar la compra y disminuir el stock de productos
exports.procesarCompra = async (req, res) => {
    const carrito = req.body; // Espera recibir un array de productos con _id y cantidad

    try {
        // Verificar si todos los productos en el carrito tienen stock suficiente
        for (const item of carrito) {
            const producto = await Producto.findById(item._id);

            if (!producto) {
                return res.status(404).json({ message: `Producto con ID ${item._id} no encontrado.` });
            }

            // Verificar si el stock es 0
            if (producto.stock === 0) {
                return res.status(400).json({ message: `El producto ${producto.nombre} está agotado y no se puede comprar.` });
            }

            // Verificar si hay stock suficiente para la cantidad solicitada
            if (producto.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para el producto ${producto.nombre}.` });
            }
        }

        // Reducir el stock de cada producto en el carrito
        for (const item of carrito) {
            const producto = await Producto.findById(item._id);
            producto.stock -= item.cantidad; // Reducir el stock del producto
            await producto.save(); // Guardar el cambio en la base de datos
        }

        // Respuesta en caso de éxito
        res.status(200).json({ message: 'Compra procesada exitosamente y stock actualizado.' });
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        res.status(500).json({ message: 'Error al procesar la compra.' });
    }
};

// Buscar productos por nombre
exports.searchProductsByName = async (req, res) => {
    const { nombre } = req.query; // Obtén el nombre del query string
    try {
        const productos = await Producto.find({ nombre: { $regex: nombre, $options: 'i' } }); // Búsqueda insensible a mayúsculas
        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos con ese nombre.' });
        }
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar productos por nombre.' });
    }
};

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        console.log('Intentando obtener productos...');
        const [rows] = await pool.execute('SELECT * FROM Tbl_Productos');
        console.log('Productos obtenidos:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error detallado al obtener productos:', error);
        res.status(500).json({ 
            message: 'Error al obtener productos', 
            error: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage 
        });
    }
};

// Obtener un producto por ID
exports.obtenerProducto = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Tbl_Productos WHERE Pk_id_Producto = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
};

// Crear un nuevo producto
exports.crearProducto = async (req, res) => {
    try {
        const { codigoProducto, nombreProducto, pesoProducto, precioUnitario, clasificacion, stock, empaque } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO Tbl_Productos (codigoProducto, nombreProducto, pesoProducto, precioUnitario, clasificacion, stock, empaque) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [codigoProducto, nombreProducto, pesoProducto, precioUnitario, clasificacion, stock, empaque]
        );
        
        res.status(201).json({
            message: 'Producto creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { codigoProducto, nombreProducto, pesoProducto, precioUnitario, clasificacion, stock, empaque } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE Tbl_Productos SET codigoProducto = ?, nombreProducto = ?, pesoProducto = ?, precioUnitario = ?, clasificacion = ?, stock = ?, empaque = ? WHERE Pk_id_Producto = ?',
            [codigoProducto, nombreProducto, pesoProducto, precioUnitario, clasificacion, stock, empaque, req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM Tbl_Productos WHERE Pk_id_Producto = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};
