/**
 * https://github.com/vitaly-t/pg-promise/wiki/Connection-Syntax
 */
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
export default dbConfig;
