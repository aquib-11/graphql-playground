# Notes — Authentication

## The full auth flow

```
REGISTER:
  client  →  register(name, email, password)
  server  →  hash password (bcrypt) → save User → signToken(user._id)
  server  →  return { token, user }
  client  →  store token in localStorage → redirect to dashboard

LOGIN:
  client  →  login(email, password)
  server  →  findOne({ email }) → comparePassword(plain, hash)
  server  →  signToken(user._id) → return { token, user }
  client  →  store token → redirect

EVERY PROTECTED REQUEST:
  client  →  authLink adds header: Authorization: Bearer <token>
  server  →  buildContext(req) extracts token → verifyToken() → User.findById()
  server  →  context.user = the User document (or null)
  resolver → requireAuth(context) → throws or returns user
```

## Middleware layer

```
server.js
  └── context: ({ req }) => buildContext(req)
        └── auth.middleware.js
              ├── extract Bearer token from header
              ├── verifyToken() → decoded.id
              └── User.findById(decoded.id) → attach to context

resolvers
  └── requireAuth(context)          → any logged-in user
  └── requireRole('ADMIN', context) → admin only
  └── requireOwnerOrAdmin(ownerId, context) → owner or admin
```

## JWT

```
Payload: { id: "userId", iat: issued-at, exp: expiry }
Secret:  long random string from .env
Expiry:  7d (configurable via JWT_EXPIRES_IN)

NEVER put: email, password, role in payload
           (role can change — always fetch fresh from DB)
```

## password select: false

```js
// In schema:
password: { type: String, select: false }

// Normal query — no password returned:
await User.findById(id)  // password field absent

// When you need it (login only):
await User.findOne({ email }).select('+password')
```

## Apollo error link — auto logout on token expiry

```js
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
    localStorage.removeItem('gql_auth_token')
    window.location.reload()
  }
})
```

## Security checklist

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT signed with secret from .env
- ✅ password field excluded from queries by default (select: false)
- ✅ Generic error message on login failure (don't reveal if email exists)
- ✅ Token verified and user fetched fresh on every request
- ✅ Role checks via middleware — not inline in resolvers
- ✅ Ownership check before delete/update
- ✅ Auto-logout on UNAUTHENTICATED error
