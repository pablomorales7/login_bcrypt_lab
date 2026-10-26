const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Almacenamiento temporal en memoria: se pierde al reiniciar el proceso.
// No usar este diseño como almacenamiento real de cuentas.
const usuarios = [];

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Registro de usuario
app.post('/api/registro', async (req, res) => {
  try {
    const user = typeof req.body.user === 'string' ? req.body.user.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!user || !password) {
      return res.status(400).json({ mensaje: 'Ingrese usuario y contraseña.' });
    }
    if (user.length < 3 || user.length > 30) {
      return res.status(400).json({ mensaje: 'El usuario debe tener entre 3 y 30 caracteres.' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener entre 8 y 72 caracteres.' });
    }
    if (usuarios.some(u => u.user.toLowerCase() === user.toLowerCase())) {
      return res.status(409).json({ mensaje: 'El usuario ya existe.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    usuarios.push({ user, passwordHash });

    // No se devuelve el hash al cliente.
    return res.status(201).json({ mensaje: 'Usuario registrado correctamente. Ya puede iniciar sesión.' });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({ mensaje: 'Ocurrió un error interno.' });
  }
});

// Inicio de sesión
app.post('/api/login', async (req, res) => {
  try {
    const user = typeof req.body.user === 'string' ? req.body.user.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!user || !password) {
      return res.status(400).json({ mensaje: 'Ingrese usuario y contraseña.' });
    }

    const usuario = usuarios.find(u => u.user.toLowerCase() === user.toLowerCase());

    // Respuesta genérica para no revelar si el usuario existe.
    const passwordDummyHash = '$2a$10$7EqJtq98hPqEX7fNZaFWoO5u5N4wKxR7K8Vn7fZ8v4n6uQ7gM8u9K';
    const hashParaComparar = usuario ? usuario.passwordHash : passwordDummyHash;
    const passwordValida = await bcrypt.compare(password, hashParaComparar);

    if (!usuario || !passwordValida) {
      return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos.' });
    }

    return res.status(200).json({ mensaje: `Bienvenido, ${usuario.user}. Inicio de sesión correcto.` });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Ocurrió un error interno.' });
  }
});

// Endpoint didáctico para comprobar que la aplicación responde.
// No revela usuarios ni hashes.
app.get('/api/estado', (req, res) => {
  res.json({ estado: 'ok', aplicacion: 'Login bcrypt', usuariosRegistrados: usuarios.length });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
});
