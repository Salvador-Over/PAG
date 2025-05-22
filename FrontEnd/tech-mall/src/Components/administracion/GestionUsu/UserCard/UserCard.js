import React, { useState } from 'react';

const UserCard = ({ usuario, onDelete, onChangeRole }) => {
    const [selectedRole, setSelectedRole] = useState(usuario.rol);

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setSelectedRole(newRole);
        onChangeRole(usuario._id, newRole);
    };

    return (
        <div className="user-card">
            <h3>{usuario.nombre}</h3>
            <p>{usuario.email}</p>
            <button className='btn-eliminar' onClick={() => onDelete(usuario._id)}>Eliminar</button>
            <div>
                <label>Cambiar rol:</label>
                <select value={selectedRole} onChange={handleRoleChange}>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                </select>
                <button className='btn-rol' onClick={() => onChangeRole(usuario._id, selectedRole)}>Aplicar</button>
            </div>
        </div>
    );
};

export default UserCard;