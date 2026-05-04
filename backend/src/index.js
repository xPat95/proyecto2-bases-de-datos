import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pool } from './db.js';
import productosRouter from './routes/productos.js';
import clientesRouter from './routes/clientes.js';
import ventasRouter from './routes/ventas.js';
import reportesRouter from './routes/reportes.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API Proyecto 2 Bases de Datos' });
});

app.get('/api/health', async (_req, res) => {
  const result = await pool.query('SELECT NOW() AS fecha');
  res.json({ estado: 'ok', postgres: result.rows[0].fecha });
});

app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/reportes', reportesRouter);

app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    mensaje: err.mensaje || 'Ocurrio un error en el servidor'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend escuchando en puerto ${port}`);
});
