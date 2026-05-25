# Exercises — Authentication

---

## Exercise 1 — Add token expiry feedback

When a token is expired, the server returns an `UNAUTHENTICATED` error.
On the frontend, catch this error in Apollo Client and automatically log the user out.

**Hint:** Use Apollo's `onError` link:
```js
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
    localStorage.removeItem('gql_auth_token')
    window.location.href = '/login'
  }
})
```

---

## Exercise 2 — Add a changePassword mutation

**Schema:**
```graphql
type Mutation {
  changePassword(currentPassword: String!, newPassword: String!): Boolean!
}
```

**Resolver:**
1. `requireAuth(context)` to get current user
2. Fetch user from DB with `User.findById(currentUser.id)`
3. Compare `currentPassword` with stored hash
4. If match — hash the new password and save
5. Return `true`

---

## Exercise 3 — Add profile update

**Schema:**
```graphql
input UpdateProfileInput {
  name: String
}

type Mutation {
  updateProfile(input: UpdateProfileInput!): User!
}
```

**Resolver:**
1. `requireAuth(context)`
2. `User.findByIdAndUpdate(user.id, { $set: input }, { new: true })`
3. Return updated user

Add a form to the Dashboard to call this mutation.

---

## Exercise 4 — Protect post listing by ownership

Currently all logged-in users see all posts.
Change `posts` query to only return the current user's own posts.

**Resolver:**
```js
posts: async (_, __, context) => {
  const user = requireAuth(context)
  return await Post.find({ authorId: user.id }).sort({ createdAt: -1 })
}
```

Add a separate `allPosts` query (admin only) that returns everyone's posts.

---

## Exercise 5 — Add refresh token logic

JWT tokens expire. A refresh token allows getting a new access token without re-logging in.

**Concept:**
1. On login, return both an `accessToken` (15min) and a `refreshToken` (30 days)
2. Store refresh token in an httpOnly cookie (more secure than localStorage)
3. When access token expires, call a `refreshToken` mutation to get a new one
4. Server verifies the refresh token and returns a new access token

This is production-grade auth. Research "JWT refresh token rotation" for the full pattern.
