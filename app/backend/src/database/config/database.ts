import 'dotenv/config';
import { Options } from 'sequelize';

interface ProcessEnv {
  DB_DIALECT?: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
}

const dialectChoice: ProcessEnv['DB_DIALECT'] = process.env.DB_DIALECT as ProcessEnv['DB_DIALECT'] || 'mysql';

const config: Options = {
  username: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '123456',
  database: process.env.MYSQLDATABASE || 'TRYBE_FUTEBOL_CLUBE',
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.MYSQLPORT) || Number(process.env.DB_PORT) || 3002,
  dialect: dialectChoice,
  dialectOptions: {
    timezone: 'Z',
  },
  logging: false,
}

module.exports = config;
