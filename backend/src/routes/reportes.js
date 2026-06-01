import { Router } from 'express';
import { pool, query } from '../db.js';

const router = Router();

router.get('/dashboard', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*)::int FROM producto) AS "totalProductos",
        (SELECT COUNT(*)::int FROM cliente) AS "totalClientes",
        (SELECT COUNT(*)::int FROM venta) AS "totalVentas",
        COALESCE((SELECT SUM(total) FROM venta), 0) AS "totalVendido"
    `);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/stock-bajo-procedure', async (req, res, next) => {
  const limite = req.query.limite ? Number(req.query.limite) : null;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('CALL sp_consultar_stock_bajo($1, $2)', [limite, 'stock_bajo_cursor']);
    const result = await client.query('FETCH ALL FROM stock_bajo_cursor');
    await client.query('COMMIT');
    res.json(result.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

router.get('/total-producto-procedure/:id', async (req, res, next) => {
  try {
    const result = await query('CALL sp_total_vendido_producto($1, NULL, NULL, NULL)', [req.params.id]);
    res.json({
      producto: result.rows[0].p_producto,
      cantidadVendida: result.rows[0].p_cantidad_vendida,
      totalVendido: result.rows[0].p_total_vendido
    });
  } catch (error) {
    if (error.message.includes('Producto no encontrado')) return res.status(404).json({ mensaje: error.message });
    next(error);
  }
});

router.get('/ventas-detalle', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        v.idVenta AS "idVenta",
        v.fechaVenta AS "fechaVenta",
        c.nombre || ' ' || c.apellido AS cliente,
        e.nombre || ' ' || e.apellido AS empleado,
        p.nombre AS producto,
        dv.cantidad,
        dv.precioUnitario AS "precioUnitario",
        dv.subtotal,
        v.metodoPago AS "metodoPago"
      FROM venta v
      JOIN cliente c ON v.idCliente = c.idCliente
      JOIN empleado e ON v.idEmpleado = e.idEmpleado
      JOIN detalleVenta dv ON v.idVenta = dv.idVenta
      JOIN producto p ON dv.idProducto = p.idProducto
      ORDER BY v.fechaVenta DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/productos-proveedor', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        p.idProducto AS "idProducto",
        p.nombre AS producto,
        c.nombre AS categoria,
        pr.nombreEmpresa AS proveedor,
        p.precioVenta AS "precioVenta",
        p.stock
      FROM producto p
      JOIN categoria c ON p.idCategoria = c.idCategoria
      JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      ORDER BY p.idProducto
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/ventas-cliente', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        c.idCliente AS "idCliente",
        c.nombre || ' ' || c.apellido AS cliente,
        COUNT(v.idVenta)::int AS "cantidadVentas",
        COALESCE(SUM(v.total), 0) AS "totalComprado"
      FROM cliente c
      JOIN venta v ON c.idCliente = v.idCliente
      GROUP BY c.idCliente, c.nombre, c.apellido
      ORDER BY "totalComprado" DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/productos-caros', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT idProducto AS "idProducto", nombre, precioVenta AS "precioVenta"
      FROM producto
      WHERE precioVenta > (SELECT AVG(precioVenta) FROM producto)
      ORDER BY precioVenta DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/clientes-con-compras', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT idCliente AS "idCliente", nombre, apellido, correo
      FROM cliente c
      WHERE EXISTS (
        SELECT 1
        FROM venta v
        WHERE v.idCliente = c.idCliente
      )
      ORDER BY idCliente
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/ventas-por-producto', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        p.idProducto AS "idProducto",
        p.nombre AS producto,
        SUM(dv.cantidad)::int AS "cantidadVendida",
        SUM(dv.subtotal) AS "ingresosTotales"
      FROM producto p
      JOIN detalleVenta dv ON p.idProducto = dv.idProducto
      GROUP BY p.idProducto, p.nombre
      HAVING SUM(dv.cantidad) > 0
      ORDER BY "cantidadVendida" DESC
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/top-productos', async (_req, res, next) => {
  try {
    const result = await query(`
      WITH ventas_producto AS (
        SELECT
          p.idProducto,
          p.nombre AS producto,
          SUM(dv.cantidad) AS cantidad_vendida,
          SUM(dv.subtotal) AS ingresos
        FROM producto p
        JOIN detalleVenta dv ON p.idProducto = dv.idProducto
        GROUP BY p.idProducto, p.nombre
      )
      SELECT
        idProducto AS "idProducto",
        producto,
        cantidad_vendida::int AS "cantidadVendida",
        ingresos
      FROM ventas_producto
      ORDER BY cantidad_vendida DESC, ingresos DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/resumen-ventas', async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM vista_resumen_ventas ORDER BY "fechaVenta" DESC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
