// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from '../../images/logo TechMoll.png';
import './Header.css';

function Header() {
  const location = useLocation();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioInfo = localStorage.getItem('usuario');

    if (token && usuarioInfo) {
      try {
        const usuario = JSON.parse(usuarioInfo);
        setNombreUsuario(usuario.nombre);
        setRolUsuario(usuario.rol);
      } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
  }, [location.pathname]); // Se actualiza cuando cambia la ruta

  // Solo mostrar el encabezado si no estamos en las rutas de crear cuenta o iniciar sesión
  if (location.pathname === '/crear-cuenta' || location.pathname === '/IniciarSesion') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setNombreUsuario('');
    setRolUsuario('');
  };

  return (
    <header className="top-header">
      <Link to="/" className="logo-container">
        <img src={logo} alt="TechMoll Logo" className="logo" />
        <h1 className="site-name">TechMoll</h1>
      </Link>

      <input 
        type="text" 
        className="search-bar" 
        placeholder="Buscar productos..." 
      />

      <div className="user-options">
        {nombreUsuario ? (
          <div className="user-menu">
            <Link to="/perfil" className="user-button">
              <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="Usuario" className="user-icon" />
              Hola, {nombreUsuario}
            </Link>
            {rolUsuario === 'admin' && (
              <Link to="/Administrativo" className="admin-button">
                Panel de Administración
              </Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link to="/IniciarSesion" className="user-button">
            <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="Usuario" className="user-icon" />
            Iniciar Sesión
          </Link>
        )}
        <Link to="/carrito">
          <img src="https://cdn-icons-png.freepik.com/512/5993/5993337.png" alt="Carrito" className="cart-icon" />
          Carrito
        </Link>
      </div>
    </header>
  );
}

export default Header;