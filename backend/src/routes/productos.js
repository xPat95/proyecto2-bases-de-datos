import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

function validarProducto(body) {
  const requeridos = ['nombre', 'descripcion', 'precioCompra', 'precioVenta', 'stock', 'stockMinimo', 'idCategoria', 'idProveedor'];
  for (const campo of requeridos) {
    if (body[campo] === undefined || body[campo] === '') {
      return `El campo ${campo} es requerido`;
    }
  }

  if (Number(body.precioCompra) < 0 || Number(body.precioVenta) < 0) return 'Los precios no pueden ser negativos';
  if (Number(body.stock) < 0 || Number(body.stockMinimo) < 0) return 'El stock no puede ser negativo';
  return null;
}

router.get('/', async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT
        p.idProducto AS "idProducto",
        p.nombre,
        p.descripcion,
        p.precioCompra AS "precioCompra",
        p.precioVenta AS "precioVenta",
        p.stock,
        p.stockMinimo AS "stockMinimo",
        p.idCategoria AS "idCategoria",
        c.nombre AS categoria,
        p.idProveedor AS "idProveedor",
        pr.nombreEmpresa AS proveedor
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

router.get('/opciones/categorias-proveedores', async (_req, res, next) => {
  try {
    const [categorias, proveedores] = await Promise.all([
      query('SELECT idCategoria AS "idCategoria", nombre FROM categoria ORDER BY idCategoria'),
      query('SELECT idProveedor AS "idProveedor", nombreEmpresa AS "nombreEmpresa" FROM proveedor ORDER BY idProveedor')
    ]);
    res.json({ categorias: categorias.rows, proveedores: proveedores.rows });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT
        idProducto AS "idProducto",
        nombre,
        descripcion,
        precioCompra AS "precioCompra",
        precioVenta AS "precioVenta",
        stock,
        stockMinimo AS "stockMinimo",
        idCategoria AS "idCategoria",
        idProveedor AS "idProveedor"
      FROM producto
      WHERE idProducto = $1
    `, [req.params.id]);

    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const error = validarProducto(req.body);
    if (error) return res.status(400).json({ mensaje: error });

    const result = await query(`
      INSERT INTO producto (nombre, descripcion, precioCompra, precioVenta, stock, stockMinimo, idCategoria, idProveedor)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING idProducto AS "idProducto", nombre, descripcion, precioCompra AS "precioCompra",
        precioVenta AS "precioVenta", stock, stockMinimo AS "stockMinimo",
        idCategoria AS "idCategoria", idProveedor AS "idProveedor"
    `, [
      req.body.nombre,
      req.body.descripcion,
      req.body.precioCompra,
      req.body.precioVenta,
      req.body.stock,
      req.body.stockMinimo,
      req.body.idCategoria,
      req.body.idProveedor
    ]);

    res.status(201).json({ mensaje: 'Producto creado correctamente', producto: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const error = validarProducto(req.body);
    if (error) return res.status(400).json({ mensaje: error });

    const result = await query(`
      UPDATE producto
      SET nombre = $1,
          descripcion = $2,
          precioCompra = $3,
          precioVenta = $4,
          stock = $5,
          stockMinimo = $6,
          idCategoria = $7,
          idProveedor = $8
      WHERE idProducto = $9
      RETURNING idProducto AS "idProducto", nombre, descripcion, precioCompra AS "precioCompra",
        precioVenta AS "precioVenta", stock, stockMinimo AS "stockMinimo",
        idCategoria AS "idCategoria", idProveedor AS "idProveedor"
    `, [
      req.body.nombre,
      req.body.descripcion,
      req.body.precioCompra,
      req.body.precioVenta,
      req.body.stock,
      req.body.stockMinimo,
      req.body.idCategoria,
      req.body.idProveedor,
      req.params.id
    ]);

    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente', producto: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM producto WHERE idProducto = $1 RETURNING idProducto AS "idProducto"', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    if (error.code === '23503') return res.status(409).json({ mensaje: 'No se puede eliminar el producto porque tiene ventas asociadas' });
    next(error);
  }
});

export default router;
