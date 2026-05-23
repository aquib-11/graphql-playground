# Notes — MongoDB Integration

## Key concepts

- **MongoDB** stores data as documents (JSON-like) in collections
- **Mongoose** is the Node.js library to interact with MongoDB
- **Model** = a Mongoose class that maps to a MongoDB collection
- **Schema** = defines shape, types, and validation of a document
- Every Mongoose operation is **async** — always `await`

## Method reference

| What you want | Mongoose method |
|---|---|
| Get all | `Model.find()` |
| Get all with filter | `Model.find({ field: value })` |
| Get one by ID | `Model.findById(id)` |
| Get one by field | `Model.findOne({ field: value })` |
| Create | `Model.create({ ...data })` |
| Update by ID | `Model.findByIdAndUpdate(id, { $set: input }, { new: true })` |
| Delete by ID | `Model.findByIdAndDelete(id)` |
| Count | `Model.countDocuments({ field: value })` |
| Delete many | `Model.deleteMany({ field: value })` |
| Insert many | `Model.insertMany([...])` |

## Important options

```js
// { new: true } → return the UPDATED document (default returns the original)
Model.findByIdAndUpdate(id, update, { new: true })

// { runValidators: true } → run schema validators on update
Model.findByIdAndUpdate(id, update, { new: true, runValidators: true })

// Sort results
Model.find().sort({ createdAt: -1 })  // newest first
Model.find().sort({ name: 1 })        // A → Z
```

## The _id → id mapping

```js
// In schema options — always include this
{
  toJSON:   { virtuals: true },
  toObject: { virtuals: true },
}
// Now both doc._id and doc.id work
```

## Duplicate key error

```js
try {
  await Model.create(data)
} catch (err) {
  if (err.code === 11000) {
    // unique field already exists
  }
}
```

## Common mistakes

- Forgetting `await` → resolver returns a Promise object, not data
- Using `id` instead of `_id` in Mongoose queries (`findById` accepts both, `find({ _id })` needs ObjectId)
- Not calling `connectDB()` before `server.start()`
- Not seeding the DB before running the server
- Committing `.env` to Git — always add to `.gitignore`
