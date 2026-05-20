# What is GraphQL?

> Before writing a single line of code, you need to understand *what* GraphQL is, *why* it was created, and *how* it thinks about data. This section covers all of that.

---

## The short answer

GraphQL is a **query language for your API** and a **runtime for executing those queries**.

It was created by Facebook in 2012, used internally for years, then open-sourced in 2015. Today it powers APIs at GitHub, Shopify, Twitter, Netflix, Airbnb, and thousands of other companies.

The name comes from "Graph Query Language" — because it thinks of your data as a graph of connected objects, not a collection of separate endpoints.

---

## The problem GraphQL solves

Imagine you're building a mobile app that shows a user's profile page. You need:

- The user's name and avatar
- Their 3 most recent posts
- The number of followers they have

With a traditional REST API, you might have to make **3 separate requests**:

```
GET /users/123
GET /users/123/posts?limit=3
GET /users/123/followers/count
```

Each request hits the network. Each one takes time. And you probably get back a lot of data you don't actually need.

GraphQL solves this by letting you **describe exactly the data you need in a single request**:

```graphql
query {
  user(id: "123") {
    name
    avatar
    recentPosts(limit: 3) {
      title
      createdAt
    }
    followersCount
  }
}
```

One request. Exactly the fields you asked for. Nothing more, nothing less.

---

## Core concepts

### 1. Schema — the contract

Every GraphQL API has a **schema**. The schema defines:

- What types of data exist (User, Post, Comment, etc.)
- What fields each type has
- What operations are available (what you can query or change)

The schema is the single source of truth. Both the client and the server agree on it. It's written in a language called **SDL** (Schema Definition Language):

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  author: User!
}
```

### 2. Operations — three types

GraphQL has exactly three types of operations:

| Operation | What it does | REST equivalent |
|---|---|---|
| `query` | Read data | GET |
| `mutation` | Write / change data | POST, PUT, PATCH, DELETE |
| `subscription` | Listen for real-time updates | WebSocket |

### 3. Single endpoint

REST APIs have many endpoints (`/users`, `/posts`, `/comments`).

GraphQL APIs have **one endpoint** — usually `/graphql`. Everything goes through it. The *query itself* describes what you want, not the URL.

### 4. Strongly typed

Every field in a GraphQL schema has a type. The server validates every incoming query against the schema before running it. If your query asks for a field that doesn't exist, you get an error immediately — not a mysterious `undefined`.

### 5. Introspection

GraphQL APIs are **self-documenting**. You can ask a GraphQL API what types and operations it supports, and it will tell you. This is how tools like Apollo Sandbox build their autocomplete — they query the schema itself.

---

## How a GraphQL request works

```
Client writes a query
        ↓
Query sent to /graphql endpoint via HTTP POST
        ↓
Server parses and validates the query against the schema
        ↓
Server runs resolver functions to fetch the data
        ↓
Data is assembled and returned as JSON
        ↓
Client receives exactly the shape it asked for
```

---

## What GraphQL is NOT

- **Not a database** — it doesn't store data. It sits between your client and your data sources
- **Not tied to any language** — implementations exist in JS, Python, Go, Ruby, Java, and more
- **Not always better than REST** — it solves specific problems. REST is still right for many cases
- **Not a graph database** — despite the name, you can use MongoDB, PostgreSQL, or anything behind it

---

## A real-world query

Here's what a GraphQL query looks like for a blog application:

```graphql
query GetBlogPost {
  post(id: "abc123") {
    title
    content
    publishedAt
    author {
      name
      bio
    }
    comments {
      text
      author {
        name
      }
    }
  }
}
```

The response comes back as JSON in exactly this shape — mirroring the query perfectly. This predictability is one of GraphQL's most loved features.

---

## Summary

| Concept | Description |
|---|---|
| Schema | The contract — defines all types and operations |
| Query | Read operation |
| Mutation | Write operation — create, update, delete |
| Subscription | Real-time — listen for changes |
| Resolver | Function that fetches the actual data |
| Single endpoint | All requests go to `/graphql` |
| Strongly typed | Every field has a declared type |

---

➡️ Next: [REST vs GraphQL](../02-rest-vs-graphql/)
