/**
 * operations.js — All GraphQL queries and mutations
 *
 * We keep all operations in one file so they're easy to find and reuse.
 * gql is a template literal tag from Apollo that parses the GraphQL string.
 */

import { gql } from '@apollo/client'

//  Fragment — reusable set of fields 
// Used in multiple queries below to avoid repeating the same fields

export const BOOK_FIELDS = gql`
  fragment BookFields on Book {
    id
    title
    isbn
    genre
    year
    author {
      id
      name
    }
  }
`

// Queries 

export const GET_BOOKS = gql`
  ${BOOK_FIELDS}
  query GetBooks($genre: Genre) {
    books(genre: $genre) {
      ...BookFields
    }
  }
`

export const GET_BOOK = gql`
  ${BOOK_FIELDS}
  query GetBook($id: ID!) {
    book(id: $id) {
      ...BookFields
    }
  }
`

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      bio
      bookCount
      books {
        id
        title
        genre
      }
    }
  }
`

// Mutations 

export const ADD_BOOK = gql`
  ${BOOK_FIELDS}
  mutation AddBook($input: CreateBookInput!) {
    addBook(input: $input) {
      ...BookFields
    }
  }
`

export const UPDATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      ...BookFields
    }
  }
`

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`

export const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!, $bio: String) {
    addAuthor(name: $name, bio: $bio) {
      id
      name
      bio
    }
  }
`
