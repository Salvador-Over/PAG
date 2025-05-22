import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './DatallesProd.css'; // Asegúrate de tener estilos para este componente
import MostrarProd from '../MostrarProd/MostrarProd';

const DetallesProd = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/prod/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar el producto: ' + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data);
      })
      .catch((error) => {
        console.error("Error al cargar el producto:", error);
        setMensaje("No se pudo cargar el producto. Intenta más tarde.");
      });
  }, [id]);

  const agregarAlCarrito = () => {
    if (!producto) return;

    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carritoActual.find(item => item.id === producto.id);

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carritoActual.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidad
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    setMensaje('Producto agregado al carrito');
    setTimeout(() => setMensaje(null), 2000);
  };

  if (mensaje) {
    return <div className="mensaje">{mensaje}</div>;
  }

  if (!producto) {
    return <div>Cargando...</div>; // Puedes agregar un spinner aquí si lo deseas
  }

  return (
    <div>
      <div className="detalles-producto">
        <div className="producto-imagen">
          <img src={producto.imagen} alt={producto.nombre} className="imagen-principal" />
        </div>
        <div className="producto-info">
          <h2 className="nombre-producto">{producto.nombre}</h2>
          <p className="descripcion">{producto.descripcion}</p>
          <p className="precio"><strong>Precio:</strong> Q {producto.precio}</p>
          <p><strong>Categoría:</strong> {producto.categoria}</p>
          <p><strong>Stock:</strong> {producto.stock}</p>
          
          <div className="cantidad-container">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
            />
          </div>
          
          <div className="botones">
            <button className="boton-comprar" onClick={() => navigate('/carrito')}>Comprar Ahora</button>
            <button className="boton-carrito" onClick={agregarAlCarrito}>Agregar al Carrito</button>
          </div>
        </div>
      </div>
      <button className="btn-volver" onClick={() => navigate('/')}>Volver</button>
      <MostrarProd />
      <div className="waveDetalleProducto"></div>
      <div className="waveDetalleProducto"></div>
    </div>
  );
};

export default DetallesProd;
