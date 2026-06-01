import { Router } from 'express';
import { query } from '../db.js';
import { requireRole } from '../auth.js';

const router = Router();

router.get('/opciones', async (_req, res, next) => {
  try {
    const [clientes, empleados, productos] = await Promise.all([
      query('SELECT idCliente AS "idCliente", nombre, apellido FROM cliente ORDER BY idCliente'),
      query('SELECT idEmpleado AS "idEmpleado", nombre, apellido FROM empleado WHERE estado = $1 ORDER BY idEmpleado', ['Activo']),
      query('SELECT idProducto AS "idProducto", nombre, precioVenta AS "precioVenta", stock FROM producto ORDER BY idProducto')
    ]);
    res.json({ clientes: clientes.rows, empleados: empleados.rows, productos: productos.rows });
  } catch (error) {
    next(error);
  }
});

router.post('/control-transaccion', requireRole('administrador', 'gerente', 'vendedor'), async (req, res, next) => {
  const { idCliente, idEmpleado, idProducto, cantidad, metodoPago } = req.body;
  const cantidadNumerica = Number(cantidad);

  if (!idCliente || !idEmpleado || !idProducto || !metodoPago) {
    return res.status(400).json({ mensaje: 'idCliente, idEmpleado, idProducto y metodoPago son requeridos' });
  }
  if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor a cero' });
  }

  try {
    await query(
      'CALL sp_registrar_venta_con_control($1, $2, $3, $4, $5)',
      [idCliente, idEmpleado, idProducto, cantidadNumerica, metodoPago]
    );

    res.status(201).json({
      mensaje: 'Venta registrada con procedure transaccional'
    });
  } catch (error) {
    if (error.message.includes('Producto no encontrado')) return res.status(404).json({ mensaje: error.message });
    if (error.message.includes('Stock insuficiente')) return res.status(400).json({ mensaje: error.message });
    if (error.message.includes('cantidad')) return res.status(400).json({ mensaje: error.message });
    if (error.code === '23503') return res.status(400).json({ mensaje: 'Cliente o empleado no existe' });
    next(error);
  }
});

router.post('/', requireRole('administrador', 'gerente', 'vendedor'), async (req, res, next) => {
  const { idCliente, idEmpleado, idProducto, cantidad, metodoPago } = req.body;
  const cantidadNumerica = Number(cantidad);

  if (!idCliente || !idEmpleado || !idProducto || !metodoPago) {
    return res.status(400).json({ mensaje: 'idCliente, idEmpleado, idProducto y metodoPago son requeridos' });
  }
  if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor a cero' });
  }

  try {
    const result = await query(
      'CALL sp_registrar_venta($1, $2, $3, $4, $5, NULL, NULL, NULL)',
      [idCliente, idEmpleado, idProducto, cantidadNumerica, metodoPago]
    );

    res.status(201).json({
      mensaje: result.rows[0].p_mensaje,
      venta: {
        idVenta: result.rows[0].p_id_venta,
        total: result.rows[0].p_total,
        idCliente,
        idEmpleado,
        metodoPago
      }
    });
  } catch (error) {
    if (error.message.includes('Producto no encontrado')) return res.status(404).json({ mensaje: error.message });
    if (error.message.includes('Stock insuficiente')) return res.status(400).json({ mensaje: error.message });
    if (error.message.includes('cantidad')) return res.status(400).json({ mensaje: error.message });
    if (error.code === '23503') return res.status(400).json({ mensaje: 'Cliente o empleado no existe' });
    next(error);
  }
});

export default router;
