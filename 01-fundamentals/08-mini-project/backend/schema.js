/**
 * schema.js — Book Library API schema
 *
 * Covers: object types, enums, input types,
 *         non-null, lists, Query root, Mutation root
 */

export const typeDefs = `

  #  Enum 
  # Restricts genre to a fixed set of values
  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE
    HISTORY
    BIOGRAPHY
    TECHNOLOGY
  }

    # Object types 

  type Author {
    id: ID!
    name: String!
    bio: String               # Optional — some authors don't have a bio
    books: [Book!]!           # All books by this author (resolved from books array)
    bookCount: Int!           # Computed — count without fetching all books
  }

  type Book {
    id: ID!
    title: String!
    isbn: String!
    genre: Genre!
    year: Int!
    author: Author!           # Relational — resolved from authors array
  }

  # Input types 
  # Used for mutation arguments — cleaner than listing each field separately

  input CreateBookInput {
    title: String!
    isbn: String!
    genre: Genre!
    year: Int!
    authorId: ID!
  }

  input UpdateBookInput {
    title: String             # All fields optional — only send what's changing
    isbn: String
    genre: Genre
    year: Int
  }

  # Root types 

  type Query {
    books(genre: Genre): [Book!]!     # Optional genre filter
    book(id: ID!): Book               # Nullable — returns null if not found
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    addBook(input: CreateBookInput!): Book!
    updateBook(id: ID!, input: UpdateBookInput!): Book!
    deleteBook(id: ID!): Boolean!
    addAuthor(name: String!, bio: String): Author!
  }
`
