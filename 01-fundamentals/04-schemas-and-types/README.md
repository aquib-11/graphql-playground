# Schemas & Types

> The schema is the most important part of any GraphQL API. Everything — queries, mutations, resolvers — flows from it. This section gives you complete mastery of GraphQL's type system.

---

## What is a schema?

A schema is the **contract** between your server and your clients. It answers:

- What data exists?
- What are the shapes of that data?
- What operations can clients perform?

Once defined, GraphQL enforces this contract on every request. If a client asks for a field that doesn't exist in the schema, they get an error — immediately, before any code runs.

Schemas are written in **SDL** — Schema Definition Language. It's a simple, readable syntax that any language can understand.

---

## Scalar types — the primitives

Scalar types are the leaf values — they don't have sub-fields. GraphQL has 5 built-in scalars:

| Type | JavaScript equivalent | Example value |
|---|---|---|
| `String` | string | `"Hello"` |
| `Int` | integer (32-bit) | `42` |
| `Float` | floating point number | `3.14` |
| `Boolean` | boolean | `true` or `false` |
| `ID` | string (used as unique identifier) | `"user_abc123"` |

```graphql
type User {
  id: ID!          # Unique identifier — always use ID, not String, for IDs
  name: String!    # Plain text
  age: Int         # Whole number (nullable — user may not have provided age)
  score: Float     # Decimal number
  isActive: Boolean!
}
```

---

## The `!` modifier — non-null

By default, every field in GraphQL is **nullable** — it can return `null`.

Add `!` to make it **non-null** — the server guarantees it will never be null:

```graphql
type Post {
  id: ID!          # Will ALWAYS have a value — server guarantees it
  title: String!   # Will ALWAYS have a value
  subtitle: String # CAN be null — subtitle is optional
}
```

**Rule of thumb:** use `!` for fields that always exist (IDs, required data). Leave it off for optional or nullable fields.

---

## Lists

Use `[]` to declare an array:

```graphql
type Author {
  posts: [Post]    # Array of Posts — array itself can be null, posts inside can be null
}
```

Combined with `!`:

  ```graphql
  [Post]     # Nullable array, nullable items  (rarely used)  ie
  [Post!]    # Nullable array, non-null items
  [Post]!    # Non-null array, nullable items
  [Post!]!   # Non-null array, non-null items  ← most common
  ```

In practice, you'll use `[Post!]!` almost always — a non-null array of non-null posts.

---

## Object types

Object types are the core building blocks. They group related fields together:

```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  createdAt: String!
  author: User!       # Object types can reference other object types
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}
```

---

## The root types — Query, Mutation, Subscription

These three are special. They're the entry points into your schema:

```graphql
# All read operations
type Query {
  post(id: ID!): Post
  posts: [Post!]!
  user(id: ID!): User
}

# All write operations (create, update, delete)
type Mutation {
  createPost(title: String!, content: String!): Post!
  deletePost(id: ID!): Boolean!
}

# All real-time operations (Day 16)
type Subscription {
  postCreated: Post!
}
```

Every field on `Query` and `Mutation` is an operation a client can call.

---

## Input types

When you need to pass complex data to a mutation (like creating a post with 5 fields), you use an **input type** instead of listing all arguments separately:

```graphql
# Without input type — gets messy with many fields
type Mutation {
  createPost(title: String!, content: String!, authorId: ID!, published: Boolean!): Post!
}

# With input type — clean and reusable
input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
  published: Boolean!
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
}
```

Input types look like object types but use the `input` keyword. They can only contain scalar types or other input types — not regular object types.

---

## Enum types

Enums restrict a field to a fixed set of values:

```graphql
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type Post {
  id: ID!
  title: String!
  status: PostStatus!  # Can only be DRAFT, PUBLISHED, or ARCHIVED
}
```

If a client sends any value not in the enum, GraphQL rejects it before reaching your resolver.

---

## Interface types

Interfaces define a set of fields that multiple types must implement:

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!       # required because of the interface
  name: String!
}

type Post implements Node {
  id: ID!       # required because of the interface
  title: String!
}
```

---

## Union types

Unions let a field return one of several different types:

```graphql
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}
```

---

## Custom scalar types

You can define your own scalar types for values like dates:

```graphql
scalar Date
scalar JSON

