const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Connect to default postgres database
    await client.connect();
    
    // Create database if it doesn't exist
    await client.query(`CREATE DATABASE ${process.env.DB_NAME};`);
    console.log(`Database ${process.env.DB_NAME} created`);
    
    await client.end();

    // Now connect to the new database and run schema
    const dbClient = new Client({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
    });

    await dbClient.connect();

    // Run schema
    const schema = fs.readFileSync(path.join(__dirname, '../database/database.sql'), 'utf8');
    await dbClient.query(schema);
    console.log('Database schema created');

    await dbClient.end();
  } catch (err) {
    console.error('Error setting up database:', err.message);
    process.exit(1);
  }
}

setupDatabase();