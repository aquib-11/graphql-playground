/**
 * server.js — Resolvers deep dive
 *
 * This server demonstrates every resolver pattern:
 *   - Root resolvers (Query, Mutation)
 *   - Field resolvers (nested types)
 *   - Using parent, args, and context
 *   - Default resolvers
 *   - Computed fields
 *
 * Run:  npm run dev
 * Open: http://localhost:4000/graphql
 */

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@as-integrations/express5";

import { GraphQLError } from 'graphql'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

// ─── In-memory data ───────────────────────────────────────────────────────────

const users = [
  { id: '1', firstName: 'Sarah',  lastName: 'Ahmed',  email: 'sarah@example.com',  role: 'AUTHOR', createdAt: '2024-01-01' },
  { id: '2', firstName: 'Ali',    lastName: 'Hassan', email: 'ali@example.com',    role: 'AUTHOR', createdAt: '2024-02-01' },
  { id: '3', firstName: 'Priya',  lastName: 'Sharma', email: 'priya@example.com',  role: 'READER', createdAt: '2024-03-01' },
]

const posts = [
  { id: '1', title: 'Getting Started with GraphQL', content: 'GraphQL is great...', authorId: '1', status: 'PUBLISHED', createdAt: '2024-06-01' },
  { id: '2', title: 'Understanding Resolvers',      content: 'Resolvers are...',    authorId: '1', status: 'PUBLISHED', createdAt: '2024-07-01' },
  { id: '3', title: 'Draft Post',                   content: 'Work in progress...', authorId: '2', status: 'DRAFT',     createdAt: '2024-08-01' },
]

const comments = [
  { id: '1', text: 'Great post!',        postId: '1', authorId: '2' },
  { id: '2', text: 'Very helpful!',      postId: '1', authorId: '3' },
  { id: '3', text: 'Thanks for sharing', postId: '2', authorId: '3' },
]

// ─── Schema ───────────────────────────────────────────────────────────────────

const typeDefs = `#graphql
  enum PostStatus { DRAFT  PUBLISHED }
  enum UserRole   { READER  AUTHOR  ADMIN }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    # fullName is a COMPUTED field — not stored in DB, built in resolver
    fullName: String!
    email: String!
    role: UserRole!
    posts: [Post!]!
    postCount: Int!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    # author is a RELATIONAL field — looked up from users table
    author: User!
    status: PostStatus!
    comments: [Comment!]!
    commentCount: Int!
    # summary is a COMPUTED field — first 100 chars of content
    summary: String!
    createdAt: String!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Query {
    # Root resolvers — parent is always null here
    users: [User!]!
    user(id: ID!): User
    posts(status: PostStatus): [Post!]!
    post(id: ID!): Post
    me: User
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
    deletePost(id: ID!): Boolean!
  }
`

// ─── Resolvers ────────────────────────────────────────────────────────────────

const resolvers = {

  // ── Query resolvers ─────────────────────────────────────────────────────────
  // These are ROOT resolvers — parent is null, args comes from the query
  Query: {
    users: () => users,

    user: (parent, args) => {
      // args.id = whatever was passed in the query: user(id: "2")
      return users.find(u => u.id === args.id) || null
    },

    posts: (parent, args) => {
      if (args.status) {
        return posts.filter(p => p.status === args.status)
      }
      return posts
    },

    post: (parent, args) => {
      return posts.find(p => p.id === args.id) || null
    },

    // context.currentUser is set in the server's context function below
    me: (parent, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' },
        })
      }
      return context.currentUser
    },
  },

  // ── Mutation resolvers ──────────────────────────────────────────────────────
  Mutation: {
    createPost: (parent, args, context) => {
      // In a real app, check context.currentUser for auth
      // For now we hardcode authorId: '1' to keep it simple
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: '1',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      }
      posts.push(newPost)
      return newPost
    },

    deletePost: (parent, args) => {
      const index = posts.findIndex(p => p.id === args.id)
      if (index === -1) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      posts.splice(index, 1)
      return true
    },
  },

  // ── User field resolvers ────────────────────────────────────────────────────
  // parent = the User object returned by a parent resolver
  User: {
    // COMPUTED FIELD — not stored in DB, built from firstName + lastName
    // parent = { id: '1', firstName: 'Sarah', lastName: 'Ahmed', ... }
    fullName: (parent) => {
      return `${parent.firstName} ${parent.lastName}`
    },

    // RELATIONAL FIELD — find all posts for this user
    posts: (parent) => {
      // parent.id is the user's ID — filter posts where authorId matches
      return posts.filter(p => p.authorId === parent.id)
    },

    // COMPUTED COUNT — more efficient than fetching all posts just to count
    postCount: (parent) => {
      return posts.filter(p => p.authorId === parent.id).length
    },

    // NOTE: id, firstName, lastName, email, role, createdAt do NOT need resolvers
    // GraphQL's default resolver reads them directly from the parent object
  },

  // ── Post field resolvers ────────────────────────────────────────────────────
  // parent = the Post object returned by a parent resolver
  Post: {
    // RELATIONAL FIELD — find the user who wrote this post
    author: (parent) => {
      // parent.authorId tells us which user to look up
      return users.find(u => u.id === parent.authorId)
    },

    // RELATIONAL FIELD — find all comments for this post
    comments: (parent) => {
      return comments.filter(c => c.postId === parent.id)
    },

    // COMPUTED COUNT
    commentCount: (parent) => {
      return comments.filter(c => c.postId === parent.id).length
    },

    // COMPUTED FIELD — truncate content to first 100 characters
    summary: (parent) => {
      return parent.content.length > 100
        ? parent.content.slice(0, 100) + '...'
        : parent.content
    },
  },

  // ── Comment field resolvers ─────────────────────────────────────────────────
  Comment: {
    author: (parent) => users.find(u => u.id === parent.authorId),
    post:   (parent) => posts.find(p => p.id === parent.postId),
  },
}

// ─── Server setup ─────────────────────────────────────────────────────────────

const server = new ApolloServer({ typeDefs, resolvers })
const app = express()

async function startServer() {
  await server.start()

  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      // Simulate auth: if header "x-user-id" is sent, treat that user as logged in
      // On Day 11 (Auth) this becomes a real JWT token check
      const userId = req.headers['x-user-id']
      const currentUser = userId
        ? users.find(u => u.id === userId) || null
        : null

      return { currentUser }
    },
  }))

  app.listen(4000, () => {
    console.log('Resolvers example server at http://localhost:4000/graphql')
    
  })
}

startServer()
