import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const productoVacio = {
  nombre: '',
  descripcion: '',
  precioCompra: '',
  precioVenta: '',
  stock: '',
  stockMinimo: '',
  idCategoria: 1,
  idProveedor: 1
};

const clienteVacio = {
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: ''
};

const ventaVacia = {
  idCliente: '',
  idEmpleado: '',
  idProducto: '',
  cantidad: 1,
  metodoPago: 'Efectivo'
};

const reportes = [
  ['ventas-detalle', 'Ventas con detalle'],
  ['productos-proveedor', 'Productos, categoria y proveedor'],
  ['ventas-cliente', 'Ventas por cliente'],
  ['productos-caros', 'Productos arriba del promedio'],
  ['clientes-con-compras', 'Clientes con compras'],
  ['ventas-por-producto', 'Ventas por producto'],
  ['top-productos', 'Top productos con CTE'],
  ['resumen-ventas', 'Resumen desde VIEW']
];

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.mensaje || 'Error al comunicarse con el backend');
  return data;
}

function Tabla({ datos }) {
  if (!datos.length) return <p className="muted">No hay datos para mostrar.</p>;
  const columnas = Object.keys(datos[0]);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columnas.map((columna) => <th key={columna}>{columna}</th>)}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, index) => (
            <tr key={index}>
              {columnas.map((columna) => <td key={columna}>{String(fila[columna] ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <section className="not-found-panel">
        <p className="eyebrow">Error 404</p>
        <h1>Pagina no encontrada</h1>
        <p>La ruta que escribiste no existe en esta aplicacion.</p>
        <a className="home-link" href="/">Volver al inicio</a>
      </section>
    </main>
  );
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [opciones, setOpciones] = useState({ categorias: [], proveedores: [], empleados: [] });
  const [productoForm, setProductoForm] = useState(productoVacio);
  const [productoEditando, setProductoEditando] = useState(null);
  const [clienteForm, setClienteForm] = useState(clienteVacio);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [ventaForm, setVentaForm] = useState(ventaVacia);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [reporteActivo, setReporteActivo] = useState(reportes[0]);
  const [datosReporte, setDatosReporte] = useState([]);

  async function cargarTodo() {
    const [dash, prods, clis, prodOpc, ventaOpc] = await Promise.all([
      api('/reportes/dashboard'),
      api('/productos'),
      api('/clientes'),
      api('/productos/opciones/categorias-proveedores'),
      api('/ventas/opciones')
    ]);
    setDashboard(dash);
    setProductos(prods);
    setClientes(clis);
    setOpciones({
      categorias: prodOpc.categorias,
      proveedores: prodOpc.proveedores,
      empleados: ventaOpc.empleados
    });
    setVentaForm((actual) => ({
      ...actual,
      idCliente: actual.idCliente || clis[0]?.idCliente || '',
      idEmpleado: actual.idEmpleado || ventaOpc.empleados[0]?.idEmpleado || '',
      idProducto: actual.idProducto || prods[0]?.idProducto || ''
    }));
  }

  async function ejecutar(accion) {
    setMensaje('');
    setError('');
    try {
      await accion();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    ejecutar(cargarTodo);
  }, []);

  useEffect(() => {
    ejecutar(async () => {
      const data = await api(`/reportes/${reporteActivo[0]}`);
      setDatosReporte(data);
    });
  }, [reporteActivo]);

  async function guardarProducto(event) {
    event.preventDefault();
    await ejecutar(async () => {
      const metodo = productoEditando ? 'PUT' : 'POST';
      const ruta = productoEditando ? `/productos/${productoEditando}` : '/productos';
      const payload = {
        ...productoForm,
        precioCompra: Number(productoForm.precioCompra),
        precioVenta: Number(productoForm.precioVenta),
        stock: Number(productoForm.stock),
        stockMinimo: Number(productoForm.stockMinimo),
        idCategoria: Number(productoForm.idCategoria),
        idProveedor: Number(productoForm.idProveedor)
      };
      await api(ruta, { method: metodo, body: JSON.stringify(payload) });
      setMensaje(productoEditando ? 'Producto actualizado.' : 'Producto creado.');
      setProductoForm(productoVacio);
      setProductoEditando(null);
      await cargarTodo();
    });
  }

  async function eliminarProducto(id) {
    await ejecutar(async () => {
      await api(`/productos/${id}`, { method: 'DELETE' });
      setMensaje('Producto eliminado.');
      await cargarTodo();
    });
  }

  function editarProducto(producto) {
    setProductoEditando(producto.idProducto);
    setProductoForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      idCategoria: producto.idCategoria,
      idProveedor: producto.idProveedor
    });
  }

  async function guardarCliente(event) {
    event.preventDefault();
    await ejecutar(async () => {
      const metodo = clienteEditando ? 'PUT' : 'POST';
      const ruta = clienteEditando ? `/clientes/${clienteEditando}` : '/clientes';
      await api(ruta, { method: metodo, body: JSON.stringify(clienteForm) });
      setMensaje(clienteEditando ? 'Cliente actualizado.' : 'Cliente creado.');
      setClienteForm(clienteVacio);
      setClienteEditando(null);
      await cargarTodo();
    });
  }

  async function eliminarCliente(id) {
    await ejecutar(async () => {
      await api(`/clientes/${id}`, { method: 'DELETE' });
      setMensaje('Cliente eliminado.');
      await cargarTodo();
    });
  }

  function editarCliente(cliente) {
    setClienteEditando(cliente.idCliente);
    setClienteForm({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion
    });
  }

  async function registrarVenta(event) {
    event.preventDefault();
    await ejecutar(async () => {
      await api('/ventas', {
        method: 'POST',
        body: JSON.stringify({
          ...ventaForm,
          idCliente: Number(ventaForm.idCliente),
          idEmpleado: Number(ventaForm.idEmpleado),
          idProducto: Number(ventaForm.idProducto),
          cantidad: Number(ventaForm.cantidad)
        })
      });
      setMensaje('Venta registrada con transaccion.');
      setVentaForm(ventaVacia);
      await cargarTodo();
    });
  }

  const totalVendido = Number(dashboard?.totalVendido || 0).toFixed(2);

  if (window.location.pathname !== '/') {
    return <NotFound />;
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">Proyecto 2 Bases de Datos</p>
          <h1>Tienda de camisolas españolas</h1>
        </div>
        <nav>
          <a href="#productos">Productos</a>
          <a href="#clientes">Clientes</a>
          <a href="#ventas">Ventas</a>
          <a href="#reportes">Reportes</a>
        </nav>
      </header>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="dashboard">
        <article><span>Productos</span><strong>{dashboard?.totalProductos ?? '-'}</strong></article>
        <article><span>Clientes</span><strong>{dashboard?.totalClientes ?? '-'}</strong></article>
        <article><span>Ventas</span><strong>{dashboard?.totalVentas ?? '-'}</strong></article>
        <article><span>Total vendido</span><strong>Q {totalVendido}</strong></article>
      </section>

      <section id="productos" className="section">
        <div className="section-title">
          <h2>Productos</h2>
          <p>CRUD completo con la tabla producto.</p>
        </div>
        <form onSubmit={guardarProducto} className="form-grid">
          <input required placeholder="Nombre" value={productoForm.nombre} onChange={(e) => setProductoForm({ ...productoForm, nombre: e.target.value })} />
          <input required placeholder="Descripcion" value={productoForm.descripcion} onChange={(e) => setProductoForm({ ...productoForm, descripcion: e.target.value })} />
          <input required min="0" type="number" placeholder="Precio compra" value={productoForm.precioCompra} onChange={(e) => setProductoForm({ ...productoForm, precioCompra: e.target.value })} />
          <input required min="0" type="number" placeholder="Precio venta" value={productoForm.precioVenta} onChange={(e) => setProductoForm({ ...productoForm, precioVenta: e.target.value })} />
          <input required min="0" type="number" placeholder="Stock" value={productoForm.stock} onChange={(e) => setProductoForm({ ...productoForm, stock: e.target.value })} />
          <input required min="0" type="number" placeholder="Stock minimo" value={productoForm.stockMinimo} onChange={(e) => setProductoForm({ ...productoForm, stockMinimo: e.target.value })} />
          <select value={productoForm.idCategoria} onChange={(e) => setProductoForm({ ...productoForm, idCategoria: e.target.value })}>
            {opciones.categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
          </select>
          <select value={productoForm.idProveedor} onChange={(e) => setProductoForm({ ...productoForm, idProveedor: e.target.value })}>
            {opciones.proveedores.map((p) => <option key={p.idProveedor} value={p.idProveedor}>{p.nombreEmpresa}</option>)}
          </select>
          <button type="submit">{productoEditando ? 'Actualizar producto' : 'Crear producto'}</button>
          {productoEditando && <button type="button" className="secondary" onClick={() => { setProductoEditando(null); setProductoForm(productoVacio); }}>Cancelar</button>}
        </form>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Producto</th><th>Venta</th><th>Stock</th><th>Categoria</th><th>Proveedor</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td><td>{p.nombre}</td><td>Q {p.precioVenta}</td><td>{p.stock}</td><td>{p.categoria}</td><td>{p.proveedor}</td>
                  <td className="actions">
                    <button type="button" onClick={() => editarProducto(p)}>Editar</button>
                    <button type="button" className="danger" onClick={() => eliminarProducto(p.idProducto)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="clientes" className="section">
        <div className="section-title">
          <h2>Clientes</h2>
          <p>CRUD completo con la tabla cliente.</p>
        </div>
        <form onSubmit={guardarCliente} className="form-grid">
          <input required placeholder="Nombre" value={clienteForm.nombre} onChange={(e) => setClienteForm({ ...clienteForm, nombre: e.target.value })} />
          <input required placeholder="Apellido" value={clienteForm.apellido} onChange={(e) => setClienteForm({ ...clienteForm, apellido: e.target.value })} />
          <input required placeholder="Telefono" value={clienteForm.telefono} onChange={(e) => setClienteForm({ ...clienteForm, telefono: e.target.value })} />
          <input required type="email" placeholder="Correo" value={clienteForm.correo} onChange={(e) => setClienteForm({ ...clienteForm, correo: e.target.value })} />
          <input required placeholder="Direccion" value={clienteForm.direccion} onChange={(e) => setClienteForm({ ...clienteForm, direccion: e.target.value })} />
          <button type="submit">{clienteEditando ? 'Actualizar cliente' : 'Crear cliente'}</button>
          {clienteEditando && <button type="button" className="secondary" onClick={() => { setClienteEditando(null); setClienteForm(clienteVacio); }}>Cancelar</button>}
        </form>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre</th><th>Telefono</th><th>Correo</th><th>Direccion</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.idCliente}>
                  <td>{c.idCliente}</td><td>{c.nombre} {c.apellido}</td><td>{c.telefono}</td><td>{c.correo}</td><td>{c.direccion}</td>
                  <td className="actions">
                    <button type="button" onClick={() => editarCliente(c)}>Editar</button>
                    <button type="button" className="danger" onClick={() => eliminarCliente(c.idCliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="ventas" className="section">
        <div className="section-title">
          <h2>Ventas</h2>
          <p>Registro con BEGIN, COMMIT y ROLLBACK en el backend.</p>
        </div>
        <form onSubmit={registrarVenta} className="form-grid compact">
          <select required value={ventaForm.idCliente} onChange={(e) => setVentaForm({ ...ventaForm, idCliente: e.target.value })}>
            <option value="">Cliente</option>
            {clientes.map((c) => <option key={c.idCliente} value={c.idCliente}>{c.idCliente} - {c.nombre} {c.apellido}</option>)}
          </select>
          <select required value={ventaForm.idEmpleado} onChange={(e) => setVentaForm({ ...ventaForm, idEmpleado: e.target.value })}>
            <option value="">Empleado</option>
            {opciones.empleados.map((e) => <option key={e.idEmpleado} value={e.idEmpleado}>{e.idEmpleado} - {e.nombre} {e.apellido}</option>)}
          </select>
          <select required value={ventaForm.idProducto} onChange={(e) => setVentaForm({ ...ventaForm, idProducto: e.target.value })}>
            <option value="">Producto</option>
            {productos.map((p) => <option key={p.idProducto} value={p.idProducto}>{p.idProducto} - {p.nombre} (stock {p.stock})</option>)}
          </select>
          <input required min="1" type="number" placeholder="Cantidad" value={ventaForm.cantidad} onChange={(e) => setVentaForm({ ...ventaForm, cantidad: e.target.value })} />
          <select value={ventaForm.metodoPago} onChange={(e) => setVentaForm({ ...ventaForm, metodoPago: e.target.value })}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </select>
          <button type="submit">Registrar venta</button>
        </form>
      </section>

      <section id="reportes" className="section">
        <div className="section-title">
          <h2>Reportes SQL</h2>
          <p>JOIN, subqueries, GROUP BY, HAVING, CTE y VIEW visibles en la aplicacion.</p>
        </div>
        <div className="report-buttons">
          {reportes.map((reporte) => (
            <button key={reporte[0]} type="button" className={reporteActivo[0] === reporte[0] ? 'active' : ''} onClick={() => setReporteActivo(reporte)}>
              {reporte[1]}
            </button>
          ))}
        </div>
        <h3>{reporteActivo[1]}</h3>
        <Tabla datos={datosReporte} />
      </section>
    </main>
  );
}
