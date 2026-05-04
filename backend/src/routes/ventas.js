import { Router } from 'express';
import { pool, query } from '../db.js';

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

router.post('/', async (req, res, next) => {
  const { idCliente, idEmpleado, idProducto, cantidad, metodoPago } = req.body;
  const cantidadNumerica = Number(cantidad);

  if (!idCliente || !idEmpleado || !idProducto || !metodoPago) {
    return res.status(400).json({ mensaje: 'idCliente, idEmpleado, idProducto y metodoPago son requeridos' });
  }
  if (!Number.isInteger(cantidadNumerica) || cantidadNumerica <= 0) {
    return res.status(400).json({ mensaje: 'La cantidad debe ser un entero mayor a cero' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const producto = await client.query(`
      SELECT idProducto AS "idProducto", nombre, precioVenta AS "precioVenta", stock
      FROM producto
      WHERE idProducto = $1
      FOR UPDATE
    `, [idProducto]);

    if (producto.rowCount === 0) {
      throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
    }

    const item = producto.rows[0];
    if (Number(item.stock) < cantidadNumerica) {
      throw Object.assign(new Error(`Stock insuficiente. Disponible: ${item.stock}`), { status: 400 });
    }

    const total = Number(item.precioVenta) * cantidadNumerica;

    const venta = await client.query(`
      INSERT INTO venta (fechaVenta, total, metodoPago, idCliente, idEmpleado)
      VALUES (NOW(), $1, $2, $3, $4)
      RETURNING idVenta AS "idVenta", fechaVenta AS "fechaVenta", total, metodoPago AS "metodoPago",
        idCliente AS "idCliente", idEmpleado AS "idEmpleado"
    `, [total, metodoPago, idCliente, idEmpleado]);

    const detalle = await client.query(`
      INSERT INTO detalleVenta (cantidad, precioUnitario, subtotal, idVenta, idProducto)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING idDetalleVenta AS "idDetalleVenta", cantidad, precioUnitario AS "precioUnitario",
        subtotal, idVenta AS "idVenta", idProducto AS "idProducto"
    `, [cantidadNumerica, item.precioVenta, total, venta.rows[0].idVenta, idProducto]);

    await client.query(`
      UPDATE producto
      SET stock = stock - $1
      WHERE idProducto = $2
    `, [cantidadNumerica, idProducto]);

    await client.query('COMMIT');

    res.status(201).json({
      mensaje: 'Venta registrada correctamente',
      venta: venta.rows[0],
      detalle: detalle.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    if (error.code === '23503') return res.status(400).json({ mensaje: 'Cliente o empleado no existe' });
    next(error);
  } finally {
    client.release();
  }
});

export default router;
