const Usuario = require('../Model/usuarios.model');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const JWT_SECRET = 'tu_secreto_jwt_aqui'; // En producción, usar variables de entorno

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '123456',
    database: 'colchoneria'
});

// Función para hashear con SHA2
function hashSHA2(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol
        });

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { nombre_usuario, password_usuario } = req.body;
        console.log('Intento de login para usuario:', nombre_usuario);

        // Buscar usuario por username_usuario
        const [usuarios] = await pool.execute(
            'SELECT * FROM tbl_usuarios WHERE username_usuario = ?',
            [nombre_usuario]
        );

        if (usuarios.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = usuarios[0];

        if (usuario.estado_usuario === 0) {
            console.log('Usuario inactivo');
            return res.status(401).json({ message: 'Usuario inactivo' });
        }

        // Verificar el tipo de hash
        const esContraseñaEncriptada = usuario.password_usuario.startsWith('$2b$');
        const esContraseñaSHA2 = usuario.password_usuario.length === 64; // SHA2 produce un hash de 64 caracteres
        let passwordValida = false;

        if (esContraseñaEncriptada) {
            // Si está encriptada con bcrypt
            passwordValida = await bcrypt.compare(password_usuario, usuario.password_usuario);
        } else if (esContraseñaSHA2) {
            // Si está encriptada con SHA2
            const hashedPassword = hashSHA2(password_usuario);
            passwordValida = hashedPassword === usuario.password_usuario;
        } else {
            // Si no está encriptada, comparar directamente
            passwordValida = password_usuario === usuario.password_usuario;
        }

        if (!passwordValida) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Actualizar la última conexión
        await pool.execute(
            'UPDATE tbl_usuarios SET ultima_conexion_usuario = NOW() WHERE username_usuario = ?',
            [nombre_usuario]
        );

        // Generar token
        const token = jwt.sign(
            {
                id: usuario.Pk_id_usuario,
                username: usuario.username_usuario,
                nombre: usuario.nombre_usuario,
                apellido: usuario.apellido_usuario,
                email: usuario.email_usuario
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login exitoso, token generado');
        res.json({
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.Pk_id_usuario,
                nombre: usuario.nombre_usuario,
                apellido: usuario.apellido_usuario,
                email: usuario.email_usuario,
                username: usuario.username_usuario
            }
        });
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol']
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

exports.obtenerUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: ['id', 'nombre', 'email', 'rol']
        });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.update(req.body);
        res.json({
            message: 'Usuario actualizado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
};