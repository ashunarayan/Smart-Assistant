const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL Connected'))
  .catch((err) => console.error('Connection error:', err));

module.exports = pool;
