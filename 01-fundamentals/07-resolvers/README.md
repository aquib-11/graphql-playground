# Resolvers

Resolvers are the heart of every GraphQL API. Every piece of data you get back — every field, every nested object — was returned by a resolver function. This section gives you complete mastery of how they work.

---

## What is a resolver?

A resolver is a plain JavaScript function that returns the value for one field in your schema.

When a client sends a query, GraphQL looks at every field in that query and calls the matching resolver for each one. The results are assembled into a response that mirrors the query shape.

```graphql
# Client sends this query
query {
  user(id: "1") {
    name
    email
  }
}
```

GraphQL calls:
1. `Query.user` resolver → returns the user object
2. `User.name` resolver → returns the name string
3. `User.email` resolver → returns the email string

---

## The four resolver arguments

Every resolver function receives exactly four arguments:

```javascript
fieldName: (parent, args, context, info) => { ... }
```

| Argument | What it is | When you use it |
|---|---|---|
| `parent` | The result returned by the parent resolver | Nested field resolvers |
| `args` | Arguments passed in the query e.g. `user(id: "1")` | Filtering, finding by ID |
| `context` | Shared object across all resolvers in one request | Auth user, DB connection |
| `info` | Technical details about the query (AST, field name) | Rarely needed |

---

## parent — the most important one to understand

`parent` is what makes nested queries work. Let's trace through an example:

```graphql
query {
  post(id: "1") {   # Step 1 — Query.post resolver runs
    title            # Step 2 — Post.title resolver runs, parent = the post object
    author {         # Step 3 — Post.author resolver runs, parent = the post object
      name           # Step 4 — User.name resolver runs, parent = the author/user object
    }
  }
}
```

```javascript
const resolvers = {
  Query: {
    // Step 1 — parent is null here (no parent for root queries)
    post: (parent, args) => {
      return posts.find(p => p.id === args.id)
      // returns: { id: '1', title: 'Hello', authorId: '7', ... }
    },
  },

  Post: {
    // Step 3 — parent is the post object returned in Step 1
    author: (parent) => {
      // parent = { id: '1', title: 'Hello', authorId: '7', ... }
      return users.find(u => u.id === parent.authorId)
      //                              ↑ we use parent to find the related user
    },
  },

  User: {
    // Step 4 — parent is the user object returned in Step 3
    name: (parent) => {
      // parent = { id: '7', name: 'Sarah', ... }
      return parent.name  // default resolver — GraphQL does this automatically
    },
  },
}
```

---

## Default resolvers

You don't have to write a resolver for every single field. GraphQL has a built-in default resolver that runs when no resolver is defined:

```javascript
// Default resolver — GraphQL does this automatically
(parent, args, context, info) => parent[info.fieldName]
```

It just reads the field from the parent object. So if your database returns `{ id: '1', name: 'Sarah', email: 'sarah@example.com' }`, you don't need to write resolvers for `id`, `name`, or `email` — GraphQL reads them directly.

You only need to write a resolver when:
- The field requires computation (e.g. `fullName: () => parent.firstName + ' ' + parent.lastName`)
- The field requires a database lookup (e.g. `author: () => User.findById(parent.authorId)`)
- The field requires transformation (e.g. `createdAt: () => new Date(parent.createdAt).toLocaleDateString()`)

---

## args — handling query arguments

```javascript
const resolvers = {
  Query: {
    // user(id: "1") → args = { id: "1" }
    user: (parent, args) => {
      return users.find(u => u.id === args.id)
    },

    // posts(limit: 5, status: "PUBLISHED") → args = { limit: 5, status: "PUBLISHED" }
    posts: (parent, args) => {
      let result = [...posts]
      if (args.status) result = result.filter(p => p.status === args.status)
      if (args.limit)  result = result.slice(0, args.limit)
      return result
    },
  },
}
```

---

## context — sharing data across all resolvers

Context is an object created once per request and passed to every resolver. It's the right place to put:

- The authenticated user (decoded from JWT token)
- Database connections or models
- DataLoaders 
- Any other request-scoped data

```javascript
// Setting up context in Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    // This runs on every request
    // Decode the auth token and attach the user
    const token = req.headers.authorization?.replace('Bearer ', '')
    const currentUser = token ? decodeToken(token) : null

    return {
      currentUser,      // available as context.currentUser in every resolver
      db,               // database connection
    }
  },
}))

// Using context in a resolver
const resolvers = {
  Query: {
    me: (parent, args, context) => {
      // context.currentUser was set in the context function above
      if (!context.currentUser) throw new Error('Not authenticated')
      return context.currentUser
    },
  },

  Mutation: {
    createPost: (parent, args, context) => {
      if (!context.currentUser) throw new Error('Not authenticated')
      // Use the current user's ID without passing it in the query
      return createPost({ ...args.input, authorId: context.currentUser.id })
    },
  },
}
```

---

## Mutation resolvers

Mutation resolvers follow a consistent pattern:

```javascript
const resolvers = {
  Mutation: {
    createPost: (parent, args, context) => {
      // 1. Check authentication
      if (!context.currentUser) throw new Error('Not authenticated')

      // 2. Validate input
      if (!args.input.title) throw new Error('Title is required')

      // 3. Perform the operation
      const newPost = {
        id: String(Date.now()),
        ...args.input,
        authorId: context.currentUser.id,
        createdAt: new Date().toISOString(),
      }

      posts.push(newPost)

      // 4. Return the result
      return newPost
    },
  },
}
```

---

## Resolver execution order

Queries run resolvers in parallel where possible. Mutations run them sequentially.

```
query {              mutation {
  users { ... }        createUser { ... }    ← runs first, then
  posts { ... }        createPost { ... }    ← runs second
}                    }
↑ parallel           ↑ sequential (guaranteed order)
```

---

## The resolver map must mirror the schema

Your resolver object keys must exactly match your type names and field names:

```graphql
# Schema
type Query {
  user(id: ID!): User   ← must have resolvers.Query.user
}

type User {
  posts: [Post!]!       ← must have resolvers.User.posts (if not default)
}
```

```javascript
// Resolvers — keys must match schema exactly
const resolvers = {
  Query: {          // ← matches "type Query"
    user: () => {}, // ← matches "user" field on Query
  },
  User: {           // ← matches "type User"
    posts: () => {},// ← matches "posts" field on User
  },
}
```

---

## Files in this section

```
examples/
├── server.js       ← server demonstrating all resolver patterns
├── package.json
└── .env.example
```

---

Next: [Mini Project — Book Library API](../08-mini-project/)
