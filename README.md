# Tienda de Camisolas Españolas

Aplicacion web simple para el Proyecto 2 de Bases de Datos 1. Permite administrar productos y clientes, registrar ventas con una transaccion explicita y consultar reportes SQL visibles desde el frontend.

## Tecnologias usadas

- PostgreSQL 16
- Node.js, Express, pg, cors y dotenv
- React con Vite
- Docker Compose
- SQL explicito, sin ORM

## Requisitos

- Docker
- Docker Compose

## Levantar desde cero

1. Revisar que exista el archivo `.env`. Ya se incluye uno para desarrollo local con estas credenciales:

```env
POSTGRES_USER=proy2
POSTGRES_PASSWORD=secret
POSTGRES_DB=proyecto2
```

2. Construir y levantar todos los servicios:

```bash
docker compose up --build
```

3. Abrir la aplicacion:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

Credenciales de PostgreSQL:

- Usuario: `proy2`
- Contraseña: `secret`
- Base de datos: `proyecto2`

## Scripts SQL

Los scripts estan en la carpeta `database/` y se cargan automaticamente cuando se crea el contenedor de PostgreSQL:

- `ddl_proyecto2.sql`: crea las tablas `categoria`, `proveedor`, `producto`, `cliente`, `empleado`, `venta` y `detalleVenta`.
- `inserts_p2.sql`: inserta datos iniciales de camisolas, clientes, empleados, ventas y detalles.
- `index_p2.sql`: crea indices y la vista `vista_resumen_ventas`.

Docker Compose los monta en `/docker-entrypoint-initdb.d/` en este orden:

```yaml
01_ddl.sql
02_inserts.sql
03_indexes.sql
```

## Endpoints principales

Productos:

- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`

Clientes:

- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

Ventas:

- `POST /api/ventas`

El registro de ventas usa SQL explicito con:

- `BEGIN`
- insercion en `venta`
- insercion en `detalleVenta`
- actualizacion de stock
- validacion de stock suficiente
- `COMMIT`
- `ROLLBACK` si ocurre un error

Reportes:

- `GET /api/reportes/dashboard`
- `GET /api/reportes/ventas-detalle`
- `GET /api/reportes/productos-proveedor`
- `GET /api/reportes/ventas-cliente`
- `GET /api/reportes/productos-caros`
- `GET /api/reportes/clientes-con-compras`
- `GET /api/reportes/ventas-por-producto`
- `GET /api/reportes/top-productos`
- `GET /api/reportes/resumen-ventas`

## Funcionalidades implementadas segun rubrica

- Diseño de base de datos relacional con llaves primarias, foraneas y restricciones.
- CRUD completo de productos y clientes.
- Consultas SQL con JOIN entre varias tablas.
- Consultas con subquery usando promedio y `EXISTS`.
- Reporte con `GROUP BY`, `HAVING` y agregaciones.
- Reporte con CTE usando `WITH`.
- Vista SQL `vista_resumen_ventas` consultada desde el backend.
- Transaccion explicita para registrar ventas y descontar stock.
- Reportes visibles en el frontend con datos reales.

## Reiniciar la base de datos

Si se desea borrar el volumen y volver a cargar todos los scripts SQL desde cero:

```bash
docker compose down -v
docker compose up --build
```
