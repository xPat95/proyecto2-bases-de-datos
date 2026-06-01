import { DataTypes, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.POSTGRES_DB,
  process.env.DB_USER || process.env.POSTGRES_USER,
  process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    logging: false,
    port: Number(process.env.DB_PORT || 5432)
  }
);

export const Producto = sequelize.define('Producto', {
  idProducto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idproducto'
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  precioCompra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'preciocompra'
  },
  precioVenta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precioventa'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockMinimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'stockminimo'
  },
  idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idcategoria'
  },
  idProveedor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idproveedor'
  }
}, {
  tableName: 'producto',
  timestamps: false
});

export const Cliente = sequelize.define('Cliente', {
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'idcliente'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  direccion: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fechaRegistro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'fecharegistro'
  }
}, {
  tableName: 'cliente',
  timestamps: false
});
