// MenuAdministrativo.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de tener jwt-decode instalado.
import './menuAdministrativo.css'; // Agrega estilos personalizados
import { FaBox, FaUsers, FaArrowLeft } from 'react-icons/fa'; // Librería de íconos react-icons

const MenuAdministrativo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ rol: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ rol: decodedToken.rol });
        if (decodedToken.rol !== 'admin') {
          alert('Acceso denegado: No tienes permisos de administrador');
          navigate('/perfil'); // Redirige al perfil si no es admin
        }
      } catch (error) {
        console.error('Token inválido:', error);
        navigate('/login'); // Redirige al login si el token es inválido
      }
    } else {
      navigate('/login'); // Redirige al login si no hay token
    }
  }, [token, navigate]);

  return (
    <div className="menu-admin-container">
      <h2>Menú Administrativo</h2>
      <p>Selecciona una opción para gestionar la plataforma.</p>

      <div className="menu-options">
        <div className="menu-item" onClick={() => navigate('/producto')}>
          <FaBox className="menu-icon" />
          <span>Gestionar Productos</span>
        </div>

        <div className="menu-item" onClick={() => navigate('/gestion-usuarios')}>
          <FaUsers className="menu-icon" />
          <span>Gestionar Usuarios</span>
        </div>

        <div className="menu-item" onClick={() => navigate('/perfil')}>
          <FaArrowLeft className="menu-icon" />
          <span>Volver al Perfil</span>
        </div>
      </div>
    </div>
  );
};

export default MenuAdministrativo;
