# Authentication

> This section adds real JWT authentication to your GraphQL API. Users can register, log in, and access protected operations. The frontend has a complete auth flow — register, login, protected pages, logout.

---

## How GraphQL authentication works

```
1. User sends login mutation with email + password
2. Server verifies credentials
3. Server returns a JWT token
4. Client stores the token (memory / localStorage)
5. Client sends token in every request header:
       Authorization: Bearer <token>
6. Server decodes token on every request → attaches user to context
7. Protected resolvers check context.user — throw if not present
```

---

## The three pieces

### 1. JWT (JSON Web Token)
A signed string that encodes user data. It has three parts separated by dots:

```
header.payload.signature

eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyJ9.abc123
     ↑ algorithm            ↑ data         ↑ signature
```

The server signs it with a secret key. Anyone can decode the payload, but only the server can create a valid signature. So the server trusts it without hitting the database on every request.

### 2. Context
Apollo Server's context runs on every request. This is where we decode the token and attach the user:

```js
context: async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const user  = token ? verifyToken(token) : null
  return { user }
}
```

### 3. Auth guard
A simple helper that protects resolvers:

```js
function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' }
    })
  }
  return context.user
}
```

---

## Project structure

```
examples/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── src/
│   │   ├── models/
│   │   │   └── User.js          ← Mongoose user model with hashed password
│   │   ├── utils/
│   │   │   ├── jwt.js           ← sign and verify JWT tokens
│   │   │   └── auth.js          ← requireAuth guard
│   │   ├── schema/
│   │   │   └── typeDefs.js
│   │   └── resolvers/
│   │       └── index.js         ← register, login, me, protected mutations
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  ← global auth state
    │   ├── graphql/
    │   │   └── operations.js
    │   ├── components/
    │   │   ├── LoginForm.jsx
    │   │   ├── RegisterForm.jsx
    │   │   ├── Dashboard.jsx    ← protected page
    │   │   └── Navbar.jsx
    │   ├── main.jsx             ← Apollo Client with auth headers
    │   └── App.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Running the project

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   # add MONGODB_URI and JWT_SECRET
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

---

## Security notes

- Passwords are **never stored plain** — always hashed with bcrypt
- JWT secret must be long and random — use `openssl rand -base64 64`
- Tokens expire after 7 days (configurable)
- Never log or return passwords from resolvers

---

➡️ Next: [Pagination](../03-pagination/)
