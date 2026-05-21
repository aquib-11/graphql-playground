# REST vs GraphQL

This section does a real, honest comparison. Not "GraphQL always wins" — but a genuine look at what each approach does well, where each one struggles, and how to decide which to use.

---

## A concrete scenario

Let's use the same scenario throughout this comparison. You're building a blog app. A page needs to show:

- Post title and body
- The author's name and profile picture
- The 3 latest comments on the post, each with the commenter's name

This is a very typical real-world requirement. Let's see how REST and GraphQL each handle it.

---

## The REST approach

### Endpoints you'd build

```
GET /posts/:id          → returns post data
GET /users/:id          → returns user data
GET /posts/:id/comments → returns comments
```

### What the client does

```javascript
// Step 1 — fetch the post
const post = await fetch('/posts/42').then(r => r.json())

// Step 2 — fetch the author (using the authorId from the post)
const author = await fetch(`/users/${post.authorId}`).then(r => r.json())

// Step 3 — fetch the comments
const comments = await fetch('/posts/42/comments?limit=3').then(r => r.json())

// Step 4 — for each comment, fetch the commenter's name
const commenters = await Promise.all(
  comments.map(c => fetch(`/users/${c.userId}`).then(r => r.json()))
)
```

### What the responses look like

The `/posts/42` response might look like this:

```json
{
  "id": 42,
  "title": "Getting Started with GraphQL",
  "body": "GraphQL is a query language...",
  "authorId": 7,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "likesCount": 128,
  "viewsCount": 4200,
  "tags": ["graphql", "api", "tutorial"],
  "status": "published",
  "featuredImageUrl": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}
```

You only needed `title` and `body`. You got 12 fields. This is **overfetching**.

### Problems with this approach

**1. Multiple round trips (underfetching)**
You made 5+ network requests for one page load. Each one adds latency. On a slow mobile connection this adds up fast.

**2. Overfetching**
Every response includes fields you didn't need. You're downloading extra data and throwing it away.

**3. N+1 problem**
To get 3 commenters' names, you made 3 separate requests to `/users/:id`. With 10 comments, that's 10 requests. This is the **N+1 problem** — a classic REST pain point.

**4. Rigid response shape**
The server decides what data to include. If the mobile app needs less data than the web app, both get the same response.

---

## The GraphQL approach

### The single query

```graphql
query GetPostPage {
  post(id: "42") {
    title
    body
    author {
      name
      profilePicture
    }
    comments(limit: 3) {
      text
      author {
        name
      }
    }
  }
}
```

### What the response looks like

```json
{
  "data": {
    "post": {
      "title": "Getting Started with GraphQL",
      "body": "GraphQL is a query language...",
      "author": {
        "name": "Sarah",
        "profilePicture": "https://..."
      },
      "comments": [
        {
          "text": "Great article!",
          "author": { "name": "Ali" }
        },
        {
          "text": "Very helpful, thanks.",
          "author": { "name": "Priya" }
        },
        {
          "text": "Can you do a follow-up on mutations?",
          "author": { "name": "Chen" }
        }
      ]
    }
  }
}
```

**One request. Exactly the fields asked for. Nothing extra.**

---

## Side-by-side comparison

| | REST | GraphQL |
|---|---|---|
| Endpoints | Many (`/users`, `/posts`, `/comments`) | One (`/graphql`) |
| Requests for page above | 5+ | 1 |
| Overfetching | Common — server decides response shape | Eliminated — client decides |
| Underfetching | Common — often need multiple requests | Eliminated — nest queries |
| Schema / contract | Informal (OpenAPI optional) | Always enforced |
| Type system | Optional | Built-in, required |
| Self-documenting | Only with added tools (Swagger) | Built-in via introspection |
| HTTP caching | Easy — each URL is cacheable | Harder — single endpoint |
| File uploads | Native (multipart) | Awkward — needs extra setup |
| Learning curve | Low | Medium |
| Tooling | Mature and widespread | Growing fast, very good |
| Best for | Simple public APIs, file ops | Complex data, multiple clients |

---

## The N+1 problem explained

This is one of the most important concepts to understand when working with GraphQL (or any API).

Imagine you have 10 posts and each needs its author's name:

**REST version:**
```
GET /posts          → 10 posts, each with authorId
GET /users/1        → author of post 1
GET /users/2        → author of post 2
GET /users/3        → author of post 3
...10 more requests
```

That's **11 requests** (1 + N, where N = 10). This is the N+1 problem.

GraphQL doesn't automatically solve this — it just moves the problem to the resolver layer. That's why we use **DataLoader** later (Day 15) which batches all those user lookups into a single database query.

---

## When to use REST

REST is still the right choice in many situations:

- **Simple, public APIs** — straightforward CRUD, consumed by many unknown clients
- **File uploads / downloads** — REST handles these more naturally
- **Caching is critical** — REST URLs are individually cacheable at the CDN level
- **Team already knows REST** — switching has a cost, make sure there's a benefit
- **Webhooks and callbacks** — REST patterns are standard here

## When to use GraphQL

GraphQL earns its complexity when:

- **Multiple clients with different data needs** — mobile needs less than web
- **Rapid product iteration** — add fields without breaking existing clients
- **Complex, connected data** — users → posts → comments → likes → authors
- **Aggregating multiple data sources** — one GraphQL API can pull from multiple backends
- **Developer experience matters** — self-documenting, great tooling, type safety

---

## They can coexist

Many companies run both:

- REST for simple public endpoints, webhooks, file uploads
- GraphQL for the main application API

You don't have to choose one forever.

---

## Code examples

See the `examples/` folder for:

- `rest-approach.js` — how you'd build the blog scenario with REST
- `graphql-approach.js` — the same scenario in GraphQL

Next: [Server Setup](../03-server-setup/)
