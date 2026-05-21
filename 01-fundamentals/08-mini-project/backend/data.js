/**
 * data.js — In-memory database
 *
 * This is our "database" for the Book Library API.
 * It's just plain JavaScript arrays and objects.
 *
 * On Day 10 (MongoDB Integration) we'll replace this
 * with real Mongoose models and MongoDB queries.
 */

export const authors = [
  {
    id: '1',
    name: 'Robert C. Martin',
    bio: 'Software engineer and author, widely known as "Uncle Bob". Advocate of clean code and agile practices.',
  },
  {
    id: '2',
    name: 'J.K. Rowling',
    bio: 'British author best known for the Harry Potter fantasy series.',
  },
  {
    id: '3',
    name: 'Frank Herbert',
    bio: 'American science fiction author best known for the Dune series.',
  },
]

export const books = [
  {
    id: '1',
    title: 'Clean Code',
    isbn: '978-0132350884',
    genre: 'TECHNOLOGY',
    year: 2008,
    authorId: '1',
  },
  {
    id: '2',
    title: 'The Clean Coder',
    isbn: '978-0137081073',
    genre: 'TECHNOLOGY',
    year: 2011,
    authorId: '1',
  },
  {
    id: '3',
    title: "Harry Potter and the Philosopher's Stone",
    isbn: '978-0747532743',
    genre: 'FICTION',
    year: 1997,
    authorId: '2',
  },
  {
    id: '4',
    title: 'Dune',
    isbn: '978-0441013593',
    genre: 'FICTION',
    year: 1965,
    authorId: '3',
  },
]

// Simple ID counters — a real database would auto-generate these
export const counters = { nextAuthorId: 4, nextBookId: 5 }
