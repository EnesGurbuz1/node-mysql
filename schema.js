const { gql } = require('apollo-server-express');

// GraphQL şema tanımları
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

    type Mutation {
    addUser(id: Int!, name: String!, email: String!): User
    deleteUser(id: Int!): User
    updateUser(id: Int!, name: String!, email: String!): User
    }
`;
module.exports = typeDefs;
