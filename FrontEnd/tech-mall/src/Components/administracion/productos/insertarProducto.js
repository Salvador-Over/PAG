import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './insertarProducto.css';

const CrearProducto = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState('Consola');
  const [estado, setEstado] = useState('activado');
  const [stock, setStock] = useState('');
  const [mensaje, setMensaje] = useState(null);

  // Características adicionales
  const [camara, setCamara] = useState('');
  const [bluetooth, setBluetooth] = useState(true);
  const [gps, setGps] = useState(true);
  const [wifi, setWifi] = useState(true);
  const [usb, setUsb] = useState('');
  const [bateria, setBateria] = useState('');
  const [sistemaOperativo, setSistemaOperativo] = useState('');
  const [resoluciones, setResoluciones] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [peso, setPeso] = useState('');
  const [color, setColor] = useState('Blanco');
  const [almacenamiento, setAlmacenamiento] = useState('');
  const [procesador, setProcesador] = useState('');
  const [tarjetaVideo, setTarjetaVideo] = useState('');
  const [ram, setMemoriaRam] = useState('');
  const [sensores, setSensores] = useState(true);
  const [pantalla, setPantalla] = useState('');
  const [calificacion, setCalificacion] = useState(1);
  const [opiniones, setOpiniones] = useState('Sin opiniones');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/prod/nuevoProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre,
        descripcion,
        monto: Number(monto),
        imagen,
        estado,
        categoria,
        stock: Number(stock),
        características: {
          camara,
          bluetooth,
          gps,
          wifi,
          usb: Number(usb),
          bateria,
          sistemaOperativo,
          resoluciones,
          tamaño,
          peso,
          color,
          almacenamiento,
          procesador,
          tarjetaVideo,
          ram,
          sensores,
          pantalla,
          calificacion,
          opiniones
        }
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al insertar el producto');
        }
        return response.json();
      })
      .then((data) => {
        setMensaje('Producto insertado con éxito');
        // Limpiar los campos
        setNombre('');
        setDescripcion('');
        setMonto('');
        setImagen('');
        setCategoria('Consola');
        setStock('');
        // Limpiar características
        setCamara('');
        setBluetooth(true);
        setGps(true);
        setWifi(true);
        setUsb('');
        setBateria('');
        setSistemaOperativo('');
        setResoluciones('');
        setTamaño('');
        setPeso('');
        setColor('Blanco');
        setAlmacenamiento('');
        setProcesador('');
        setTarjetaVideo('');
        setMemoriaRam('');
        setSensores(true);
        setPantalla('');
        setCalificacion(1);
        setOpiniones('Sin opiniones');

        setTimeout(() => {
          setMensaje(null);
          navigate('/producto');
        }, 3000);
      })
      .catch((error) => {
        setMensaje(`Error: ${error.message}`);
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      });
  };

  return (
    <div className="crear-producto-container">
      <h2>Crear Producto</h2>
      {mensaje && <div className="tooltip">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        {/* Campos básicos */}
        <div>
          <label>Nombre del Producto:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Descripción:</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} required />
        </div>
        <div>
          <label>Imagen (URL):</label>
          <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
        </div>
        <div>
          <label>Categoría:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Consola">Consola</option>
            <option value="Telefono">Teléfono</option>
            <option value="Videojuego">Videojuego</option>
            <option value="Computadora">Computadora</option>
            <option value="Television">Televisión</option>
            <option value="Tablet">Tablet</option>
            <option value="Monitor">Monitor</option>
            <option value="Accesorio">Accesorio</option>
          </select>
        </div>
        <div>
          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="activado">Activado</option>
            <option value="desactivado">Desactivado</option>
          </select>
        </div>
        <div>
          <label>Stock:</label>
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        {/* Características */}
        <div>
          <label>Cámara:</label>
          <input type="text" value={camara} onChange={(e) => setCamara(e.target.value)} />
        </div>
        <div>
          <label>Bluetooth:</label>
          <input type="checkbox" checked={bluetooth} onChange={() => setBluetooth(!bluetooth)} /><br/>
        </div>
        <div>
        <label>GPS:</label>
          <input type="checkbox" checked={gps} onChange={() => setBluetooth(!gps)} /><br/>
        </div>
        <div>
          <label>Wifi:</label>
          <input type="checkbox" checked={wifi} onChange={() => setBluetooth(!wifi)} /><br/>
        </div>
        <div>
          <label>Usb:</label>
          <input type="number" value={usb} onChange={(e) => setUsb(e.target.value)} />
        </div>
        <div>
          <label>Bateria:</label>
          <input type="text" value={bateria} onChange={(e) => setBateria(e.target.value)} />
        </div>
        <div>
          <label>Sistema Operativo:</label>
          <input type="text" value={sistemaOperativo} onChange={(e) => setSistemaOperativo(e.target.value)} />
        </div>
        <div>
          <label>Resoluciones:</label>
          <input type="text" value={resoluciones} onChange={(e) => setResoluciones(e.target.value)} />
        </div>
        <div>
          <label>Tamaño:</label>
          <input type="text" value={tamaño} onChange={(e) => setTamaño(e.target.value)} />
        </div>
        <div>
          <label>Peso:</label>
          <input type="text" value={peso} onChange={(e) => setPeso(e.target.value)} />
        </div>
        <div>
          <label>Color:</label>
          <select value={color} onChange={(e) => setColor(e.target.value)}> 
            <option value="Blanco">Blanco</option>
            <option value="Begro">Negro</option>
            <option value="Azul">Azul</option>
            <option value="Rojo">Rojo</option>
            <option value="Verde">Verde</option>
            <option value="Gris">Gris</option>
          </select>
        </div>
        <div>
          <label>almacenamiento:</label>
          <input type="text" value={almacenamiento} onChange={(e) => setAlmacenamiento(e.target.value)} />
        </div>
        <div>
          <label>Procesador:</label>
          <input type="text" value={procesador} onChange={(e) => setProcesador(e.target.value)} />
        </div>
        <div>
          <label>Tarjeda de Video:</label>
          <input type="text" value={tarjetaVideo} onChange={(e) => setTarjetaVideo(e.target.value)} />
        </div>
        <div>
          <label>Memoria RAM:</label>
          <input type="text" value={ram} onChange={(e) => setMemoriaRam(e.target.value)} />
        </div>
        <div>
          <label>Sensores:</label>
          <input type="checkbox" checked={sensores} onChange={(e) => setSensores(e.target.checked)} />
        </div>
        <div>
          <label>Pantalla:</label>
          <input type="text" value={pantalla} onChange={(e) => setPantalla(e.target.value)} />
        </div>
        <div>
          <label>calificacion:</label>
          <select value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          <label>opiniones:</label>
          <select value={opiniones} onChange={(e) => setOpiniones(e.target.value)}>
            <option value="Buena">Buena</option>
            <option value="Regular">Regular</option>
            <option value="Mala">Mala</option>
            <option value="Muy mala">Muy mala</option>
            <option value="Sin opiniones">Sin opiniones</option>
          </select>
        </div>
        {/* Resto de las características aquí */}
        <button type="submit">Agregar Producto</button>
      </form>
      <button className='volverAdmin' onClick={() => navigate('/producto')}><strong>Volver a la lista de productos</strong></button>
    </div>
  );
};

export default CrearProducto;
