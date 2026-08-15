// Single shared Postgres connection pool.
// Every controller imports this instead of creating its own connection.
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
