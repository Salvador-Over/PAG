import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from './UserCard/UserCard';
import './GestionUsu.css';
import { useNavigate } from 'react-router-dom';

const GestionUsu = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/usu/usuarios', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener los usuarios', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/usu/borrarUsuario/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsuarios(usuarios.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error al eliminar el usuario', error);
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await axios.put('/usu/cambiarRolUsuario', {
                userId,
                rol: newRole
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchUsuarios();
        } catch (error) {
            console.error('Error al cambiar el rol del usuario', error);
        }
    };

    return (
        <div className="gestionar-usuarios-container">
            <h2>Administración de usuarios</h2>
            <div className="usuarios-grid">
                {usuarios.map(usuario => (
                    <UserCard 
                        key={usuario._id} 
                        usuario={usuario} 
                        onDelete={handleDelete} 
                        onChangeRole={handleChangeRole}
                    />
                ))}
            </div>
            <button className="btn-volver" onClick={() => navigate('/Administrativo')}>Volver</button>
        </div>
    );
};

export default GestionUsu;