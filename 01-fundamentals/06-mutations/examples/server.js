/**
 * server.js — Mutations example server
 *
 * A full CRUD server demonstrating all mutation patterns.
 * Data lives in memory — resets every time the server restarts.
 *
 * Run:  npm run dev
 * Open: http://localhost:4000/graphql
 * Try:  paste mutations from mutations.graphql into Apollo Sandbox
 */

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@as-integrations/express5";
import { GraphQLError } from 'graphql'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

//  In-memory "database" 
// We use a simple object so we can mutate it across requests.
// On Day 10 this gets replaced with real MongoDB operations.

const db = {
  users: [
    { id: '1', name: 'Sarah Ahmed', email: 'sarah@example.com', createdAt: new Date().toISOString() },
  ],
  posts: [
    { id: '1', title: 'First Post', content: 'Hello world!', authorId: '1', status: 'PUBLISHED', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  // Simple ID counters — in a real DB the DB generates IDs
  nextUserId: 2,
  nextPostId: 2,
}

//  Schema 

const typeDefs = `#graphql

  enum PostStatus { DRAFT  PUBLISHED  ARCHIVED }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    status: PostStatus!
    createdAt: String!
    updatedAt: String!
  }

  # Input types for mutations
  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    status: PostStatus
  }

  input UpdatePostInput {
    title: String
    content: String
    status: PostStatus
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!

    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
  }
`

//  Resolvers 

const resolvers = {
  Query: {
    users: () => db.users,
    user:  (_, args) => db.users.find(u => u.id === args.id) || null,
    posts: () => db.posts,
    post:  (_, args) => db.posts.find(p => p.id === args.id) || null,
  },

  User: {
    posts: (parent) => db.posts.filter(p => p.authorId === parent.id),
  },

  Post: {
    author: (parent) => db.users.find(u => u.id === parent.authorId),
  },

  Mutation: {

    // CREATE USER 
    createUser: (_, args) => {
      const { input } = args

      // Validation: check for duplicate email
      const exists = db.users.find(u => u.email === input.email)
      if (exists) {
        // Throw a GraphQL error — client gets a proper error message
        throw new GraphQLError('A user with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Create the new user object
      const newUser = {
        id: String(db.nextUserId++),   // assign and increment the counter
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      }

      // Save to our in-memory database
      db.users.push(newUser)

      // Return the new user — client receives it immediately
      return newUser
    },

    // CREATE POST 
    createPost: (_, args) => {
      const { input } = args

      // Validate: author must exist
      const author = db.users.find(u => u.id === input.authorId)
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const now = new Date().toISOString()
      const newPost = {
        id: String(db.nextPostId++),
        title: input.title,
        content: input.content,
        authorId: input.authorId,
        status: input.status || 'DRAFT',  // default to DRAFT if not provided
        createdAt: now,
        updatedAt: now,
      }
    
      db.posts.push(newPost)
      return newPost
    },

    // UPDATE POST 
    updatePost: (_, args) => {
      const { id, input } = args

      // Find the post — throw if it doesn't exist
      const postIndex = db.posts.findIndex(p => p.id === id)
      if (postIndex === -1) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      // Apply only the provided fields (partial update)
      // Object spread: keep existing fields, overwrite with new ones
      const updatedPost = {
        ...db.posts[postIndex],
        // Only update fields that were actually sent
        ...(input.title   !== undefined && { title: input.title }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.status  !== undefined && { status: input.status }),
        updatedAt: new Date().toISOString(),
      }

      // Replace the old post in our array
      db.posts[postIndex] = updatedPost
      return updatedPost
    },

    // DELETE POST 
    deletePost: (_, args) => {
      const { id } = args

      const postIndex = db.posts.findIndex(p => p.id === id)
      if (postIndex === -1) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      // Remove from array
      db.posts.splice(postIndex, 1)

      // Return true to signal success
      return true
    },

    // PUBLISH POST 
    publishPost: (_, args) => {
      const postIndex = db.posts.findIndex(p => p.id === args.id)
      if (postIndex === -1) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      if (db.posts[postIndex].status === 'PUBLISHED') {
        throw new GraphQLError('Post is already published', {
          extensions: { code: 'BAD_REQUEST' },
        })
      }

      db.posts[postIndex] = {
        ...db.posts[postIndex],
        status: 'PUBLISHED',
        updatedAt: new Date().toISOString(),
      }

      return db.posts[postIndex]
    },
  },
}

// Server 

const server = new ApolloServer({ typeDefs, resolvers })
const app = express()

async function startServer() {
  await server.start()
  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server))
  app.listen(4000, () => {
    console.log('Mutations example server at http://localhost:4000/graphql')
    console.log('Data resets every server restart (due to in-memory storage)')
  })
}

startServer()
