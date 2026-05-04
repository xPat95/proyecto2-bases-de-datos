-- =========================
-- INSERTS PROYECTO 2 - CAMISOLAS
-- =========================

-- CATEGORIA
INSERT INTO categoria (nombre, descripcion) VALUES
('Camisolas','Camisolas de equipos'),
('Accesorios','Accesorios deportivos'),
('Calzado','Zapatos deportivos'),
('Entrenamiento','Ropa deportiva'),
('Niños','Productos infantiles'),
('Oficial','Productos oficiales'),
('Retro','Camisolas clásicas'),
('Ediciones Especiales','Productos limitados'),
('Deportes','Artículos deportivos'),
('Fitness','Equipos fitness'),
('Casual','Ropa casual'),
('Invierno','Ropa invierno'),
('Verano','Ropa verano'),
('Coleccion','Productos coleccionables'),
('Premium','Productos premium'),
('Outlet','Productos descuento'),
('Futbol','Artículos fútbol'),
('Fans','Productos fans'),
('Clubes','Productos clubes'),
('Internacional','Equipos internacionales'),
('Local','Equipos locales'),
('Historico','Equipos históricos'),
('Juvenil','Juvenil'),
('Adulto','Adulto'),
('Especial','Productos especiales');

-- PROVEEDORES
INSERT INTO proveedor (nombreEmpresa, nombreProveedor, telefono, correo, direccion) VALUES
('FC Barcelona Store','Proveedor Barca','5551-0001','barca@mail.com','Barcelona'),
('Real Betis Shop','Proveedor Betis','5551-0002','betis@mail.com','Sevilla'),
('Real Sociedad Store','Proveedor Sociedad','5551-0003','sociedad@mail.com','San Sebastian'),
('Valencia CF Store','Proveedor Valencia','5551-0004','valencia@mail.com','Valencia'),
('Elche CF Shop','Proveedor Elche','5551-0005','elche@mail.com','Elche'),
('Deportivo Store','Proveedor Depor','5551-0006','depor@mail.com','La Coruña'),
('Villarreal Store','Proveedor Villarreal','5551-0007','villarreal@mail.com','Villarreal'),
('Racing Store','Proveedor Racing','5551-0008','racing@mail.com','Santander'),
('Proveedor9','Extra','5551-0009','p9@mail.com','Zona 9'),
('Proveedor10','Extra','5551-0010','p10@mail.com','Zona 10'),
('Proveedor11','Extra','5551-0011','p11@mail.com','Zona 11'),
('Proveedor12','Extra','5551-0012','p12@mail.com','Zona 12'),
('Proveedor13','Extra','5551-0013','p13@mail.com','Zona 13'),
('Proveedor14','Extra','5551-0014','p14@mail.com','Zona 14'),
('Proveedor15','Extra','5551-0015','p15@mail.com','Zona 15'),
('Proveedor16','Extra','5551-0016','p16@mail.com','Zona 16'),
('Proveedor17','Extra','5551-0017','p17@mail.com','Zona 17'),
('Proveedor18','Extra','5551-0018','p18@mail.com','Zona 18'),
('Proveedor19','Extra','5551-0019','p19@mail.com','Zona 19'),
('Proveedor20','Extra','5551-0020','p20@mail.com','Zona 20'),
('Proveedor21','Extra','5551-0021','p21@mail.com','Zona 21'),
('Proveedor22','Extra','5551-0022','p22@mail.com','Zona 22'),
('Proveedor23','Extra','5551-0023','p23@mail.com','Zona 23'),
('Proveedor24','Extra','5551-0024','p24@mail.com','Zona 24'),
('Proveedor25','Extra','5551-0025','p25@mail.com','Zona 25');

