export const usuariosPrueba = [
  { username: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'administrador' },
  { username: 'gerente', password: 'gerente123', nombre: 'Gerente', rol: 'gerente' },
  { username: 'vendedor', password: 'vendedor123', nombre: 'Vendedor', rol: 'vendedor' },
  { username: 'bodega', password: 'bodega123', nombre: 'Bodeguero', rol: 'bodeguero' },
  { username: 'auditor', password: 'auditor123', nombre: 'Auditor', rol: 'auditor' }
];

export function datosUsuario(usuario) {
  return {
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol
  };
}

export function requireAuth(req, res, next) {
  if (!req.session?.usuario) {
    return res.status(401).json({ mensaje: 'Debe iniciar sesion para usar esta ruta' });
  }

  next();
}

export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session?.usuario) {
      return res.status(401).json({ mensaje: 'Debe iniciar sesion para usar esta ruta' });
    }

    if (!rolesPermitidos.includes(req.session.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta accion' });
    }

    next();
  };
}
