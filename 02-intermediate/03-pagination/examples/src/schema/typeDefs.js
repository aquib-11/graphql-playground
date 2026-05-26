export const typeDefs = `#graphql

  enum Category { TECH  SCIENCE  HISTORY  FICTION  BUSINESS }

  # ── Shared Post type ─────────────────────────────────────────────────────────

  type Post {
    id:        ID!
    title:     String!
    content:   String!
    author:    String!
    category:  Category!
    views:     Int!
    createdAt: String!
  }

  # ── Offset pagination types ───────────────────────────────────────────────────

  type PageMeta {
    total:   Int!     # total matching records
    hasMore: Boolean! # is there more data after this page?
    hasPrev: Boolean! # is there data before this page?
    limit:   Int!
    offset:  Int!
  }

  type PostsPage {
    nodes:    [Post!]!  # the actual posts
    page:     PageMeta! # pagination metadata
  }

  # ── Cursor pagination types (Relay spec) ──────────────────────────────────────

  type PostEdge {
    node:   Post!   # the actual post
    cursor: String! # opaque pointer to this post — pass as `after` for next page
  }

  type PageInfo {
    hasNextPage:     Boolean! # true if more data exists after this page
    hasPreviousPage: Boolean! # true if data exists before this page
    startCursor:     String   # cursor of the first item in this page
    endCursor:       String   # cursor of the last item — use as `after` arg
  }

  type PostConnection {
    edges:      [PostEdge!]! # items + their cursors
    pageInfo:   PageInfo!    # navigation metadata
    totalCount: Int!         # total matching posts (ignores cursor)
  }

  # ── Queries ───────────────────────────────────────────────────────────────────

  type Query {
    # Strategy 1 — Offset pagination
    # Simple, good for fixed datasets and numbered pages
    posts(
      limit:    Int       # how many to return (default 10, max 100)
      offset:   Int       # how many to skip (default 0)
      category: Category  # optional filter
    ): PostsPage!

    # Strategy 2 — Cursor pagination (Relay spec)
    # Stable, efficient, good for infinite scroll and fast-moving data
    postsFeed(
      first:    Int       # how many to return (default 10, max 100)
      after:    String    # cursor from previous page's endCursor
      category: Category  # optional filter
    ): PostConnection!

    # Single post
    post(id: ID!): Post
  }
`
