-- Stored procedures de negocio para Proyecto 3.

CREATE OR REPLACE PROCEDURE sp_registrar_venta(
    IN p_id_cliente INT,
    IN p_id_empleado INT,
    IN p_id_producto INT,
    IN p_cantidad INT,
    IN p_metodo_pago VARCHAR,
    OUT p_id_venta INT,
    OUT p_total NUMERIC,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_precio NUMERIC(10,2);
    v_stock INT;
BEGIN
    p_id_venta := NULL;
    p_total := 0;
    p_mensaje := 'Venta no procesada';

    SELECT precioVenta, stock
    INTO v_precio, v_stock
    FROM producto
    WHERE idProducto = p_id_producto
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto no encontrado';
    END IF;

    IF p_cantidad <= 0 THEN
        RAISE EXCEPTION 'La cantidad debe ser mayor a cero';
    END IF;

    IF v_stock < p_cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente. Disponible: %', v_stock;
    END IF;

    p_total := v_precio * p_cantidad;

    INSERT INTO venta (fechaVenta, total, metodoPago, idCliente, idEmpleado)
    VALUES (NOW(), p_total, p_metodo_pago, p_id_cliente, p_id_empleado)
    RETURNING idVenta INTO p_id_venta;

    INSERT INTO detalleVenta (cantidad, precioUnitario, subtotal, idVenta, idProducto)
    VALUES (p_cantidad, v_precio, p_total, p_id_venta, p_id_producto);

    UPDATE producto
    SET stock = stock - p_cantidad
    WHERE idProducto = p_id_producto;

    p_mensaje := 'Venta registrada correctamente';
EXCEPTION
    WHEN OTHERS THEN
        p_id_venta := NULL;
        p_total := 0;
        p_mensaje := SQLERRM;
        RAISE;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_actualizar_stock(
    IN p_id_producto INT,
    IN p_cambio INT,
    OUT p_nuevo_stock INT,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_stock_actual INT;
BEGIN
    SELECT stock
    INTO v_stock_actual
    FROM producto
    WHERE idProducto = p_id_producto
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Producto no encontrado';
    END IF;

    IF v_stock_actual + p_cambio < 0 THEN
        RAISE EXCEPTION 'El stock no puede quedar negativo';
    END IF;

    UPDATE producto
    SET stock = stock + p_cambio
    WHERE idProducto = p_id_producto
    RETURNING stock INTO p_nuevo_stock;

    p_mensaje := 'Stock actualizado correctamente';
EXCEPTION
    WHEN OTHERS THEN
        p_nuevo_stock := NULL;
        p_mensaje := SQLERRM;
        RAISE;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_consultar_stock_bajo(
    IN p_limite INT,
    INOUT p_cursor REFCURSOR
)
LANGUAGE plpgsql
AS $$
BEGIN
    OPEN p_cursor FOR
        SELECT
            idProducto AS "idProducto",
            nombre,
            stock,
            stockMinimo AS "stockMinimo"
        FROM producto
        WHERE stock <= COALESCE(p_limite, stockMinimo)
        ORDER BY stock ASC, nombre ASC;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_total_vendido_producto(
    IN p_id_producto INT,
    OUT p_producto TEXT,
    OUT p_cantidad_vendida INT,
    OUT p_total_vendido NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT
        p.nombre,
        COALESCE(SUM(dv.cantidad), 0)::INT,
        COALESCE(SUM(dv.subtotal), 0)
    INTO p_producto, p_cantidad_vendida, p_total_vendido
    FROM producto p
    LEFT JOIN detalleVenta dv ON p.idProducto = dv.idProducto
    WHERE p.idProducto = p_id_producto
    GROUP BY p.idProducto, p.nombre;

    IF p_producto IS NULL THEN
        RAISE EXCEPTION 'Producto no encontrado';
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_crear_cliente_validado(
    IN p_nombre VARCHAR,
    IN p_apellido VARCHAR,
    IN p_telefono VARCHAR,
    IN p_correo VARCHAR,
    IN p_direccion VARCHAR,
    OUT p_id_cliente INT,
    OUT p_mensaje TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
        RAISE EXCEPTION 'El nombre es requerido';
    END IF;

    IF p_apellido IS NULL OR TRIM(p_apellido) = '' THEN
        RAISE EXCEPTION 'El apellido es requerido';
    END IF;

    IF p_correo IS NULL OR p_correo !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
        RAISE EXCEPTION 'El correo no tiene formato valido';
    END IF;

    INSERT INTO cliente (nombre, apellido, telefono, correo, direccion, fechaRegistro)
    VALUES (p_nombre, p_apellido, p_telefono, p_correo, p_direccion, CURRENT_DATE)
    RETURNING idCliente INTO p_id_cliente;

    p_mensaje := 'Cliente creado correctamente';
EXCEPTION
    WHEN unique_violation THEN
        p_id_cliente := NULL;
        p_mensaje := 'Ya existe un cliente con ese correo';
        RAISE EXCEPTION 'Ya existe un cliente con ese correo';
    WHEN OTHERS THEN
        p_id_cliente := NULL;
        p_mensaje := SQLERRM;
        RAISE;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_registrar_venta_con_control(
    IN p_id_cliente INT,
    IN p_id_empleado INT,
    IN p_id_producto INT,
    IN p_cantidad INT,
    IN p_metodo_pago VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_venta INT;
    v_total NUMERIC;
    v_mensaje TEXT;
BEGIN
    CALL sp_registrar_venta(
        p_id_cliente,
        p_id_empleado,
        p_id_producto,
        p_cantidad,
        p_metodo_pago,
        v_id_venta,
        v_total,
        v_mensaje
    );

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;
