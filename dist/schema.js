"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql

type Query {
    user(userId: ID!): User
    users: [User]
    posts: [Post]
}

type Mutation {
  signup(name: String!, email: String!, password: String!, bio: String ): AuthPayload,
  signin(email:String!, password:String!): AuthPayload,
  createPost(title: String!, content: String!): PostPayload,
  updatePost(postId: ID!, title: String, content: String): PostPayload
  deletePost(postId: ID!): PostPayload
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
  profile: Profile
  createdAt: String!
  posts: [Post]
}

type Profile {
    id: ID!
  bio: String!
  createdAt: String!
  user: User!
}

type AuthPayload {
  userError: String
  token: String
}

type PostPayload {
  userError: String
  post: Post
}


`;
