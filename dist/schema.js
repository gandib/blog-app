"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

type Query {
    user: User
    users: [User]
    posts: [Post]
}

type Mutation {
  signup(name: String!, email: String!, password: String! ): AuthPayload,
  signin(email:String!, password:String!): AuthPayload
}

type AuthPayload {
  userError: String
  token: String
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  createdAt: String!
  published: Boolean!
}

type User {
    id: ID!
  name: String!
  email: String!
  password: User!
  bio: String
  createdAt: String!
  posts: [Post]
}

type Profile {
    id: ID!
  bio: String!
  createdAt: String!
  user: User!
}

`;
