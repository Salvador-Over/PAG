import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Crear_Cuenta.css'; // Asegúrate de que la ruta sea correcta

const CrearCuenta = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviar los datos al backend
    fetch('http://localhost:5000/usu/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, password, email, rol: 'usuario' }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al insertar el usuario');
        }
        return response.json();
      })
      .then((data) => {
        setMensaje('Usuario insertado con éxito');
        // Limpiar los campos
        setNombre('');
        setPassword('');
        setEmail('');

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
          navigate('/IniciarSesion'); // Redirige al login después de registrarse
        }, 3000);
      })
      .catch((error) => {
        setMensaje(`Error: ${error.message}`);
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
      });
  };

  return (
    <div className="create-account-container">
      <h2>Crear Cuenta</h2>
      {mensaje && <div className="tooltip">{mensaje}</div>} {/* Mostrar mensaje de éxito o error */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/IniciarSesion">Inicia sesión aquí</Link>
      </p> {/* Enlace a la página de login */}
      <button className='volver' onClick={() => navigate('/')}><strong>Volver a la página principal</strong></button>
      {/*Se hizo merge desde la rama master*/}
    </div>
  );
};

export default CrearCuenta;
