DROP TABLE IF EXISTS detalleVenta CASCADE;
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS producto CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS proveedor CASCADE;
DROP TABLE IF EXISTS categoria CASCADE;

CREATE TABLE categoria (
    idCategoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE proveedor (
    idProveedor SERIAL PRIMARY KEY,
    nombreEmpresa VARCHAR(120) NOT NULL,
    nombreProveedor VARCHAR(120) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    direccion VARCHAR(200) NOT NULL
);

CREATE TABLE producto (
    idProducto SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precioCompra NUMERIC(10,2) NOT NULL CHECK (precioCompra >= 0),
    precioVenta NUMERIC(10,2) NOT NULL CHECK (precioVenta >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    stockMinimo INT NOT NULL CHECK (stockMinimo >= 0),
    idCategoria INT NOT NULL,
    idProveedor INT NOT NULL,
    CONSTRAINT fkProductoCategoria
        FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkProductoProveedor
        FOREIGN KEY (idProveedor) REFERENCES proveedor(idProveedor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE cliente (
    idCliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    direccion VARCHAR(200) NOT NULL,
    fechaRegistro DATE NOT NULL
);

CREATE TABLE empleado (
    idEmpleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    puesto VARCHAR(80) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    fechaContratacion DATE NOT NULL,
    salario NUMERIC(10,2) NOT NULL CHECK (salario >= 0),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo'))
);

CREATE TABLE venta (
    idVenta SERIAL PRIMARY KEY,
    fechaVenta TIMESTAMP NOT NULL,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    metodoPago VARCHAR(40) NOT NULL,
    idCliente INT NOT NULL,
    idEmpleado INT NOT NULL,
    CONSTRAINT fkVentaCliente
        FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fkVentaEmpleado
        FOREIGN KEY (idEmpleado) REFERENCES empleado(idEmpleado)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE detalleVenta (
    idDetalleVenta SERIAL PRIMARY KEY,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precioUnitario NUMERIC(10,2) NOT NULL CHECK (precioUnitario >= 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    idVenta INT NOT NULL,
    idProducto INT NOT NULL,
    CONSTRAINT fkDetalleVentaVenta
        FOREIGN KEY (idVenta) REFERENCES venta(idVenta)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fkDetalleVentaProducto
        FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);