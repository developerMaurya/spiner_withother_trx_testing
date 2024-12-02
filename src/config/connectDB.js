const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    // database: 'games',
    // database: 'colorgame2024'
    database: 'rc'
});

export default connection;