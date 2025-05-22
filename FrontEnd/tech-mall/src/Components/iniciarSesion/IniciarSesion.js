import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IniciarSesion.css';

const Login = () => {
  const navigate = useNavigate();
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [password_usuario, setPasswordUsuario] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:5000/usu/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_usuario, password_usuario }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Credenciales incorrectas');
        return response.json();
      })
      .then((data) => {
        // Almacena el token y la información del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: data.usuario.id,
          nombre: data.usuario.nombre,
          apellido: data.usuario.apellido,
          email: data.usuario.email,
          username: data.usuario.username
        }));
        setMensaje('Inicio de sesión exitoso');
        console.log('Inicio de sesión exitoso:', data);
        setTimeout(() => {
          navigate('/'); // Redirige a la página principal
        }, 1000);
      })
      .catch((error) => {
        setMensaje(`Error: ${error.message}`);
        setTimeout(() => setMensaje(null), 3000);
      });
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {mensaje && <div className="tooltip">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password_usuario}
            onChange={(e) => setPasswordUsuario(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
        <button className='volver2' onClick={() => navigate('/')}><strong>Volver a la página principal</strong></button>
      </form>
    </div>
  );
};

export default Login;