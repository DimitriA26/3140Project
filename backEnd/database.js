const Pool = require('pg').Pool;

const Pool = new Pool({
    user: process.envDB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    database: process.env.DB_NAME,
});

module.exports = Pool;

//