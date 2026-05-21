# Mini Project — Book Library API
This is your first complete GraphQL project. It brings together everything from 01 fundamentals  — schema design, queries, mutations, resolvers — into one working application with a backend API and a React frontend.

---

## What you're building

A **Book Library API** where users can:

- Browse all books
- View a book's details (title, author, genre, year)
- Add new books
- Update a book
- Delete a book
- Browse all authors
- See which books an author has written

**Backend:** Node.js + Express + Apollo Server (in-memory data)
**Frontend:** React + Apollo Client + Vite

---

## What this project covers from Week 1

| Concept | Where it appears |
|---|---|
| Schema & Types | `backend/schema.js` — Book, Author, Query, Mutation types |
| Queries | Fetch all books, fetch one book, fetch authors |
| Mutations | Add book, update book, delete book, add author |
| Resolvers | Field resolvers for `Book.author`, `Author.books` |
| Computed fields | `Author.bookCount` |
| Input types | `CreateBookInput`, `UpdateBookInput` |
| Enums | `Genre` type |
| Error handling | Book not found, duplicate ISBN |
| React + Apollo Client | `frontend/` — useQuery, useMutation hooks |
| Variables | All mutations use variables |
| Fragments | Book card fragment reused across queries |

---

## Folder structure

```
08-mini-project/
├── README.md                   ← you are here
├── backend/
│   ├── package.json
│   ├── server.js               ← Apollo Server + Express
│   ├── schema.js               ← all type definitions
│   ├── resolvers.js            ← all resolvers
│   └── data.js                 ← in-memory database
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx            ← React entry point + Apollo Client setup
        ├── App.jsx             ← main app with routing
        ├── graphql/
        │   └── operations.js   ← all queries and mutations
        └── components/
            ├── BookList.jsx    ← shows all books (useQuery)
            ├── BookDetail.jsx  ← single book view
            ├── AddBook.jsx     ← form to add a book (useMutation)
            └── AuthorList.jsx  ← shows all authors
```

---

## Running the project

### Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at `http://localhost:4000/graphql`

### Frontend

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## The GraphQL schema at a glance

```graphql
enum Genre { FICTION  NON_FICTION  SCIENCE  HISTORY  BIOGRAPHY  TECHNOLOGY }

type Author {
  id: ID!
  name: String!
  bio: String
  books: [Book!]!
  bookCount: Int!
}

type Book {
  id: ID!
  title: String!
  isbn: String!
  genre: Genre!
  year: Int!
  author: Author!
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
  addAuthor(name: String!, bio: String): Author!
}
```

---

## Apollo Sandbox queries to try

Once the backend is running, try these in `http://localhost:4000/graphql`:

```graphql
# Get all books with author names
query {
  books {
    id
    title
    genre
    year
    author { name }
  }
}

# Get one book
query {
  book(id: "1") {
    title
    isbn
    author { name bio }
  }
}

# Add a new book
mutation {
  addBook(input: {
    title: "Clean Code"
    isbn: "978-0132350884"
    genre: TECHNOLOGY
    year: 2008
    authorId: "1"
  }) {
    id
    title
    author { name }
  }
}
```
