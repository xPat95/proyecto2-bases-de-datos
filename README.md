# Tienda de Camisolas Espanolas

Aplicacion web simple para una tienda de camisolas de equipos espanoles. Este repositorio inicio como Proyecto 2 de Bases de Datos 1, se continuo en la branch `proyecto2-web-E-commerce` para Tecnologias Web y ahora se extiende en la branch `proyecto-3`.

La aplicacion permite administrar productos y clientes, registrar ventas con transaccion explicita y consultar reportes SQL desde el frontend. Para la parte web se agregaron rutas reales con React Router, pagina 404, Context API, `useReducer`, validaciones visibles, ESLint y pruebas basicas.

## Tecnologias usadas

- PostgreSQL 16
- Node.js, Express, pg, cors y dotenv
- React con Vite
- React Router
- Context API y useReducer
- ESLint
- Vitest y Testing Library
- Docker Compose
- SQL explicito, sin ORM

## Requisitos

- Docker
- Docker Compose
- Node.js y npm, solo si se quieren correr lint/tests localmente fuera de Docker

## Variables de entorno

El archivo `.env` no se versiona porque esta en `.gitignore`. Para configurar el proyecto desde cero, copia o renombra `.env.example` como `.env`:

```bash
cp .env.example .env
```

En Windows tambien puedes duplicar el archivo manualmente o usar:

```powershell
Copy-Item .env.example .env
```

Credenciales usadas por defecto:

```env
POSTGRES_USER=proy3
POSTGRES_PASSWORD=secret
POSTGRES_DB=proyecto2
DB_USER=proy3
DB_PASSWORD=secret
```

## Levantar el proyecto

Construir y levantar todos los servicios:

```bash
docker compose up --build
```

Puertos principales:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

## Rutas del frontend

- `/`: dashboard con resumen general
- `/productos`: CRUD de productos
- `/clientes`: CRUD de clientes
- `/ventas`: registro de ventas
- `/reportes`: reportes SQL
- `*`: pagina 404 para rutas no existentes

## Scripts SQL

Los scripts estan en la carpeta `database/` y se cargan automaticamente cuando se crea el contenedor de PostgreSQL:

- `ddl_proyecto2.sql`: crea las tablas `categoria`, `proveedor`, `producto`, `cliente`, `empleado`, `venta` y `detalleVenta`.
- `inserts_p2.sql`: inserta datos iniciales de camisolas, clientes, empleados, ventas y detalles.
- `index_p2.sql`: crea indices y la vista `vista_resumen_ventas`.
- `04_roles_permisos.sql`: crea roles de PostgreSQL y asigna permisos granulares para Proyecto 3.
- `05_stored_procedures.sql`: crea stored procedures de negocio para ventas, stock, clientes y reportes.

Docker Compose los monta en `/docker-entrypoint-initdb.d/` en este orden:

```yaml
01_ddl.sql
02_inserts.sql
03_indexes.sql
04_roles_permisos.sql
05_stored_procedures.sql
```

## Proyecto 3: roles y permisos

El Proyecto 3 cambia el usuario de conexion de `proy2` a `proy3`, manteniendo la contrasena `secret`.

El script `database/04_roles_permisos.sql` define exactamente cinco roles de PostgreSQL:

- `administrador`: acceso total sobre tablas y secuencias.
- `gerente`: lectura general, gestion de productos, clientes y ventas.
- `vendedor`: gestion de clientes y ventas, con permiso para descontar stock.
- `bodeguero`: gestion de productos, categorias, proveedores y stock.
- `auditor`: solo lectura para consultas y reportes.

Los permisos se aplican con `REVOKE` sobre permisos publicos y `GRANT` especificos por rol.

## Proyecto 3: stored procedures

El script `database/05_stored_procedures.sql` agrega procedures relacionados con operaciones reales del negocio:

- `sp_registrar_venta`: registra venta, detalle y descuenta stock.
- `sp_actualizar_stock`: actualiza stock con parametros de entrada/salida y manejo de excepciones.
- `sp_consultar_stock_bajo`: consulta productos con stock bajo usando cursor.
- `sp_total_vendido_producto`: calcula cantidad e ingresos vendidos por producto.
- `sp_crear_cliente_validado`: crea cliente con validaciones y manejo de excepciones.
- `sp_registrar_venta_con_control`: procedure de control transaccional con `COMMIT` y `ROLLBACK`.

El backend invoca procedures desde endpoints reales:

- `POST /api/ventas`
- `POST /api/ventas/control-transaccion`
- `POST /api/clientes`
- `PATCH /api/productos/:id/stock`
- `GET /api/reportes/stock-bajo-procedure`
- `GET /api/reportes/total-producto-procedure/:id`

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

## Funcionalidades de Bases de Datos

- Diseno de base de datos relacional con llaves primarias, foraneas y restricciones.
- CRUD completo de productos y clientes.
- Consultas SQL con JOIN entre varias tablas.
- Consultas con subquery usando promedio y `EXISTS`.
- Reporte con `GROUP BY`, `HAVING` y agregaciones.
- Reporte con CTE usando `WITH`.
- Vista SQL `vista_resumen_ventas` consultada desde el backend.
- Transaccion explicita para registrar ventas y descontar stock.
- Reportes visibles en el frontend con datos reales.

## Funcionalidades de Tecnologias Web

- Rutas reales con React Router.
- Navegacion visible entre secciones.
- Pagina 404 para rutas no existentes.
- Context API para notificaciones globales.
- `useReducer` para manejar acciones de exito, error y limpieza de notificaciones.
- Formularios controlados.
- Validaciones visibles en productos, clientes y ventas.
- Errores del backend visibles en pantalla.
- ESLint configurado.
- Pruebas basicas con Vitest y Testing Library.

## Lint y pruebas

Instalar dependencias del frontend si se trabaja localmente:

```bash
cd frontend
npm install
```

Desde la carpeta `frontend`:

```bash
npm run lint
npm run test
```

Tambien se pueden ejecutar desde la raiz del repositorio:

```bash
npm run lint
npm run test
```

## Reiniciar la base de datos

Si se desea borrar el volumen y volver a cargar todos los scripts SQL desde cero:

```bash
docker compose down -v
docker compose up --build
```
