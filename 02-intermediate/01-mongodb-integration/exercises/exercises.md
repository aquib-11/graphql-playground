# Exercises — MongoDB Integration

Complete these after going through the examples.
Each exercise builds on the previous one.

---

## Exercise 1 — Add a new field to Book

**Goal:** Add a `description` field to books.

**Steps:**
1. Add `description: String` to the Mongoose `BookSchema` in `Book.js`
2. Add `description: String` to the `Book` type in `typeDefs.js`
3. Add `description` to `CreateBookInput` and `UpdateBookInput`
4. Test by creating a book with a description in Apollo Sandbox

**Expected result:**
```graphql
mutation {
  addBook(input: {
    title: "Test Book"
    isbn: "000-0000000000"
    genre: TECHNOLOGY
    year: 2024
    authorId: "<any valid author id>"
    description: "A great book about testing"
  }) {
    id
    title
    description
  }
}
```

---

## Exercise 2 — Add sorting to the books query

**Goal:** Let the client sort books by `year` or `title`.

**Steps:**
1. Add a `sortBy` enum to `typeDefs.js`:
   ```graphql
   enum SortBy { YEAR_ASC  YEAR_DESC  TITLE_ASC  TITLE_DESC }
   ```
2. Add `sortBy: SortBy` argument to the `books` query
3. Update the `books` resolver to apply the sort:
   ```js
   const sortMap = {
     YEAR_ASC:   { year: 1 },
     YEAR_DESC:  { year: -1 },
     TITLE_ASC:  { title: 1 },
     TITLE_DESC: { title: -1 },
   }
   const sort = sortMap[args.sortBy] || { createdAt: -1 }
   return await Book.find(filter).sort(sort)
   ```
4. Test in Apollo Sandbox:
   ```graphql
   query { books(sortBy: YEAR_ASC) { title year } }
   ```

---

## Exercise 3 — Add a search query

**Goal:** Add a `searchBooks(query: String!)` query that searches by title.

**Steps:**
1. Add to `typeDefs.js`:
   ```graphql
   type Query {
     searchBooks(query: String!): [Book!]!
   }
   ```
2. Add resolver using MongoDB regex search:
   ```js
   searchBooks: async (_, args) => {
     return await Book.find({
       title: { $regex: args.query, $options: 'i' }  // case-insensitive
     })
   }
   ```
3. Test:
   ```graphql
   query { searchBooks(query: "clean") { title author { name } } }
   ```

---

## Exercise 4 — Add book count to the stats query

**Goal:** Add a `stats` query that returns total counts.

**Steps:**
1. Add a `Stats` type and query:
   ```graphql
   type Stats {
     totalBooks: Int!
     totalAuthors: Int!
     booksByGenre: [GenreCount!]!
   }
   type GenreCount {
     genre: String!
     count: Int!
   }
   type Query {
     stats: Stats!
   }
   ```
2. Write the resolver using `countDocuments` and MongoDB aggregation:
   ```js
   stats: async () => {
     const totalBooks   = await Book.countDocuments()
     const totalAuthors = await Author.countDocuments()
     const genreAgg     = await Book.aggregate([
       { $group: { _id: '$genre', count: { $sum: 1 } } }
     ])
     return {
       totalBooks,
       totalAuthors,
       booksByGenre: genreAgg.map(g => ({ genre: g._id, count: g.count })),
     }
   }
   ```
3. Test:
   ```graphql
   query {
     stats {
       totalBooks
       totalAuthors
       booksByGenre { genre count }
     }
   }
   ```

---

## Exercise 5 — Validate year on update

**Goal:** Throw a user-friendly error if someone tries to update a book's year to a future year.

**Steps:**
1. In the `updateBook` resolver, after getting `input`, add:
   ```js
   if (input.year && input.year > new Date().getFullYear()) {
     throw new GraphQLError(`Year cannot be in the future`, {
       extensions: { code: 'BAD_USER_INPUT' }
     })
   }
   ```
2. Test with a future year — you should get a clean error message.

---

## Bonus — Connect the React frontend

Take the Book Library frontend from `08-mini-project/frontend` and point it at this MongoDB-backed server instead of the in-memory one.

Since the GraphQL API is identical, **no frontend changes are needed** — just make sure this server is running on port 4000 before starting the frontend.

This proves the point: swapping the data layer doesn't break the API.
