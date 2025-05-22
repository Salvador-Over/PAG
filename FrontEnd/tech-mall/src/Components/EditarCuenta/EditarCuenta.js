import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './EditarCuenta.css';

const EditarCuenta = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nombre: '', email: '', rol: '' });
  const [error, setError] = useState('');
  const [logoutMessageShown, setLogoutMessageShown] = useState(false); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = () => {
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          setUser({
            nombre: decodedUser.nombre || 'Nombre no disponible',
            email: decodedUser.email || 'Email no disponible',
            rol: decodedUser.rol || 'Usuario',
          });
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          if (!logoutMessageShown) {
            setError('Token inválido. Por favor, inicia sesión nuevamente.');
            setLogoutMessageShown(true);
          }
          navigate('/login'); 
        }
      } else {
        if (!logoutMessageShown) {
          setError('No se ha encontrado un token. Por favor, inicia sesión.');
          setLogoutMessageShown(true);
        }
        navigate('/login'); 
      }
    };

    verifyToken();
  }, [token, navigate, logoutMessageShown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await fetch('http://localhost:5000/usu/actualizarUsuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: user.nombre,
          email: user.email,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar la información del usuario');
      const data = await response.json();

      localStorage.setItem('token', data.token); 

      setUser((prevUser) => ({ ...prevUser, nombre: data.usuario.nombre, email: data.usuario.email }));

      alert('Información del usuario actualizada con éxito');
      navigate('/perfil'); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="editar-cuenta-container">
      <h2>Editar Cuenta</h2>
      {error && <p className="error">{error}</p>} 
        <form onSubmit={handleSubmitUser}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={user.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Actualizar Cuenta</button>
        </form>
      <button onClick={() => navigate('/perfil')}>Volver al Perfil</button>
    </div>
  );
};

export default EditarCuenta;