import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

const Carrito = () => {
    const [carrito, setCarrito] = useState([]);
    const [total, setTotal] = useState(0);
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        setCarrito(carritoGuardado);
        calcularTotal(carritoGuardado);
    }, []);

    const calcularTotal = (items) => {
        const suma = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        setTotal(suma);
    };

    const eliminarDelCarrito = (id) => {
        const nuevoCarrito = carrito.filter(item => item.id !== id);
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        calcularTotal(nuevoCarrito);
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        
        const nuevoCarrito = carrito.map(item => {
            if (item.id === id) {
                return { ...item, cantidad: nuevaCantidad };
            }
            return item;
        });
        
        setCarrito(nuevoCarrito);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        calcularTotal(nuevoCarrito);
    };

    const procesarCompra = async () => {
        try {
            // Procesar cada producto del carrito
            for (const item of carrito) {
                const ventaData = {
                    Fk_id_Producto: parseInt(item.id),
                    cantidad: item.cantidad,
                    precioUnitario: item.precio,
                    total: item.precio * item.cantidad
                };

                console.log('Enviando datos de venta:', ventaData);

                const response = await fetch('http://localhost:5000/api/productos/procesarCompra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ventaData)
                });

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Error al procesar la compra');
                }
            }

            // Limpiar el carrito después de una compra exitosa
            setCarrito([]);
            localStorage.removeItem('carrito');
            setMensaje('¡Compra realizada con éxito!');
            setTimeout(() => {
                setMensaje(null);
                navigate('/MostrarProd');
            }, 2000);

        } catch (error) {
            console.error('Error al procesar la compra:', error);
            setMensaje(error.message || 'Error al procesar la compra');
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    if (carrito.length === 0) {
        return (
            <div className="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <button onClick={() => navigate('/MostrarProd')}>Ver productos</button>
            </div>
        );
    }

    return (
        <div className="carrito-container">
            <h2>Tu Carrito</h2>
            {mensaje && <div className="mensaje">{mensaje}</div>}
            <div className="carrito-items">
                {carrito.map((item) => (
                    <div key={item.id} className="carrito-item">
                        <img src={item.imagen} alt={item.nombre} />
                        <div className="item-info">
                            <h3>{item.nombre}</h3>
                            <p>Precio: Q {item.precio}</p>
                            <div className="cantidad-control">
                                <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>-</button>
                                <span>{item.cantidad}</span>
                                <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
                            </div>
                            <p>Subtotal: Q {item.precio * item.cantidad}</p>
                        </div>
                        <button 
                            className="eliminar-btn"
                            onClick={() => eliminarDelCarrito(item.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
            <div className="carrito-total">
                <h3>Total: Q {total}</h3>
                <button className="comprar-btn" onClick={procesarCompra}>
                    Proceder a la compra
                </button>
            </div>
        </div>
    );
};

export default Carrito;
