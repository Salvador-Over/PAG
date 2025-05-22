import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MostrarProd.css';

const MostrarProd = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                console.log('Intentando obtener productos...');
                const response = await fetch('http://localhost:5000/api/productos');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Error al cargar los productos');
                }
                
                console.log('Productos recibidos:', data);
                setProductos(data);
                setLoading(false);
            } catch (error) {
                console.error('Error completo:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const agregarAlCarrito = (producto) => {
        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        const productoExistente = carritoActual.find(item => item.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carritoActual.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
        }

        localStorage.setItem('carrito', JSON.stringify(carritoActual));
        setMensaje('Producto agregado al carrito');
        setTimeout(() => setMensaje(null), 2000);
    };

    if (loading) return <div className="loading">Cargando productos...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="productos-container">
            <h2>Nuestros Productos</h2>
            {mensaje && <div className="mensaje">{mensaje}</div>}
            {productos.length === 0 ? (
                <p>No hay productos disponibles</p>
            ) : (
                <div className="productos-grid">
                    {productos.map((producto) => (
                        <div key={producto.Pk_id_Producto} className="producto-card">
                            <h3>{producto.nombreProducto}</h3>
                            <div className="producto-info">
                                <p><strong>Código:</strong> {producto.codigoProducto}</p>
                                <p><strong>Peso:</strong> {producto.pesoProducto}</p>
                                <p><strong>Precio:</strong> ${producto.precioUnitario}</p>
                                <p><strong>Clasificación:</strong> {producto.clasificacion}</p>
                                <p><strong>Stock:</strong> {producto.stock}</p>
                                <p><strong>Empaque:</strong> {producto.empaque}</p>
                            </div>
                            <div className="botones-accion">
                                <button 
                                    className="comprar-btn"
                                    onClick={() => navigate(`/detalles/${producto.Pk_id_Producto}`)}
                                >
                                    Ver Detalles
                                </button>
                                <button 
                                    className="agregar-carrito-btn"
                                    onClick={() => agregarAlCarrito(producto)}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MostrarProd;
