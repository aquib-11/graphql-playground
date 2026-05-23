/**
 * seed.js — Populate MongoDB with initial data
 *
 * Run once before starting the server:
 *   npm run seed
 *
 * Safe to re-run — clears existing data first.
 */

import { config }  from 'dotenv'
import mongoose    from 'mongoose'
import { Author }  from './src/models/Author.js'
import { Book }    from './src/models/Book.js'

config()

const authorData = [
  { name: 'Robert C. Martin', bio: 'Software engineer known as "Uncle Bob". Advocate of clean code and agile practices.' },
  { name: 'J.K. Rowling',     bio: 'British author best known for the Harry Potter fantasy series.' },
  { name: 'Frank Herbert',    bio: 'American sci-fi author best known for the Dune series.' },
  { name: 'Andrew Hunt',      bio: 'Co-author of The Pragmatic Programmer and founder of the Pragmatic Bookshelf.' },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(' Connected to MongoDB')

    // Clear existing data
    await Author.deleteMany()
    await Book.deleteMany()
    console.log(' Cleared existing data')

    // Insert authors and map name → _id
    const authors    = await Author.insertMany(authorData)
    const authorMap  = Object.fromEntries(authors.map(a => [a.name, a._id]))
    console.log(`Inserted ${authors.length} authors`)

    const bookData = [
      { title: 'Clean Code',        isbn: '978-0132350884', genre: 'TECHNOLOGY', year: 2008, authorId: authorMap['Robert C. Martin'] },
      { title: 'The Clean Coder',   isbn: '978-0137081073', genre: 'TECHNOLOGY', year: 2011, authorId: authorMap['Robert C. Martin'] },
      { title: 'Clean Architecture',isbn: '978-0134494166', genre: 'TECHNOLOGY', year: 2017, authorId: authorMap['Robert C. Martin'] },
      { title: "Harry Potter and the Philosopher's Stone", isbn: '978-0747532743', genre: 'FICTION', year: 1997, authorId: authorMap['J.K. Rowling'] },
      { title: "Harry Potter and the Chamber of Secrets",  isbn: '978-0747538493', genre: 'FICTION', year: 1998, authorId: authorMap['J.K. Rowling'] },
      { title: 'Dune',              isbn: '978-0441013593', genre: 'FICTION',     year: 1965, authorId: authorMap['Frank Herbert']    },
      { title: 'Dune Messiah',      isbn: '978-0593098233', genre: 'FICTION',     year: 1969, authorId: authorMap['Frank Herbert']    },
      { title: 'The Pragmatic Programmer', isbn: '978-0201616224', genre: 'TECHNOLOGY', year: 1999, authorId: authorMap['Andrew Hunt'] },
    ]

    const books = await Book.insertMany(bookData)
    console.log(` Inserted ${books.length} books`)

    console.log('\n Seed complete!')
    console.log('   Run: npm run dev\n')
  } catch (err) {
    console.error(' Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()
