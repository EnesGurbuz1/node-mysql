const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mysql = require('mysql');

const app = express();

const typeDefs = gql`
  type User {
    id: Int
    name: String
    email: String
  }

  type Query {
    getUser(id: Int): User
    getUsers: [User]
  }
`;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Enes2002',
  database: 'basecamp'
});

const resolvers = {
  Query: {
    getUser: ({ id }) => {
      if (typeof id !== 'number') {
        throw new Error('Geçerli bir kullanıcı kimliği sağlanmalıdır.');
      }
      return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE id = ${id}`;
        db.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            if (results.length > 0) {
              const user = {
                id: results[0].id,
                name: results[0].name,
                email: results[0].email
              };
              resolve(user);
            } else {
              resolve(null);
            }
          }
        });
      });
    },
    getUsers: () => {
      return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users';
        db.query(query, (err, results) => {
          if (err) {
            reject(err);
          } else {
            const users = results.map(result => ({
              id: result.id,
              name: result.name,
              email: result.email
            }));
            resolve(users);
          }
        });
      });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer().then(() => {
  const port = 3000;
  app.listen(port, () => {
    console.log(`GraphQL sunucusu ${port} portunda çalışıyor.`);
  });
});
