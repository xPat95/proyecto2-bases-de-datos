import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import App, { validarVenta } from './App.jsx';

const dashboard = {
  totalProductos: 1,
  totalClientes: 1,
  totalVentas: 1,
  totalVendido: '900.00'
};

const productos = [
  {
    idProducto: 1,
    nombre: 'Camisola Barcelona Hombre',
    descripcion: 'Camisola oficial FC Barcelona hombre',
    precioCompra: '500.00',
    precioVenta: '900.00',
    stock: 20,
    stockMinimo: 5,
    idCategoria: 1,
    categoria: 'Camisolas',
    idProveedor: 1,
    proveedor: 'FC Barcelona Store'
  }
];

const clientes = [
  {
    idCliente: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    telefono: '4444-0001',
    correo: 'c1@mail.com',
    direccion: 'Zona 1'
  }
];

const empleados = [
  {
    idEmpleado: 1,
    nombre: 'Pedro',
    apellido: 'Gomez'
  }
];

const opcionesProducto = {
  categorias: [{ idCategoria: 1, nombre: 'Camisolas' }],
  proveedores: [{ idProveedor: 1, nombreEmpresa: 'FC Barcelona Store' }]
};

function jsonResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: () => Promise.resolve(data)
  });
}

function mockFetch() {
  vi.stubGlobal('fetch', vi.fn((url, options = {}) => {
    const path = new URL(url).pathname.replace('/api', '');

    if (options.method === 'POST') {
      return jsonResponse({ mensaje: 'ok' });
    }

    if (path === '/reportes/dashboard') return jsonResponse(dashboard);
    if (path === '/productos') return jsonResponse(productos);
    if (path === '/clientes') return jsonResponse(clientes);
    if (path === '/productos/opciones/categorias-proveedores') return jsonResponse(opcionesProducto);
    if (path === '/ventas/opciones') return jsonResponse({ clientes, empleados, productos });
    if (path.startsWith('/reportes/')) return jsonResponse([]);

    return jsonResponse({ mensaje: 'Ruta no encontrada' }, false);
  }));
}

describe('App', () => {
  beforeEach(() => {
    mockFetch();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renderiza el dashboard inicial', async () => {
    render(<App />);

    expect(await screen.findByText('Total vendido')).toBeInTheDocument();
    expect(screen.getByText('Q 900.00')).toBeInTheDocument();
  });

  test('navega a productos con React Router', async () => {
    render(<App />);

    await userEvent.click(screen.getByRole('link', { name: 'Productos' }));

    expect(await screen.findByRole('heading', { name: 'Productos' })).toBeInTheDocument();
    expect(screen.getByText('Camisola Barcelona Hombre')).toBeInTheDocument();
  });

  test('muestra pagina 404 para rutas no existentes', async () => {
    window.history.pushState({}, '', '/ruta-inexistente');

    render(<App />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByText('Error 404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pagina no encontrada' })).toBeInTheDocument();
  });

  test('valida cantidad mayor a cero en ventas', () => {
    const errors = validarVenta({
      idCliente: 1,
      idEmpleado: 1,
      idProducto: 1,
      cantidad: 0,
      metodoPago: 'Efectivo'
    });

    expect(errors.cantidad).toBe('La cantidad debe ser un entero mayor a 0.');
  });
});
