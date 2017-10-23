const mysql = require('mysql2/promise');
const DB_CONFIG = require('./config/db');

const pool = mysql.createPool({
    connectionLimit: 10,
    ...DB_CONFIG
});

module.exports = pool;
