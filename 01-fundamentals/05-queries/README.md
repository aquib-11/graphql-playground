# queries.graphql — Example Queries
#
# Paste these one at a time into Apollo Sandbox
# http://localhost:4000/graphql


# ─────────────────────────────────────────────────────────────────────────────
# 1. Basic query
# ─────────────────────────────────────────────────────────────────────────────

query BasicHello {
  hello
}


# ─────────────────────────────────────────────────────────────────────────────
# 2. Fetch a single user
# ─────────────────────────────────────────────────────────────────────────────

query GetUser {
  user(id: "1") {
    id
    name
    email
    role
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 3. Fetch all users
# ─────────────────────────────────────────────────────────────────────────────

query GetAllUsers {
  users {
    id
    name
    email
    role
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 4. Nested query
# ─────────────────────────────────────────────────────────────────────────────

query GetUserWithPosts {
  user(id: "1") {
    name

    posts {
      id
      title
      status
    }
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 5. Nested field arguments
# ─────────────────────────────────────────────────────────────────────────────

query GetUserWithLimitedPosts {
  user(id: "1") {
    name

    posts(limit: 1) {
      title
      status
    }
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 6. Deeply nested query
# ─────────────────────────────────────────────────────────────────────────────

query GetPostWithEverything {
  post(id: "1") {
    title
    content
    status

    author {
      name
      email
    }

    comments {
      text

      author {
        name
      }
    }
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 7. Variables
# ─────────────────────────────────────────────────────────────────────────────
#
# Variables:
# {
#   "userId": "2"
# }

query GetUserById($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 8. Variables with defaults
# ─────────────────────────────────────────────────────────────────────────────

query GetPosts($limit: Int = 2) {
  posts(limit: $limit) {
    id
    title
    publishedAt
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 9. Aliases
# ─────────────────────────────────────────────────────────────────────────────

query GetTwoUsers {

  firstUser: user(id: "1") {
    name
    email
  }

  secondUser: user(id: "2") {
    name
    email
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 10. Fragments
# ─────────────────────────────────────────────────────────────────────────────

fragment UserBasic on User {
  id
  name
  email
}

query GetUsersWithFragment {
  user(id: "1") {
    ...UserBasic
    role
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 11. Multiple root fields
# ─────────────────────────────────────────────────────────────────────────────

query GetDashboardData {

  users {
    id
    name
  }

  posts(limit: 2) {
    id
    title
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 12. __typename meta-field
# ─────────────────────────────────────────────────────────────────────────────

query CheckTypes {

  user(id: "1") {
    __typename
    name
  }

  post(id: "1") {
    __typename
    title
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 13. Directives — @include
# ─────────────────────────────────────────────────────────────────────────────
#
# Variables:
# {
#   "showEmail": true
# }

query GetUserConditionally($showEmail: Boolean!) {

  user(id: "1") {
    name

    email @include(if: $showEmail)
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 14. Directives — @skip
# ─────────────────────────────────────────────────────────────────────────────
#
# Variables:
# {
#   "hideEmail": true
# }

query SkipEmail($hideEmail: Boolean!) {

  user(id: "1") {
    name

    email @skip(if: $hideEmail)
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 15. Union + Inline fragments
# ─────────────────────────────────────────────────────────────────────────────

query SearchEverything {

  search(query: "graph") {

    __typename

    ... on User {
      id
      name
      email
    }

    ... on Post {
      id
      title
      status
    }
  }
}


# ─────────────────────────────────────────────────────────────────────────────
# 16. Interface example
# ─────────────────────────────────────────────────────────────────────────────

query InterfaceExample {

  users {
    id
    name
  }

  posts {
    id
    title
  }
}
