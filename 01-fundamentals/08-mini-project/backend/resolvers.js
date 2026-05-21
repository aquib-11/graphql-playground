/**
 * resolvers.js — Full CRUD for Books and Authors
 */

import { GraphQLError } from "graphql";
import { authors, books, counters } from "./data.js";

export const resolvers = {
  // ── Query ────────────────────────────────────────────────────────────────────
  Query: {
    books: (_, args) => {
      if (args.genre) return books.filter((b) => b.genre === args.genre);
      return books;
    },
    book: (_, args) => books.find((b) => b.id === args.id) || null,
    authors: () => authors,
    author: (_, args) => authors.find((a) => a.id === args.id) || null,
  },

  // ── Book Mutations ───────────────────────────────────────────────────────────
  Mutation: {
    addBook: (_, { input }) => {
      const author = authors.find((a) => a.id === input.authorId);
      if (!author) {
        throw new GraphQLError(`Author with id "${input.authorId}" not found`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const duplicate = books.find((b) => b.isbn === input.isbn);
      if (duplicate) {
        throw new GraphQLError(
          `A book with ISBN "${input.isbn}" already exists`,
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }
      const newBook = {
        id: String(counters.nextBookId++),
        title: input.title,
        isbn: input.isbn,
        genre: input.genre,
        year: input.year,
        authorId: input.authorId,
      };
      books.push(newBook);
      return newBook;
    },

    updateBook: (_, { id, input }) => {
      const index = books.findIndex((b) => b.id === id);
      if (index === -1) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      // If changing author, validate the new author exists
      if (input.authorId) {
        const author = authors.find((a) => a.id === input.authorId);
        if (!author) {
          throw new GraphQLError(
            `Author with id "${input.authorId}" not found`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            },
          );
        }
      }
      // If changing ISBN, check it's not taken by another book
      if (input.isbn) {
        const duplicate = books.find(
          (b) => b.isbn === input.isbn && b.id !== id,
        );
        if (duplicate) {
          throw new GraphQLError(
            `ISBN "${input.isbn}" is already used by another book`,
            {
              extensions: { code: "BAD_USER_INPUT" },
            },
          );
        }
      }
      books[index] = {
        ...books[index],
        ...(input.title !== undefined && { title: input.title }),
        ...(input.isbn !== undefined && { isbn: input.isbn }),
        ...(input.genre !== undefined && { genre: input.genre }),
        ...(input.year !== undefined && { year: input.year }),
        ...(input.authorId !== undefined && { authorId: input.authorId }),
      };
      return books[index];
    },

    deleteBook: (_, { id }) => {
      const index = books.findIndex((b) => b.id === id);
      if (index === -1) {
        throw new GraphQLError(`Book with id "${id}" not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      books.splice(index, 1);
      return true;
    },

    // ── Author Mutations ───────────────────────────────────────────────────────
    addAuthor: (_, { input }) => {
      const exists = authors.find(
        (a) => a.name.toLowerCase() === input.name.toLowerCase(),
      );
      if (exists) {
        throw new GraphQLError(`Author "${input.name}" already exists`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const newAuthor = {
        id: String(counters.nextAuthorId++),
        name: input.name,
        bio: input.bio || null,
      };
      authors.push(newAuthor);
      return newAuthor;
    },

    updateAuthor: (_, { id, input }) => {
      const index = authors.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new GraphQLError(`Author with id "${id}" not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      // If changing name, check it's not taken
      if (input.name) {
        const duplicate = authors.find(
          (a) =>
            a.name.toLowerCase() === input.name.toLowerCase() && a.id !== id,
        );
        if (duplicate) {
          throw new GraphQLError(`Author "${input.name}" already exists`, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }
      }
      authors[index] = {
        ...authors[index],
        ...(input.name !== undefined && { name: input.name }),
        ...(input.bio !== undefined && { bio: input.bio }),
      };
      return authors[index];
    },

    deleteAuthor: (_, { id }) => {
      const index = authors.findIndex((a) => a.id === id);
      if (index === -1) {
        throw new GraphQLError(`Author with id "${id}" not found`, {
          extensions: { code: "NOT_FOUND" },
        });
      }
      // Also delete all books by this author
      const bookIndexes = books.reduce((acc, b, i) => {
        if (b.authorId === id) acc.push(i);
        return acc;
      }, []);
      // Remove in reverse order so indexes stay valid
      bookIndexes.reverse().forEach((i) => books.splice(i, 1));
      authors.splice(index, 1);
      return true;
    },
  },

  // ── Field resolvers ──────────────────────────────────────────────────────────
  Author: {
    books: (parent) => books.filter((b) => b.authorId === parent.id),
    bookCount: (parent) => books.filter((b) => b.authorId === parent.id).length,
  },

  Book: {
    author: (parent) => authors.find((a) => a.id === parent.authorId),
  },
};
