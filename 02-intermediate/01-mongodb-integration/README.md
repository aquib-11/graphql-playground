# MongoDB Integration

So far all data lived in plain JavaScript arrays — it reset every time the server restarted. This section connects a real MongoDB database using Mongoose. Your GraphQL schema stays identical. Only the resolver internals change.

---

## What changes when you add MongoDB

```
Before (01 fundamentals — in-memory):
  resolver → plain array → return data

After (this section — MongoDB):
  resolver → Mongoose Model → MongoDB → return data
```

The schema, queries, and mutations stay exactly the same.
Only how resolvers fetch data changes — `array.find()` becomes `await Model.findById()`.

---

## Core concepts

### MongoDB
A NoSQL database that stores data as **documents** (JSON-like objects) inside **collections**.

```
SQL world          MongoDB world
─────────────      ─────────────
database       →   database
table          →   collection
row            →   document
column         →   field
```

### Mongoose
An **ODM** (Object Document Mapper) — the Node.js library you use to talk to MongoDB.
It gives you models, schemas, validation, and clean methods like `find`, `findById`, `create`.

```
Your Code → Mongoose → MongoDB
```

---

## How Mongoose models map to GraphQL types

```js
// Mongoose model — describes a document in the DB
const BookSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  genre:    { type: String, required: true },
  year:     { type: Number, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
})
```

```graphql
# GraphQL type — describes the API shape
type Book {
  id: ID!
  title: String!
  genre: Genre!
  year: Int!
  author: Author!   # resolved from authorId
}
```

The two live in separate layers. GraphQL describes what the API exposes. Mongoose describes what the database stores.

---

## The _id → id difference

MongoDB auto-generates an `_id` field for every document. GraphQL expects `id`.

Mongoose handles this with the `toObject: { virtuals: true }` option — it creates a virtual `id` field that mirrors `_id` as a string. So `book._id` and `book.id` both work.

---

## How resolvers change — side by side

| Operation | In-memory (01 fundamentals) | MongoDB (this section) |
|---|---|---|
| Find all | `books` | `await Book.find()` |
| Find one | `books.find(b => b.id === id)` | `await Book.findById(id)` |
| Filter | `books.filter(b => b.genre === genre)` | `await Book.find({ genre })` |
| Create | `books.push(newBook)` | `await Book.create(input)` |
| Update | `books[index] = { ...books[index], ...input }` | `await Book.findByIdAndUpdate(id, { $set: input }, { new: true })` |
| Delete | `books.splice(index, 1)` | `await Book.findByIdAndDelete(id)` |
| Count | `books.filter(...).length` | `await Book.countDocuments({ authorId: id })` |

All Mongoose operations are **async** — always use `await`.

---

## Project structure

```
examples/
├── config/
│   └── db.js                  ← MongoDB connection helper
├── src/
│   ├── models/
│   │   ├── Author.js          ← Mongoose Author schema + model
│   │   └── Book.js            ← Mongoose Book schema + model
│   ├── schema/
│   │   └── typeDefs.js        ← GraphQL type definitions (unchanged from Week 1)
│   └── resolvers/
│       └── index.js           ← All resolvers using Mongoose
├── server.js                  ← Entry point
├── seed.js                    ← Populate DB with initial data
├── package.json
└── .env.example
```

---

## Setup

### Get a MongoDB URI

**Option A — MongoDB Atlas (free, no install)**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → create free account
2. Create a free M0 cluster
3. Click Connect → Drivers → copy the URI
4. Looks like: `mongodb+srv://user:pass@cluster.mongodb.net/booklib`

**Option B — Local MongoDB**
1. Install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run: `mongod`
3. URI: `mongodb://localhost:27017/booklib`

### Run the example

```bash
cd examples
npm install
cp .env.example .env
# paste your MONGODB_URI into .env
npm run seed        # populate DB once
npm run dev         # start the server
```

Open `http://localhost:4000/graphql` — all queries and mutations now read/write real MongoDB data.

---

## Common Mongoose errors

| Error | Cause | Fix |
|---|---|---|
| `MongoServerError: E11000 duplicate key` | Unique field already exists | Catch `err.code === 11000` in resolver |
| `CastError: Cast to ObjectId failed` | Invalid ID format passed | Validate ID before querying |
| `ValidationError` | Mongoose schema validation failed | Check required fields and types |
| `MongooseServerSelectionError` | Can't reach MongoDB | Check URI and network |

---

## Exercises

See `exercises/exercises.md` for hands-on challenges.

---

➡️ Next: [Authentication](../02-authentication/)
