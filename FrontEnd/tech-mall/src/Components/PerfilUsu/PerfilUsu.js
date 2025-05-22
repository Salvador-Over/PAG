import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode
import './PerfilUsu.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nombre: '', email: '', rol: '' });
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleInvalidSession = () => {
      alert('Tu sesión ha expirado o es inválida. Por favor, inicia sesión nuevamente.');
      handleLogout();
    };

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          nombre: decodedToken.nombre || 'Nombre no disponible',
          email: decodedToken.email || 'Email no disponible',
          rol: decodedToken.rol || 'Rol no disponible',
        });
      } catch (error) {
        console.error('Token inválido:', error);
        handleInvalidSession();
      }
    } else {
      handleInvalidSession();
    }
  }, [token]);

  const handleDeleteAccount = () => {
    fetch('http://localhost:5000/usu/borrarUsuario', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert('Cuenta eliminada con éxito');
          handleLogout();
        } else {
          throw new Error('No se pudo eliminar la cuenta');
        }
      })
      .catch((error) => alert(`Error: ${error.message}`));
  };

  return (
    <div className="container-perfil">
      <div className="perfil-container">
        <h2>Perfil de Usuario</h2>
        <div className="user-info">
          <p className="user-name"><strong>Nombre:</strong> {user.nombre}</p>
          <p className="user-email"><strong>Correo Electrónico:</strong> {user.email}</p>
          <p className="user-rol"><strong>Rol:</strong> {user.rol}</p>
        </div>
        <div className="button-container">
          <button onClick={handleLogout}>Cerrar Sesión</button>
          <button onClick={() => navigate('/EditarCuenta')}>Editar Cuenta</button>
          <button className="eliminar" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
          <button className="volver3" onClick={() => navigate('/')}>Volver</button>

          {/* Mostrar botón solo si el usuario es admin */}
          {user.rol === 'admin' && (
            <button className="admin-button" onClick={() => navigate('/Administrativo')}>
              Panel de Administración
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
