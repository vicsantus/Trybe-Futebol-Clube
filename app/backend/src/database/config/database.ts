import 'dotenv/config';
import { Options } from 'sequelize';

const config: Options = {
  username: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '123456',
  database: process.env.MYSQLDATABASE || 'TRYBE_FUTEBOL_CLUBE',
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.MYSQLPORT) || Number(process.env.DB_PORT) || 3002,
  dialect: 'mysql',
  dialectOptions: {
    timezone: 'Z',
  },
  logging: false,
}

module.exports = config;