-- CLIENTE
INSERT INTO cliente (nombre, apellido, telefono, correo, direccion, fechaRegistro) VALUES
('Juan','Perez','4444-0001','c1@mail.com','Zona 1',CURRENT_DATE),
('Ana','Lopez','4444-0002','c2@mail.com','Zona 2',CURRENT_DATE),
('Luis','Garcia','4444-0003','c3@mail.com','Zona 3',CURRENT_DATE),
('Maria','Ruiz','4444-0004','c4@mail.com','Zona 4',CURRENT_DATE),
('Jose','Diaz','4444-0005','c5@mail.com','Zona 5',CURRENT_DATE),
('Pedro','Cruz','4444-0006','c6@mail.com','Zona 6',CURRENT_DATE),
('Laura','Torres','4444-0007','c7@mail.com','Zona 7',CURRENT_DATE),
('Mario','Flores','4444-0008','c8@mail.com','Zona 8',CURRENT_DATE),
('Sofia','Ramos','4444-0009','c9@mail.com','Zona 9',CURRENT_DATE),
('Carlos','Perez','4444-0010','c10@mail.com','Zona 10',CURRENT_DATE),
('Elena','Morales','4444-0011','c11@mail.com','Zona 11',CURRENT_DATE),
('Diego','Herrera','4444-0012','c12@mail.com','Zona 12',CURRENT_DATE),
('Paula','Castro','4444-0013','c13@mail.com','Zona 13',CURRENT_DATE),
('Andres','Vega','4444-0014','c14@mail.com','Zona 14',CURRENT_DATE),
('Lucia','Mendez','4444-0015','c15@mail.com','Zona 15',CURRENT_DATE),
('Raul','Soto','4444-0016','c16@mail.com','Zona 16',CURRENT_DATE),
('Carla','Rivas','4444-0017','c17@mail.com','Zona 17',CURRENT_DATE),
('Victor','Leon','4444-0018','c18@mail.com','Zona 18',CURRENT_DATE),
('Natalia','Pineda','4444-0019','c19@mail.com','Zona 19',CURRENT_DATE),
('Jorge','Reyes','4444-0020','c20@mail.com','Zona 20',CURRENT_DATE),
('Miguel','Luna','4444-0021','c21@mail.com','Zona 21',CURRENT_DATE),
('Sara','Fuentes','4444-0022','c22@mail.com','Zona 22',CURRENT_DATE),
('Hugo','Estrada','4444-0023','c23@mail.com','Zona 23',CURRENT_DATE),
('Andrea','Campos','4444-0024','c24@mail.com','Zona 24',CURRENT_DATE),
('Luis','Toledo','4444-0025','c25@mail.com','Zona 25',CURRENT_DATE);

-- EMPLEADO
INSERT INTO empleado (nombre, apellido, puesto, telefono, correo, fechaContratacion, salario, estado) VALUES
('Pedro','Gomez','Vendedor','3333-0001','e1@mail.com',CURRENT_DATE,3000,'Activo'),
('Luis','Perez','Vendedor','3333-0002','e2@mail.com',CURRENT_DATE,3100,'Activo'),
('Ana','Lopez','Vendedor','3333-0003','e3@mail.com',CURRENT_DATE,3200,'Activo'),
('Carlos','Diaz','Vendedor','3333-0004','e4@mail.com',CURRENT_DATE,3300,'Activo'),
('Maria','Ruiz','Vendedor','3333-0005','e5@mail.com',CURRENT_DATE,3400,'Activo'),
('Jose','Cruz','Vendedor','3333-0006','e6@mail.com',CURRENT_DATE,3500,'Activo'),
('Laura','Torres','Vendedor','3333-0007','e7@mail.com',CURRENT_DATE,3600,'Activo'),
('Mario','Flores','Vendedor','3333-0008','e8@mail.com',CURRENT_DATE,3700,'Activo'),
('Sofia','Ramos','Vendedor','3333-0009','e9@mail.com',CURRENT_DATE,3800,'Activo'),
('Jorge','Reyes','Vendedor','3333-0010','e10@mail.com',CURRENT_DATE,3900,'Activo'),
('Miguel','Luna','Vendedor','3333-0011','e11@mail.com',CURRENT_DATE,4000,'Activo'),
('Sara','Fuentes','Vendedor','3333-0012','e12@mail.com',CURRENT_DATE,4100,'Activo'),
('Hugo','Estrada','Vendedor','3333-0013','e13@mail.com',CURRENT_DATE,4200,'Activo'),
('Andrea','Campos','Vendedor','3333-0014','e14@mail.com',CURRENT_DATE,4300,'Activo'),
('Raul','Soto','Vendedor','3333-0015','e15@mail.com',CURRENT_DATE,4400,'Activo'),
('Carla','Rivas','Vendedor','3333-0016','e16@mail.com',CURRENT_DATE,4500,'Activo'),
('Victor','Leon','Vendedor','3333-0017','e17@mail.com',CURRENT_DATE,4600,'Activo'),
('Natalia','Pineda','Vendedor','3333-0018','e18@mail.com',CURRENT_DATE,4700,'Activo'),
('Pablo','Toledo','Vendedor','3333-0019','e19@mail.com',CURRENT_DATE,4800,'Activo'),
('Diego','Herrera','Vendedor','3333-0020','e20@mail.com',CURRENT_DATE,4900,'Activo'),
('Elena','Morales','Vendedor','3333-0021','e21@mail.com',CURRENT_DATE,5000,'Activo'),
('Luis','Garcia','Vendedor','3333-0022','e22@mail.com',CURRENT_DATE,5100,'Activo'),
('Ana','Perez','Vendedor','3333-0023','e23@mail.com',CURRENT_DATE,5200,'Activo'),
('Carlos','Mendez','Vendedor','3333-0024','e24@mail.com',CURRENT_DATE,5300,'Activo'),
('Maria','Lopez','Vendedor','3333-0025','e25@mail.com',CURRENT_DATE,5400,'Activo');

