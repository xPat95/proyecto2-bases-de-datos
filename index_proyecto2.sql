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