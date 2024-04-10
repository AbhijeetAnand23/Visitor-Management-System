const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'VisitorManagementSystem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    pool
};