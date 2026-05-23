/**
 * resolvers/index.js — All resolvers using Mongoose models
 *
 * KEY DIFFERENCES from Week 1 in-memory resolvers:
 *
 *  1. Every DB operation is async — always use await
 *  2. array.find()   → await Model.findById(id)
 *  3. array.filter() → await Model.find({ field: value })
 *  4. array.push()   → await Model.create({...})
 *  5. array[i] = {}  → await Model.findByIdAndUpdate(id, { $set: input }, { new: true })
 *  6. array.splice() → await Model.findByIdAndDelete(id)
 *  7. Duplicate key errors from MongoDB have code 11000
 */

import { GraphQLError } from 'graphql'
import { Author } from '../models/Author.js'
import { Book }   from '../models/Book.js'

export const resolvers = {

  // ── Query resolvers ──────────────────────────────────────────────────────────
  Query: {

    // Return all books — optionally filter by genre
    books: async (_, args) => {
      const filter = args.genre ? { genre: args.genre } : {}
      return await Book.find(filter).sort({ createdAt: -1 })  // newest first
    },

    // Find one book by its MongoDB _id
    book: async (_, args) => {
      return await Book.findById(args.id)
    },

    // Return all authors sorted alphabetically
    authors: async () => {
      return await Author.find().sort({ name: 1 })
    },

    // Find one author by ID
    author: async (_, args) => {
      return await Author.findById(args.id)
    },
  },

  // ── Mutation resolvers ────────────────────────────────────────────────────────
  Mutation: {

    // ── Book mutations ─────────────────────────────────────────────────────────
    addBook: async (_, { input }) => {
      // Validate the author exists before creating the book
      const authorExists = await Author.findById(input.authorId)
      if (!authorExists) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      try {
        return await Book.create(input)
      } catch (err) {
        // MongoDB throws error code 11000 on duplicate unique field
        if (err.code === 11000) {
          throw new GraphQLError('A book with this ISBN already exists', {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }
        throw err
      }
    },

    updateBook: async (_, { id, input }) => {
      // Validate new author if authorId is being changed
      if (input.authorId) {
        const authorExists = await Author.findById(input.authorId)
        if (!authorExists) {
          throw new GraphQLError('Author not found', {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }
      }

      // { new: true }       → return the updated document, not the original
      // { runValidators: true } → run schema validators on the update
      const book = await Book.findByIdAndUpdate(
        id,
        { $set: input },  // $set only updates provided fields — leaves others alone
        { new: true, runValidators: true }
      )

      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      return book
    },

    deleteBook: async (_, { id }) => {
      const book = await Book.findByIdAndDelete(id)
      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return true
    },

    // ── Author mutations ────────────────────────────────────────────────────────
    addAuthor: async (_, { input }) => {
      try {
        return await Author.create(input)
      } catch (err) {
        if (err.code === 11000) {
          throw new GraphQLError(`Author "${input.name}" already exists`, {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }
        throw err
      }
    },

    updateAuthor: async (_, { id, input }) => {
      const author = await Author.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      )
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return author
    },

    deleteAuthor: async (_, { id }) => {
      const author = await Author.findByIdAndDelete(id)
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      // Cascade delete — remove all books by this author
      await Book.deleteMany({ authorId: id })
      return true
    },
  },

  // ── Field resolvers ───────────────────────────────────────────────────────────
  Author: {
    // Find all books in MongoDB where authorId matches this author's _id
    books: async (parent) => {
      return await Book.find({ authorId: parent._id }).sort({ year: -1 })
    },

    // countDocuments is more efficient than find().length
    bookCount: async (parent) => {
      return await Book.countDocuments({ authorId: parent._id })
    },
  },

  Book: {
    // Look up the Author document using the authorId stored on the book
    author: async (parent) => {
      return await Author.findById(parent.authorId)
    },
  },
}
