const express = require('express');
const mysql = require('mysql');
// const graphqlHTTP = require('express-graphql');
const { graphqlHTTP } = require('express-graphql'); // express-graphql modülü
const schema = require('./schema');



const app = express();

// Resolver fonksiyonlarını tanımlayın
const root = {
    getUser: ({ id }) => {
      return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE id = ${id}`;
        db.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        });
      });
    },
    getUsers: () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users';
        db.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    },
  };

// GraphQL endpoint'i
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
  

// MySQL bağlantı bilgilerini burada güncelleyin
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Enes2002',
  database: 'basecamp'
});

// MySQL bağlantısını başlat
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL bağlantısı başarıyla sağlandı!');
});

// User tablosundaki verileri okuma
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Sunucuyu başlat
const port = 3000;
app.listen(port, () => {
  console.log(`GraphQL sunucusu ${port} portunda çalışıyor.`);
});

app.get('/favicon.ico', (req, res) => res.status(204));
