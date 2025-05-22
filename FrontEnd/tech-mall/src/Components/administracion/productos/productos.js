import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './productos.css'; // Estilos personalizados

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoHovered, setProductoHovered] = useState(null); // Estado para el producto sobre el que se pasa el mouse
  const [mensaje, setMensaje] = useState(null); // Estado para mensajes de éxito o error
  const navigate = useNavigate();

  // Obtener productos desde el backend
  useEffect(() => {
    fetch('http://localhost:5000/prod/productos')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al cargar productos:', error));
  }, []);

  const handleMouseEnter = (id) => {
    setProductoHovered(id); // Establecer el ID del producto sobre el que se pasa el mouse
  };

  const handleMouseLeave = () => {
    setProductoHovered(null); // Limpiar el ID del producto al salir
  };

  const handleDelete = (id) => {
    // Confirmar antes de eliminar
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost:5000/prod/borrarProducto/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al eliminar el producto');
          }
          return response.json();
        })
        .then((data) => {
          setMensaje('Producto eliminado con éxito');
          // Actualizar la lista de productos después de eliminar
          setProductos((prev) => prev.filter((producto) => producto._id !== id));
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        })
        .catch((error) => {
          setMensaje(`Error: ${error.message}`);
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje(null);
          }, 3000);
        });
    }
  };

  return (
    <div className="productos-container">
      <h2>Productos Disponibles</h2>
      {mensaje && <div className="tooltip">{mensaje}</div>} {/* Mostrar mensaje de éxito o error */}
      <div className="botones-container">
        <button className="menu-boton" onClick={() => navigate('/Administrativo')}>
          Volver
        </button>
        <button className="menu-boton" onClick={() => navigate('/insertar-producto')}>
          Insertar Producto
        </button>
      </div>

      <div className="productos-grid">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div
              key={producto._id}
              className="producto-card"
              onMouseEnter={() => handleMouseEnter(producto._id)}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="producto-imagen" 
              />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p><strong>Precio:</strong> Q {producto.monto}</p>
              
              {/* Contenedor para los botones */}
              <div className="botones-accion">
                {productoHovered === producto._id && (
                  <button 
                    className="boton-eliminar" 
                    onClick={() => handleDelete(producto._id)}
                  >
                    Eliminar Producto
                  </button>
                )}
                {productoHovered === producto._id && (
                  <button 
                    className="boton-editar" 
                    onClick={() => navigate(`/modificar-producto/${producto._id}`)}
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Productos;
