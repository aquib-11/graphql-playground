/**
 * operations.js — All GraphQL queries and mutations
 */

import { gql } from "@apollo/client";

// ─── Fragments ────────────────────────────────────────────────────────────────

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
`;

export const AUTHOR_FIELDS = gql`
  fragment AuthorFields on Author {
    id
    name
    bio
    bookCount
  }
`;

// ─── Book Queries ─────────────────────────────────────────────────────────────

export const GET_BOOKS = gql`
  ${BOOK_FIELDS}
  query GetBooks($genre: Genre) {
    books(genre: $genre) {
      ...BookFields
    }
  }
`;

export const GET_BOOK = gql`
  ${BOOK_FIELDS}
  query GetBook($id: ID!) {
    book(id: $id) {
      ...BookFields
    }
  }
`;

// ─── Author Queries ───────────────────────────────────────────────────────────

export const GET_AUTHORS = gql`
  ${AUTHOR_FIELDS}
  query GetAuthors {
    authors {
      ...AuthorFields
      books {
        id
        title
        genre
        year
      }
    }
  }
`;

// ─── Book Mutations ───────────────────────────────────────────────────────────

export const ADD_BOOK = gql`
  ${BOOK_FIELDS}
  mutation AddBook($input: CreateBookInput!) {
    addBook(input: $input) {
      ...BookFields
    }
  }
`;

export const UPDATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      ...BookFields
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// ─── Author Mutations ─────────────────────────────────────────────────────────

export const ADD_AUTHOR = gql`
  ${AUTHOR_FIELDS}
  mutation AddAuthor($input: CreateAuthorInput!) {
    addAuthor(input: $input) {
      ...AuthorFields
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  ${AUTHOR_FIELDS}
  mutation UpdateAuthor($id: ID!, $input: UpdateAuthorInput!) {
    updateAuthor(id: $id, input: $input) {
      ...AuthorFields
    }
  }
`;

export const DELETE_AUTHOR = gql`
  mutation DeleteAuthor($id: ID!) {
    deleteAuthor(id: $id)
  }
`;
