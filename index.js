const express = require('express');
const { ApolloServer} = require('apollo-server-express');
const resolvers = require('./resolvers.js');
const typeDefs = require('./schema')
const db = require('./db.js');


const app = express();



// Çözümleyiciler (resolvers) tanımı


// Apollo Server tanımı
const server = new ApolloServer({
  typeDefs,
  resolvers
});


db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanırken bir hata oluştu:', err);
  } else {
    console.log('Veritabanına başarıyla bağlandı.');

    // Apollo Server'ı başlatan asenkron fonksiyon
    async function startApolloServer() {
      await server.start();
      server.applyMiddleware({ app });
    }

    // Apollo Server'ı başlat
    startApolloServer().then(() => {
      const port = 3000;
      app.listen(port, () => {
        console.log(`GraphQL sunucusu ${port} portunda çalışıyor.`);
      });
    });
  }
});
