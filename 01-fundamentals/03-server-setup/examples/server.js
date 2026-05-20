/**
 * server.js — Your first GraphQL server
 *
 * Stack: Node.js + Express + Apollo Server v4
 *
 * Run with:  npm run dev
 * Then open: http://localhost:4000/graphql
 */

// Imports

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@as-integrations/express5";
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { config } from 'dotenv'

// Load .env variables into process.env (PORT, etc.)
config()

//  Schema (Type Definitions) 
//
// typeDefs defines the SHAPE of your API.
// Think of it as the menu — it lists everything a client can ask for.
//
// The `Query` type is special — it's the entry point for all read operations.
// Every GraphQL server must have at least a Query type.

const typeDefs = `#graphql

  # The Query type — all read operations live here
  type Query {
    # A simple greeting — returns a String
    hello: String

    # Returns the current server time
    serverTime: String

    # Returns a single user by ID
    user(id: ID!): User

    # Returns all users
    users: [User!]!
  }

  # A custom type — represents a User in our system
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    isAdmin: Boolean!
  }
`

// ─── In-memory data ───────────────────────────────────────────────────────────
//
// We're using a plain array as our "database" for now.
// Later on we'll replace this with real database calls.

const users = [
  { id: '1', name: 'Sarah Ahmed',  email: 'sarah@example.com',  age: 28, isAdmin: true  },
  { id: '2', name: 'Ali Hassan',   email: 'ali@example.com',    age: 24, isAdmin: false },
  { id: '3', name: 'Priya Sharma', email: 'priya@example.com',  age: 31, isAdmin: false },
]

// ─── Resolvers ────────────────────────────────────────────────────────────────
//
// Resolvers are plain JavaScript functions.
// Each resolver is responsible for returning data for ONE field in the schema.
//
// The structure MUST mirror the typeDefs exactly:
// - Query.hello maps to `hello` in the Query type
// - Query.user  maps to `user` in the Query type
// - etc.
//
// Every resolver receives 4 arguments: (parent, args, context, info)
// - parent  → result of the parent resolver (used in nested types)
// - args    → arguments passed in the query, e.g. user(id: "1") → args.id = "1"
// - context → shared data across all resolvers (auth user, DB connection, etc.)
// - info    → technical details about the query (rarely needed as a beginner)

const resolvers = {
  Query: {
    // hello() — takes no args, returns a string
    hello: () => {
      return 'Hello from GraphQL!'
    },

    // serverTime() — returns the current date/time as a string
    serverTime: () => {
      return new Date().toISOString()
    },

    // user(id: "1") — finds and returns one user by ID
    user: (parent, args) => {
      // args.id is whatever the client passed in: user(id: "2")
      return users.find(u => u.id === args.id) || null
    },

    // users() — returns the full list of users
    users: () => {
      return users
    },
  },
}

// ─── Create Apollo Server ─────────────────────────────────────────────────────
//
// ApolloServer takes:
// - typeDefs: your schema (what operations exist and what they return)
// - resolvers: your functions (how to fetch the data for each operation)
//
// Apollo validates that every field in typeDefs has a matching resolver.

const server = new ApolloServer({ typeDefs, resolvers })

// ─── Create Express app ───────────────────────────────────────────────────────

const app = express()
const PORT = process.env.PORT || 4000

// ─── Start server ─────────────────────────────────────────────────────────────
//
// Apollo Server v4 requires you to call server.start() before using it as middleware.
// This is an async operation, so we wrap everything in an async function.

async function startServer() {
  // Start Apollo Server (validates schema, sets up internals)
  await server.start()

  // Mount Apollo as Express middleware at /graphql
  // All GraphQL requests (queries, mutations) will be sent here as HTTP POST
  app.use(
    '/graphql',
    cors(),                    // Allow requests from any origin (fine for development)
    bodyParser.json(),         // Parse the JSON body of incoming requests
    expressMiddleware(server, {
      // context is called on every request
      // Whatever you return here is available as the 3rd arg in every resolver
      // We'll use this for auth on Day 11
      context: async ({ req }) => ({
        // For now, just pass the request headers
        // Later: decode JWT token here and attach the current user
        headers: req.headers,
      }),
    })
  )

  app.listen(PORT, () => {
console.log(`Server ready at http://localhost:${PORT}/graphql`);  })
}

startServer()
