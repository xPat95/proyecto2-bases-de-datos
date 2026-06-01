import { Router } from 'express';
import { datosUsuario, usuariosPrueba } from '../auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contrasena son requeridos' });
  }

  const usuario = usuariosPrueba.find((item) => item.username === username && item.password === password);
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  req.session.usuario = datosUsuario(usuario);
  res.json({ mensaje: 'Sesion iniciada correctamente', usuario: req.session.usuario });
});

router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ mensaje: 'No se pudo cerrar la sesion' });
    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesion cerrada correctamente' });
  });
});

router.get('/me', (req, res) => {
  res.json({ usuario: req.session?.usuario || null });
});

export default router;