type Post {
  id: ID!
  title: String!
  publishedAt: Date
  metadata: JSON
}
```

Custom scalars need a resolver implementation (we'll cover this in the examples).

---


# Directives

> Directives are special instructions in GraphQL that modify how a query executes. They allow clients to conditionally include fields, skip fields, or add custom behavior to schema definitions and operations.

---

## What are directives?

Directives are prefixed with `@` and can appear inside queries or schemas.

They act like instructions for GraphQL.

Examples:

```graphql
@include
@skip
@deprecated
```

Some directives are built into GraphQL, while others can be custom-defined.

---

## Why directives exist

Directives make queries more dynamic and flexible.

They are commonly used for:

- Conditionally fetching fields
- Skipping unnecessary data
- Marking fields as deprecated
- Adding metadata or validation
- Building advanced GraphQL tooling

---

## Built-in query directives

GraphQL includes two important query directives by default:

| Directive | Purpose |
|---|---|
| `@include` | Include a field only if a condition is true |
| `@skip` | Skip a field if a condition is true |

---

## `@include`

`@include` fetches a field only when the condition is `true`.

```graphql
query GetUser($showEmail: Boolean!) {
  user(id: "1") {
    name
    email @include(if: $showEmail)
  }
}
```

Variables:

```json
{
  "showEmail": true
}
```

If `showEmail` is `false`, the `email` field is omitted from the response.

---

## `@skip`

`@skip` does the opposite.

It skips a field when the condition is `true`.

```graphql
query GetUser($hideEmail: Boolean!) {
  user(id: "1") {
    name
    email @skip(if: $hideEmail)
  }
}
```

Variables:

```json
{
  "hideEmail": true
}
```

When `hideEmail` is `true`, the `email` field is not returned.

---

## Directives are conditional logic

Directives are similar to runtime conditions in JavaScript:

```js
if (showEmail) {
  return email;
}
```

But the condition happens inside the GraphQL query itself.

---

## Schema directives

Directives can also be used inside schemas.

Example:

```graphql
type User {
  id: ID!
  
  oldField: String @deprecated(reason: "Use newField instead")

  newField: String!
}
```

---

## `@deprecated`

The `@deprecated` directive marks fields or enum values as outdated.

```graphql
type User {
  username: String @deprecated(reason: "Use handle instead")
  handle: String!
}
```

GraphQL tools like Apollo Sandbox will show warnings for deprecated fields.

---

## Custom directives

GraphQL also allows custom directives.

Example:

```graphql
directive @auth(role: String) on FIELD_DEFINITION
```

Custom directives are commonly used for:

- Authentication
- Authorization
- Validation
- Logging
- Rate limiting

We'll explore custom directives later in the advanced section.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Confusing directives with resolvers | Directives modify behavior — resolvers fetch data |
| Using directives everywhere | Use them only when conditional behavior is needed |
| Forgetting the `if:` argument | `@include` and `@skip` require `if:` |

---

## Summary

Directives are special instructions that modify GraphQL query or schema behavior.

Common built-in directives:

- `@include`
- `@skip`
- `@deprecated`

They make GraphQL APIs more dynamic, expressive, and self-documenting.

```

## Descriptions / Documentation

GraphQL supports inline documentation using triple quotes or `"`:

```graphql
"""
Represents a blog post written by a user.
Posts can be in DRAFT, PUBLISHED, or ARCHIVED status.
"""
type Post {
  id: ID!

  "The post title — shown in listings and at the top of the post page"
  title: String!

  "Full markdown content of the post"
  content: String!

  status: PostStatus!
}
```

This documentation appears in Apollo Sandbox automatically — hover over any field and see its description. This is GraphQL's self-documentation in action.

---

## A complete real-world schema

See `examples/schema.graphql` for a full blog application schema combining everything above.

---

## Common mistakes

| Mistake | Fix |
|---|---|
| Using `String` for IDs | Use `ID!` — it semantically signals "this is a unique identifier" |
| Making everything non-null (`!`) | Only use `!` when the value truly always exists |
| Using Object types as input args | Use `input` types for mutation arguments |
| Forgetting `!` on list items | `[Post!]!` is almost always what you want |

---

➡️ Next: [Queries](../05-queries/)
