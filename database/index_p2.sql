CREATE INDEX idx_producto_nombre 
ON producto(nombre);

CREATE INDEX idx_producto_categoria 
ON producto(idCategoria);

CREATE INDEX idx_producto_proveedor 
ON producto(idProveedor);

CREATE INDEX idx_venta_fecha 
ON venta(fechaVenta);

CREATE INDEX idx_venta_cliente 
ON venta(idCliente);

CREATE INDEX idx_venta_empleado 
ON venta(idEmpleado);

CREATE INDEX idx_detalle_venta 
ON detalleVenta(idVenta);

CREATE INDEX idx_detalle_producto 
ON detalleVenta(idProducto);

CREATE OR REPLACE VIEW vista_resumen_ventas AS
SELECT
    v.idVenta AS "idVenta",
    v.fechaVenta AS "fechaVenta",
    c.nombre || ' ' || c.apellido AS cliente,
    e.nombre || ' ' || e.apellido AS empleado,
    COUNT(dv.idDetalleVenta)::int AS "lineasDetalle",
    SUM(dv.cantidad)::int AS "cantidadProductos",
    v.total,
    v.metodoPago AS "metodoPago"
FROM venta v
JOIN cliente c ON v.idCliente = c.idCliente
JOIN empleado e ON v.idEmpleado = e.idEmpleado
JOIN detalleVenta dv ON v.idVenta = dv.idVenta
GROUP BY v.idVenta, v.fechaVenta, c.nombre, c.apellido, e.nombre, e.apellido, v.total, v.metodoPago;
