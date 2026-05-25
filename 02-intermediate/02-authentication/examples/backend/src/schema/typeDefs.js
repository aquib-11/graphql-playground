/**
 * schema/typeDefs.js
 *
 * Comments clearly mark which operations are:
 *   PUBLIC     — no token needed
 *   PROTECTED  — requires valid JWT
 *   ADMIN ONLY — requires ADMIN role
 */

export const typeDefs = `#graphql

  enum Role { USER  ADMIN }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  # Returned after login or register
  type AuthPayload {
    token: String!
    user: User!
  }

  # ── Inputs ──────────────────────────────────────────────────────────────────

  input RegisterInput {
    name:     String!
    email:    String!
    password: String!
  }

  input CreatePostInput {
    title:   String!
    content: String!
  }

  input UpdatePostInput {
    title:   String
    content: String
  }

  # ── Queries ─────────────────────────────────────────────────────────────────

  type Query {
    "PUBLIC — health check"
    hello: String!

    "PROTECTED — returns the currently authenticated user"
    me: User!

    "PROTECTED — returns all posts"
    posts: [Post!]!

    "PROTECTED — returns a single post by ID"
    post(id: ID!): Post!

    "ADMIN ONLY — returns all users"
    users: [User!]!
  }

  # ── Mutations ────────────────────────────────────────────────────────────────

  type Mutation {
    "PUBLIC — create a new account"
    register(input: RegisterInput!): AuthPayload!

    "PUBLIC — sign in with email and password"
    login(email: String!, password: String!): AuthPayload!

    "PROTECTED — create a new post (author = current user)"
    createPost(input: CreatePostInput!): Post!

    "PROTECTED — update a post (owner or admin only)"
    updatePost(id: ID!, input: UpdatePostInput!): Post!

    "PROTECTED — delete a post (owner or admin only)"
    deletePost(id: ID!): Boolean!

    "ADMIN ONLY — delete a user and all their posts"
    deleteUser(id: ID!): Boolean!
  }
`
