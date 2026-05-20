# Mutations

> Mutations are how you change data — create, update, and delete. They follow the same syntax as queries but are used for write operations. This section covers everything you need to write real mutation resolvers.

---

## What is a mutation?

A mutation is a GraphQL operation that **modifies data**. While a query just reads, a mutation:

1. Makes a change (create/update/delete)
2. Optionally returns the modified data

Every mutation is declared in the `Mutation` root type in your schema.

---

## Basic mutation syntax

```graphql
mutation {
  createPost(title: "My First Post", content: "Hello world!") {
    id
    title
    createdAt
  }
}
```

The part inside `createPost(...)` are the input arguments. The block after `{...}` is what you want returned after the mutation completes.

---

## Mutations with input types

For mutations with many arguments, use an input type — it keeps things clean:

```graphql
# Schema definition
input CreatePostInput {
  title: String!
  content: String!
  status: PostStatus
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}
```

Query using the input type:

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    status
    createdAt
  }
}
```

Variables:

```json
{
  "input": {
    "title": "My First Post",
    "content": "This is the content...",
    "status": "DRAFT"
  }
}
```

---

## Create mutation

Creating a new resource and returning it:

```graphql
mutation AddUser {
  createUser(input: { name: "Zara", email: "zara@example.com", password: "secret" }) {
    id
    name
    email
    createdAt
  }
}
```

The resolver creates the user in the database and returns the newly created user object.

---

## Update mutation

Updating an existing resource — only send the fields you want to change:

```graphql
mutation EditPost($id: ID!, $input: UpdatePostInput!) {
  updatePost(id: $id, input: $input) {
    id
    title
    content
    updatedAt
  }
}
```

Variables — you only need to send the fields being changed:

```json
{
  "id": "42",
  "input": {
    "title": "Updated Title"
  }
}
```

---

## Delete mutation

Deleting a resource — typically returns a Boolean or the deleted item:

```graphql
# Returns Boolean
mutation RemovePost($id: ID!) {
  deletePost(id: $id)
}

# Returns the deleted item (useful to update the client cache)
mutation RemovePost($id: ID!) {
  deletePost(id: $id) {
    id
    title
  }
}
```

---

## Multiple mutations in one request

You can run multiple mutations in one request. They run **sequentially** (unlike queries which run in parallel):

```graphql
mutation CreateAndPublish {
  post: createPost(input: { title: "New Post", content: "..." }) {
    id
    title
  }

  welcome: createComment(input: { postId: "1", text: "First!" }) {
    id
    text
  }
}
```

This is important: mutations are **guaranteed to run in order**. The first finishes before the second starts.

---

## What to return from a mutation

A common question is: what should a mutation return?

| Operation | Best return value |
|---|---|
| Create | The created object (client gets the server-generated ID and timestamps) |
| Update | The updated object (client sees all the changed fields) |
| Delete | `Boolean!` (true = success) or the deleted object's ID |

Always return enough for the client to update its UI without a refetch.

---

## Error handling in mutations

If something goes wrong (validation failed, not found, permission denied), GraphQL returns errors:

```json
{
  "data": {
    "deletePost": null
  },
  "errors": [
    {
      "message": "Post not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["deletePost"]
    }
  ]
}
```

We'll cover proper error handling in depth on Day 14.

---

## Resolver implementation pattern

Here's the full pattern for mutation resolvers:

```javascript
const resolvers = {
  Mutation: {
    // CREATE
    createPost: (parent, args, context) => {
      // 1. Validate input (Day 14)
      // 2. Check permissions (Day 11)
      // 3. Create in database (Day 10)
      // 4. Return the created object
    },

    // UPDATE
    updatePost: (parent, args, context) => {
      // 1. Find the existing record
      // 2. Check it exists (throw error if not)
      // 3. Check permissions
      // 4. Apply the updates
      // 5. Return the updated object
    },

    // DELETE
    deletePost: (parent, args, context) => {
      // 1. Find the record
      // 2. Check it exists
      // 3. Check permissions
      // 4. Delete it
      // 5. Return true
    },
  },
}
```

---

## Running the examples

```bash
cd examples
npm install
npm run dev
```

Open `http://localhost:4000/graphql` and paste mutations from `mutations.graphql`.

---

## Files in this section

```
examples/
├── server.js         ← server with full CRUD mutations
├── mutations.graphql ← all example mutations to try in Sandbox
└── package.json
```

---

➡️ Next: [Resolvers](../07-resolvers/)
