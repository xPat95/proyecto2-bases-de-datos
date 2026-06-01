-- Roles y permisos granulares para Proyecto 3.
-- Se crean exactamente cinco roles de aplicacion en PostgreSQL.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'administrador') THEN
        CREATE ROLE administrador;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'gerente') THEN
        CREATE ROLE gerente;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'vendedor') THEN
        CREATE ROLE vendedor;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bodeguero') THEN
        CREATE ROLE bodeguero;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'auditor') THEN
        CREATE ROLE auditor;
    END IF;
END $$;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;

GRANT CONNECT ON DATABASE proyecto2 TO administrador, gerente, vendedor, bodeguero, auditor;
GRANT USAGE ON SCHEMA public TO administrador, gerente, vendedor, bodeguero, auditor;

-- Administrador: acceso total.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO administrador;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO administrador;

-- Gerente: gestion general y reportes.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO gerente;
GRANT INSERT, UPDATE ON producto, cliente, venta, detalleVenta TO gerente;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gerente;

-- Vendedor: clientes y ventas.
GRANT SELECT ON producto, cliente, empleado, venta, detalleVenta, vista_resumen_ventas TO vendedor;
GRANT INSERT, UPDATE ON cliente TO vendedor;
GRANT INSERT ON venta, detalleVenta TO vendedor;
GRANT UPDATE (stock) ON producto TO vendedor;
GRANT USAGE, SELECT ON SEQUENCE cliente_idcliente_seq, venta_idventa_seq, detalleventa_iddetalleventa_seq TO vendedor;

-- Bodeguero: productos, categorias, proveedores y stock.
GRANT SELECT, INSERT, UPDATE ON producto, categoria, proveedor TO bodeguero;
GRANT USAGE, SELECT ON SEQUENCE producto_idproducto_seq, categoria_idcategoria_seq, proveedor_idproveedor_seq TO bodeguero;

-- Auditor: solo lectura y reportes.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO auditor;
