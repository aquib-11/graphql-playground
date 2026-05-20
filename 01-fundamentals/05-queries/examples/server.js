/**
 * server.js — Queries example server
 *
 * A server with enough data to demonstrate:
 * - Basic queries
 * - Nested queries
 * - Variables
 * - Aliases
 * - Fragments
 * - Directives
 * - Inline fragments
 * - Unions
 * - Interfaces
 * - Nested field arguments
 *
 * Run: npm run dev
 * Open: http://localhost:4000/graphql
 */

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

//  In-memory data 

const users = [
  { id: "1", name: "Sarah Ahmed", email: "sarah@example.com", role: "AUTHOR" },
  { id: "2", name: "Ali Hassan", email: "ali@example.com", role: "AUTHOR" },
  { id: "3", name: "Priya Sharma", email: "priya@example.com", role: "READER" },
];

const posts = [
  {
    id: "1",
    title: "Getting Started with GraphQL",
    content: "GraphQL is a query language for your API...",
    authorId: "1",
    status: "PUBLISHED",
    publishedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding Resolvers",
    content: "Resolvers are the functions that...",
    authorId: "1",
    status: "PUBLISHED",
    publishedAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Draft Post",
    content: "This is still a draft...",
    authorId: "2",
    status: "DRAFT",
    publishedAt: null,
  },
];

const comments = [
  { id: "1", postId: "1", authorId: "2", text: "Great article!" },
  { id: "2", postId: "1", authorId: "3", text: "Very helpful, thanks." },
  { id: "3", postId: "2", authorId: "3", text: "Can you do a follow-up?" },
];

// Type Definitions 

const typeDefs = `

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum UserRole {
    READER
    AUTHOR
    ADMIN
  }

  interface Node {
    id: ID!
  }

  type User implements Node {
    id: ID!
    name: String!
    email: String!
    role: UserRole!

    # Nested field arguments example
    posts(limit: Int): [Post!]!
  }

  type Post implements Node {
    id: ID!
    title: String!
    content: String!
    author: User!
    status: PostStatus!
    publishedAt: String
    comments: [Comment!]!
    commentCount: Int!
  }

  type Comment implements Node {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  # Union example
  union SearchResult = User | Post

  type Query {
    hello: String!

    user(id: ID!): User
    users: [User!]!

    post(id: ID!): Post
    posts(limit: Int, status: PostStatus): [Post!]!

    # Search can return multiple types
    search(query: String!): [SearchResult!]!
  }
`;

//  Resolvers 

const resolvers = {
  // Interface type resolver
  Node: {
    __resolveType(obj) {
      if (obj.email) return "User";
      if (obj.content) return "Post";
      if (obj.text) return "Comment";
      return null;
    },
  },

  // Union type resolver
  SearchResult: {
    __resolveType(obj) {
      if (obj.email) return "User";
      if (obj.content) return "Post";
      return null;
    },
  },

  Query: {
    hello: () => "Hello from GraphQL!",

    user: (_, args) => users.find((u) => u.id === args.id) || null,

    users: () => users,

    post: (_, args) => posts.find((p) => p.id === args.id) || null,

    posts: (_, args) => {
      let result = [...posts];

      // Filter by status
      if (args.status) {
        result = result.filter((p) => p.status === args.status);
      }

      // Limit results
      if (args.limit) {
        result = result.slice(0, args.limit);
      }

      return result;
    },

    // Union example
    search: (_, args) => {
      const q = args.query.toLowerCase();

      const matchedUsers = users.filter((user) =>
        user.name.toLowerCase().includes(q),
      );

      const matchedPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(q),
      );

      return [...matchedUsers, ...matchedPosts];
    },
  },

  //  User field resolvers 

  User: {
    // Nested field arguments example
    posts: (parent, args) => {
      let userPosts = posts.filter((p) => p.authorId === parent.id);

      if (args.limit) {
        userPosts = userPosts.slice(0, args.limit);
      }

      return userPosts;
    },
  },

  // Post field resolvers 

  Post: {
    author: (parent) => users.find((u) => u.id === parent.authorId),

    comments: (parent) => comments.filter((c) => c.postId === parent.id),

    commentCount: (parent) =>
      comments.filter((c) => c.postId === parent.id).length,
  },

  // Comment field resolvers 

  Comment: {
    author: (parent) => users.find((u) => u.id === parent.authorId),

    post: (parent) => posts.find((p) => p.id === parent.postId),
  },
};

// Server 

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

async function startServer() {
  await server.start();

  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Queries example server ready at:");
    console.log("http://localhost:4000/graphql");
  });
}

startServer();
