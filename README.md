# Tienda de Camisolas Espanolas

Aplicacion web simple para una tienda de camisolas de equipos espanoles. Este repositorio inicio como Proyecto 2 de Bases de Datos 1, se continuo en la branch `proyecto2-web-E-commerce` para Tecnologias Web y ahora se extiende en la branch `proyecto-3` para Proyecto 3.

La aplicacion mantiene lo implementado en Proyecto 2: PostgreSQL con Docker, backend Express, frontend React, CRUD de productos/clientes, ventas, reportes SQL visibles y pruebas basicas. Proyecto 3 agrega roles de base de datos, stored procedures, ORM en operaciones CRUD puntuales y autenticacion simple con proteccion por roles.

## Tecnologias usadas

- PostgreSQL 16
- Node.js, Express, pg, cors, express-session y dotenv
- React con Vite
- React Router
- Context API y useReducer
- ESLint
- Vitest y Testing Library
- Docker Compose
- SQL explicito para reportes/procedures y Sequelize ORM en operaciones CRUD puntuales

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
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=proyecto3-secret
```

## Levantar el proyecto desde cero

Desde la raiz del repositorio:

```bash
cp .env.example .env
docker compose up --build
```

En Windows puedes crear el `.env` asi:

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Si ya existe el archivo `.env`, solo construye y levanta los servicios:

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

La aplicacion inicia en una pantalla de login. Despues de iniciar sesion, la navegacion cambia segun el rol del usuario.

## Proyecto 3: autenticacion y roles en la app

Se agrego autenticacion simple con `express-session`. No usa proveedores externos ni seguridad avanzada; son usuarios de prueba para demostrar control de acceso por rol.

Usuarios de prueba:

- `admin` / `admin123`: administrador
- `gerente` / `gerente123`: gerente
- `vendedor` / `vendedor123`: vendedor
- `bodega` / `bodega123`: bodeguero
- `auditor` / `auditor123`: auditor

Permisos visibles en frontend:

- `administrador`: ve dashboard, productos, clientes, ventas y reportes.
- `gerente`: ve dashboard, productos, clientes, ventas y reportes.
- `vendedor`: ve dashboard, clientes y ventas.
- `bodeguero`: ve dashboard y productos.
- `auditor`: ve dashboard y reportes.

El backend protege endpoints con middleware de sesion y roles:

- Productos: crear, editar, eliminar y actualizar stock solo para `administrador`, `gerente` y `bodeguero`.
- Clientes: crear, editar y eliminar solo para `administrador`, `gerente` y `vendedor`.
- Ventas: registrar ventas solo para `administrador`, `gerente` y `vendedor`.
- Reportes: consultas de reportes solo para `administrador`, `gerente` y `auditor`.

Para probar vistas protegidas desde el frontend:

1. Inicia sesion como `vendedor`: debe ver dashboard, clientes y ventas.
2. Inicia sesion como `bodega`: debe ver dashboard y productos.
3. Inicia sesion como `auditor`: debe ver dashboard y reportes, pero no formularios de modificacion.
4. Escribe manualmente una ruta no permitida para ese rol, por ejemplo `/productos` con `auditor`; debe mostrar acceso denegado.

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

Para probarlos desde la app:

- Crear un cliente ejecuta `sp_crear_cliente_validado`.
- Registrar una venta ejecuta `sp_registrar_venta`.
- Registrar una venta con `/api/ventas/control-transaccion` ejecuta `sp_registrar_venta_con_control`.
- Actualizar stock con `PATCH /api/productos/:id/stock` ejecuta `sp_actualizar_stock`.
- Consultar reportes de stock bajo o total vendido por producto ejecuta los procedures de reportes.

## Proyecto 3: ORM

Se agrego Sequelize como ORM para operaciones CRUD puntuales sin reemplazar los reportes SQL ni los stored procedures.

Operaciones que usan ORM:

- `POST /api/productos`: crea productos con el modelo `Producto`.
- `PUT /api/productos/:id`: actualiza productos con el modelo `Producto`.
- `PUT /api/clientes/:id`: actualiza clientes con el modelo `Cliente`.

## Endpoints principales

Autenticacion:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

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

- `GET /api/ventas/opciones`
- `POST /api/ventas`
- `POST /api/ventas/control-transaccion`

El registro de ventas valida cliente, empleado, producto, cantidad y stock suficiente. El endpoint `POST /api/ventas` invoca `sp_registrar_venta`; el endpoint `POST /api/ventas/control-transaccion` invoca `sp_registrar_venta_con_control`, que contiene control transaccional con `COMMIT` y `ROLLBACK`.

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
- `GET /api/reportes/stock-bajo-procedure`
- `GET /api/reportes/total-producto-procedure/:id`

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
- Roles de PostgreSQL creados con `CREATE ROLE`.
- Permisos granulares aplicados con `REVOKE` y `GRANT`.
- Stored procedures de negocio invocados desde el backend.
- ORM integrado en operaciones CRUD puntuales.

## Funcionalidades de Tecnologias Web

- Rutas reales con React Router.
- Navegacion visible entre secciones.
- Pagina 404 para rutas no existentes.
- Context API para notificaciones globales.
- `useReducer` para manejar acciones de exito, error y limpieza de notificaciones.
- Formularios controlados.
- Validaciones visibles en productos, clientes y ventas.
- Errores del backend visibles en pantalla.
- Login/logout simple con sesion.
- Proteccion de vistas por rol.
- Usuario y rol actual visibles en la interfaz.
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

## Verificacion manual de Proyecto 3

Reiniciar la base de datos y levantar todo desde cero:

```bash
docker compose down -v
docker compose up --build
```

Verificar que los contenedores esten arriba:

```bash
docker compose ps
```

Probar login y endpoint protegido con PowerShell:

```powershell
$body = @{ username = 'admin'; password = 'admin123' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post -Body $body -ContentType 'application/json' -SessionVariable sesion
Invoke-RestMethod -Uri http://localhost:3000/api/reportes/dashboard -WebSession $sesion
```

Probar que un rol sin permiso reciba `403`:

```powershell
$body = @{ username = 'auditor'; password = 'auditor123' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post -Body $body -ContentType 'application/json' -SessionVariable sesion
Invoke-RestMethod -Uri http://localhost:3000/api/productos -Method Post -Body (@{ nombre = 'x' } | ConvertTo-Json) -ContentType 'application/json' -WebSession $sesion
```

Ese ultimo comando debe fallar porque `auditor` solo tiene permisos de lectura/reportes.

## Reiniciar la base de datos

Si se desea borrar el volumen y volver a cargar todos los scripts SQL desde cero:

```bash
docker compose down -v
docker compose up --build
```