-- PRODUCTO (simplificado)
INSERT INTO producto (nombre, descripcion, precioCompra, precioVenta, stock, stockMinimo, idCategoria, idProveedor) VALUES

-- FC BARCELONA
('Camisola Barcelona Hombre', 'Camisola oficial FC Barcelona hombre', 50, 90, 20, 5, 1, 1),
('Camisola Barcelona Mujer', 'Camisola oficial FC Barcelona mujer', 40, 75, 20, 5, 1, 1),
('Camisola Barcelona Niño', 'Camisola oficial FC Barcelona niño', 45, 80, 20, 5, 1, 1),

-- REAL BETIS
('Camisola Betis Hombre', 'Camisola Real Betis hombre', 35, 65, 20, 5, 1, 2),
('Camisola Betis Mujer', 'Camisola Real Betis mujer', 30, 55, 20, 5, 1, 2),
('Camisola Betis Niño', 'Camisola Real Betis niño', 32, 60, 20, 5, 1, 2),

-- REAL SOCIEDAD
('Camisola Real Sociedad Hombre', 'Camisola Real Sociedad hombre', 35, 65, 20, 5, 1, 3),
('Camisola Real Sociedad Mujer', 'Camisola Real Sociedad mujer', 30, 55, 20, 5, 1, 3),
('Camisola Real Sociedad Niño', 'Camisola Real Sociedad niño', 32, 60, 20, 5, 1, 3),

-- VALENCIA
('Camisola Valencia Hombre', 'Camisola Valencia hombre', 35, 65, 20, 5, 1, 4),
('Camisola Valencia Mujer', 'Camisola Valencia mujer', 30, 55, 20, 5, 1, 4),
('Camisola Valencia Niño', 'Camisola Valencia niño', 32, 60, 20, 5, 1, 4),

-- PRODUCTO ESPECIAL (15)
('Camisola Barcelona 2009 Firmada', 'Edición limitada firmada FC Barcelona 2009', 200, 500, 2, 1, 1, 1),

-- ELCHE
('Camisola Elche Hombre', 'Camisola Elche CF hombre', 30, 55, 20, 5, 1, 5),
('Camisola Elche Mujer', 'Camisola Elche CF mujer', 25, 50, 20, 5, 1, 5),
('Camisola Elche Niño', 'Camisola Elche CF niño', 28, 52, 20, 5, 1, 5),

-- DEPORTIVO
('Camisola Deportivo Hombre', 'Camisola Deportivo hombre', 30, 55, 20, 5, 1, 6),
('Camisola Deportivo Mujer', 'Camisola Deportivo mujer', 25, 50, 20, 5, 1, 6),
('Camisola Deportivo Niño', 'Camisola Deportivo niño', 28, 52, 20, 5, 1, 6),

-- VILLARREAL
('Camisola Villarreal Hombre', 'Camisola Villarreal hombre', 35, 65, 20, 5, 1, 7),
('Camisola Villarreal Mujer', 'Camisola Villarreal mujer', 30, 55, 20, 5, 1, 7),
('Camisola Villarreal Niño', 'Camisola Villarreal niño', 32, 60, 20, 5, 1, 7),

