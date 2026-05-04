import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function validarCliente(body) {
  const requeridos = ['nombre', 'apellido', 'telefono', 'correo', 'direccion'];
  for (const campo of requeridos) {
    if (!body[campo]) return `El campo ${campo} es requerido`;
  }
  return null;
}

router.get('/', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT idCliente AS "idCliente", nombre, apellido, telefono, correo, direccion, fechaRegistro AS "fechaRegistro"
      FROM cliente
      ORDER BY idCliente
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT idCliente AS "idCliente", nombre, apellido, telefono, correo, direccion, fechaRegistro AS "fechaRegistro"
      FROM cliente
      WHERE idCliente = $1
    `, [req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const error = validarCliente(req.body);
    if (error) return res.status(400).json({ mensaje: error });

    const result = await query(`
      INSERT INTO cliente (nombre, apellido, telefono, correo, direccion, fechaRegistro)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      RETURNING idCliente AS "idCliente", nombre, apellido, telefono, correo, direccion, fechaRegistro AS "fechaRegistro"
    `, [req.body.nombre, req.body.apellido, req.body.telefono, req.body.correo, req.body.direccion]);

    res.status(201).json({ mensaje: 'Cliente creado correctamente', cliente: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ mensaje: 'Ya existe un cliente con ese correo' });
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const error = validarCliente(req.body);
    if (error) return res.status(400).json({ mensaje: error });

    const result = await query(`
      UPDATE cliente
      SET nombre = $1,
          apellido = $2,
          telefono = $3,
          correo = $4,
          direccion = $5
      WHERE idCliente = $6
      RETURNING idCliente AS "idCliente", nombre, apellido, telefono, correo, direccion, fechaRegistro AS "fechaRegistro"
    `, [req.body.nombre, req.body.apellido, req.body.telefono, req.body.correo, req.body.direccion, req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado correctamente', cliente: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ mensaje: 'Ya existe un cliente con ese correo' });
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM cliente WHERE idCliente = $1 RETURNING idCliente AS "idCliente"', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    if (error.code === '23503') return res.status(409).json({ mensaje: 'No se puede eliminar el cliente porque tiene ventas asociadas' });
    next(error);
  }
});

export default router;
