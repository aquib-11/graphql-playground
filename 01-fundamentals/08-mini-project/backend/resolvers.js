/**
 * resolvers.js — Book Library API resolvers
 *
 * Covers: Query resolvers, Mutation resolvers,
 *         field resolvers (Author.books, Book.author),
 *         computed fields (Author.bookCount),
 *         error handling with GraphQLError
 */

import { GraphQLError } from 'graphql'
import { authors, books, counters } from './data.js'

export const resolvers = {

  //  Query resolvers 
  Query: {
    // Return all books, optionally filtered by genre
    books: (_, args) => {
      if (args.genre) {
        return books.filter(b => b.genre === args.genre)
      }
      return books
    },

    // Return one book by ID, or null if not found
    book: (_, args) => {
      return books.find(b => b.id === args.id) || null
    },

    // Return all authors
    authors: () => authors,

    // Return one author by ID
    author: (_, args) => {
      return authors.find(a => a.id === args.id) || null
    },
  },

  //  Mutation resolvers 
  Mutation: {
    // Add a new book
    addBook: (_, args) => {
      const { input } = args

      // Validation: author must exist
      const author = authors.find(a => a.id === input.authorId)
      if (!author) {
        throw new GraphQLError(`Author with id "${input.authorId}" not found`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Validation: ISBN must be unique
      const duplicate = books.find(b => b.isbn === input.isbn)
      if (duplicate) {
        throw new GraphQLError(`A book with ISBN "${input.isbn}" already exists`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const newBook = {
        id: String(counters.nextBookId++),
        title: input.title,
        isbn: input.isbn,
        genre: input.genre,
        year: input.year,
        authorId: input.authorId,
      }

      books.push(newBook)
      return newBook
    },

    // Update an existing book — only change the provided fields
    updateBook: (_, args) => {
      const { id, input } = args

      const index = books.findIndex(b => b.id === id)
      if (index === -1) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      // Merge existing book with updated fields
      // Only fields included in input will be changed
      books[index] = {
        ...books[index],
        ...(input.title !== undefined && { title: input.title }),
        ...(input.isbn  !== undefined && { isbn:  input.isbn  }),
        ...(input.genre !== undefined && { genre: input.genre }),
        ...(input.year  !== undefined && { year:  input.year  }),
      }

      return books[index]
    },

    // Delete a book by ID
    deleteBook: (_, args) => {
      const index = books.findIndex(b => b.id === args.id)
      if (index === -1) {
        throw new GraphQLError(`Book with id "${args.id}" not found`, {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      books.splice(index, 1)
      return true
    },

    // Add a new author
    addAuthor: (_, args) => {
      // Validation: name must be unique
      const exists = authors.find(a => a.name.toLowerCase() === args.name.toLowerCase())
      if (exists) {
        throw new GraphQLError(`Author "${args.name}" already exists`, {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const newAuthor = {
        id: String(counters.nextAuthorId++),
        name: args.name,
        bio: args.bio || null,
      }

      authors.push(newAuthor)
      return newAuthor
    },
  },

  //  Author field resolvers 
  Author: {
    // Relational field — find all books by this author
    // parent = the Author object (has parent.id)
    books: (parent) => {
      return books.filter(b => b.authorId === parent.id)
    },

    // Computed field — count without fetching all books
    bookCount: (parent) => {
      return books.filter(b => b.authorId === parent.id).length
    },
  },

  // Book field resolvers 
  Book: {
    // Relational field — find the author of this book
    // parent = the Book object (has parent.authorId)
    author: (parent) => {
      return authors.find(a => a.id === parent.authorId)
    },
  },
}
