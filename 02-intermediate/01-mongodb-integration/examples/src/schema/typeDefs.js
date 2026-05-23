/**
 * schema/typeDefs.js
 *
 * Identical to 01 fundamentals  schema — the GraphQL API surface
 * does not change when we swap the data layer.
 * This is the power of GraphQL's separation of concerns.
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
    createdAt: String!
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    genre: Genre!
    year: Int!
    author: Author!
    createdAt: String!
  }

  input CreateBookInput {
    title:    String!
    isbn:     String!
    genre:    Genre!
    year:     Int!
    authorId: ID!
  }

  input UpdateBookInput {
    title:    String
    isbn:     String
    genre:    Genre
    year:     Int
    authorId: ID
  }

  input CreateAuthorInput {
    name: String!
    bio:  String
  }

  input UpdateAuthorInput {
    name: String
    bio:  String
  }

  type Query {
    books(genre: Genre): [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    addBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!

    addAuthor(input: CreateAuthorInput!): Author!
    updateAuthor(id: ID!, input: UpdateAuthorInput!): Author!
    deleteAuthor(id: ID!): Boolean!
  }
`
