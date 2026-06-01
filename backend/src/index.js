import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { pool } from './db.js';
import authRouter from './routes/auth.js';
import productosRouter from './routes/productos.js';
import clientesRouter from './routes/clientes.js';
import ventasRouter from './routes/ventas.js';
import reportesRouter from './routes/reportes.js';
import { requireAuth } from './auth.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'proyecto3-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  }
}));

app.get('/', (_req, res) => {
  res.json({ mensaje: 'API Proyecto 2 Bases de Datos' });
});

app.get('/api/health', async (_req, res) => {
  const result = await pool.query('SELECT NOW() AS fecha');
  res.json({ estado: 'ok', postgres: result.rows[0].fecha });
});

app.use('/api/auth', authRouter);
app.use('/api/productos', requireAuth, productosRouter);
app.use('/api/clientes', requireAuth, clientesRouter);
app.use('/api/ventas', requireAuth, ventasRouter);
app.use('/api/reportes', requireAuth, reportesRouter);

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
