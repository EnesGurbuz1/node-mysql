const mysql = require('mysql');

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Enes2002',
    database: 'basecamp',
  });

module.exports = db;