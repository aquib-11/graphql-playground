# GraphQL Server Setup

> This is where the code starts. We'll build a real, running GraphQL server from scratch using Node.js, Express, and Apollo Server. By the end you'll have Apollo Sandbox running in your browser and your first query working.

---

## What we're building

A minimal but complete GraphQL server that:

- Runs on Node.js with Express
- Uses Apollo Server v5 as the GraphQL layer
- Exposes Apollo Sandbox at `http://localhost:4000`
- Responds to your first real GraphQL query

---

## Understanding the pieces

Before we install anything, here's what each package does:

```
express          → HTTP server framework. Handles incoming requests.
@apollo/server   → The GraphQL engine. Parses queries, runs resolvers.
@as-integrations/express5   → Apollo Server v5 integration for Express 5
graphql          → The core GraphQL library. Apollo Server needs it.
body-parser      → Parses the JSON body of incoming GraphQL requests.
cors             → Lets browsers on other ports talk to your API.
dotenv           → Loads .env variables (port, secrets) into process.env.
nodemon          → Watches your files and restarts the server on change.
```

---

## Step 1 — Project setup

Create the folder and initialise npm:

```bash
mkdir graphql-server-setup
cd graphql-server-setup
npm init -y
```

---

## Step 2 — Install dependencies

```bash
# Production dependencies
npm install @apollo/server @as-integrations/express5 express graphql body-parser cors dotenv

# Development dependency — restarts server on file change
npm install --save-dev nodemon
```

---

## Step 3 — Configure package.json

Open `package.json` and make these two changes:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

`"type": "module"` enables ES module syntax (`import`/`export`) instead of `require()`.

---

## Step 4 — Create .env

```bash
PORT=4000
```

Never hardcode port numbers or secrets in your code. Always use `.env`.

---

## Step 5 — Build the server

See `examples/server.js` — every line is commented to explain what it does.

---

## Step 6 — Run it

```bash
npm run dev
```

You should see:

```
 GraphQL server ready at http://localhost:4000/graphql
```

Open that URL in your browser. You'll see **Apollo Sandbox** — a full GraphQL IDE built into your server.

---

## Step 7 — Run your first query

In Apollo Sandbox, paste this and click the Run button:

```graphql
query {
  hello
}
```

Response:

```json
{
  "data": {
    "hello": "Hello from GraphQL! "
  }
}
```

**You just ran your first GraphQL query.**

---

## How Apollo Server fits into Express

```
HTTP Request (POST /graphql)
        ↓
Express receives it
        ↓
expressMiddleware(server) intercepts the request
        ↓
Apollo Server parses the GraphQL query
        ↓
Apollo validates the query against your typeDefs (schema)
        ↓
Apollo calls the matching resolver function
        ↓
Resolver returns data
        ↓
Apollo formats it as { data: { ... } }
        ↓
Express sends the response back
```

---

## The three parts of every GraphQL server

Every GraphQL server — no matter how big — has exactly these three parts:

### 1. Type Definitions (the schema)

```graphql
type Query {
  hello: String
}
```

This declares what operations exist and what they return. `Query` is the root type — every query starts here.

### 2. Resolvers

```javascript
const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
  },
}
```

Resolvers are plain JavaScript functions. Each one returns the data for its field. The structure mirrors the schema exactly.

### 3. The server

```javascript
const server = new ApolloServer({ typeDefs, resolvers })
```

Apollo Server takes your schema and resolvers, validates them together, and starts handling requests.

---

## Files in this section

```
examples/
├── server.js       ← the complete, commented server
├── package.json    ← dependencies and scripts
└── .env.example    ← environment variable template
```

---

## Common errors at this stage

| Error | Cause | Fix |
|---|---|---|
| `Cannot use import statement` | `"type": "module"` missing | Add it to package.json |
| `Cannot find module '@apollo/server'` | Packages not installed | Run `npm install` |
| `Port 4000 already in use` | Something else is using it | Change PORT in .env |
| `Must provide typeDefs` | Schema is undefined | Check your typeDefs import |


## update 

Apollo Server v5 uses external Express integration packages.
Older tutorials using `@apollo/server/express4` may not work.

---

 Next: [Schemas & Types](../04-schemas-and-types/)
