/**
 * schema.js — Book Library API schema
 * Full CRUD for both Books and Authors
 */

export const typeDefs = `#graphql

  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE
    HISTORY
    BIOGRAPHY
    TECHNOLOGY
  }

  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    genre: Genre!
    year: Int!
    author: Author!
  }

  # ── Input types ─────────────────────────────────────────────────────────────

  input CreateBookInput {
    title: String!
    isbn: String!
    genre: Genre!
    year: Int!
    authorId: ID!
  }

  input UpdateBookInput {
    title: String
    isbn: String
    genre: Genre
    year: Int
    authorId: ID
  }

  input CreateAuthorInput {
    name: String!
    bio: String
  }

  input UpdateAuthorInput {
    name: String
    bio: String
  }

  # ── Root types ───────────────────────────────────────────────────────────────

  type Query {
    books(genre: Genre): [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    # Book CRUD
    addBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!

    # Author CRUD
    addAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
    deleteAuthor(id: ID!): Boolean!
  }
`;