-- RACING DE SANTANDER
('Camisola Racing Hombre', 'Camisola Racing de Santander hombre', 28, 50, 20, 5, 1, 8),
('Camisola Racing Mujer', 'Camisola Racing de Santander mujer', 25, 45, 20, 5, 1, 8),
('Camisola Racing Niño', 'Camisola Racing de Santander niño', 27, 48, 20, 5, 1, 8);

-- VENTAS
INSERT INTO venta (fechaVenta, total, metodoPago, idCliente, idEmpleado) VALUES
('2026-04-01 10:15:00', 180.00, 'Tarjeta', 1, 1),
('2026-04-01 11:20:00', 75.00, 'Efectivo', 2, 2),
('2026-04-02 09:40:00', 160.00, 'Tarjeta', 3, 3),
('2026-04-02 14:10:00', 65.00, 'Efectivo', 4, 4),
('2026-04-03 16:25:00', 110.00, 'Transferencia', 5, 5),
('2026-04-03 17:30:00', 60.00, 'Efectivo', 6, 6),
('2026-04-04 12:00:00', 130.00, 'Tarjeta', 7, 7),
('2026-04-04 13:45:00', 55.00, 'Efectivo', 8, 8),
('2026-04-05 15:20:00', 120.00, 'Tarjeta', 9, 9),
('2026-04-05 18:10:00', 65.00, 'Efectivo', 10, 10),
('2026-04-06 10:30:00', 110.00, 'Transferencia', 11, 11),
('2026-04-06 11:50:00', 60.00, 'Efectivo', 12, 12),
('2026-04-07 09:15:00', 500.00, 'Tarjeta', 13, 13),
('2026-04-07 14:40:00', 55.00, 'Efectivo', 14, 14),
('2026-04-08 16:05:00', 100.00, 'Transferencia', 15, 15),
('2026-04-08 17:25:00', 52.00, 'Efectivo', 16, 16),
('2026-04-09 12:35:00', 110.00, 'Tarjeta', 17, 17),
('2026-04-09 13:20:00', 50.00, 'Efectivo', 18, 18),
('2026-04-10 15:00:00', 104.00, 'Transferencia', 19, 19),
('2026-04-10 18:15:00', 65.00, 'Tarjeta', 20, 20),
('2026-04-11 10:45:00', 110.00, 'Efectivo', 21, 21),
('2026-04-11 11:30:00', 60.00, 'Transferencia', 22, 22),
('2026-04-12 09:50:00', 100.00, 'Tarjeta', 23, 23),
('2026-04-12 14:05:00', 45.00, 'Efectivo', 24, 24),
('2026-04-13 16:30:00', 96.00, 'Transferencia', 25, 25);

-- DETALLE VENTA
INSERT INTO detalleVenta (cantidad, precioUnitario, subtotal, idVenta, idProducto) VALUES
(2, 90.00, 180.00, 1, 1),
(1, 75.00, 75.00, 2, 2),
(2, 80.00, 160.00, 3, 3),
(1, 65.00, 65.00, 4, 4),
(2, 55.00, 110.00, 5, 5),
(1, 60.00, 60.00, 6, 6),
(2, 65.00, 130.00, 7, 7),
(1, 55.00, 55.00, 8, 8),
(2, 60.00, 120.00, 9, 9),
(1, 65.00, 65.00, 10, 10),
(2, 55.00, 110.00, 11, 11),
(1, 60.00, 60.00, 12, 12),
(1, 500.00, 500.00, 13, 13),
(1, 55.00, 55.00, 14, 14),
(2, 50.00, 100.00, 15, 15),
(1, 52.00, 52.00, 16, 16),
(2, 55.00, 110.00, 17, 17),
(1, 50.00, 50.00, 18, 18),
(2, 52.00, 104.00, 19, 19),
(1, 65.00, 65.00, 20, 20),
(2, 55.00, 110.00, 21, 21),
(1, 60.00, 60.00, 22, 22),
(2, 50.00, 100.00, 23, 23),
(1, 45.00, 45.00, 24, 24),
(2, 48.00, 96.00, 25, 25);