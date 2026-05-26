# Exercises — Pagination

---

## Exercise 1 — Add page number to offset response

Currently `PostsPage` returns `offset`. Add a computed `currentPage` and `totalPages` field.

**Update `PageMeta` in typeDefs:**
```graphql
type PageMeta {
  total:        Int!
  hasMore:      Boolean!
  hasPrev:      Boolean!
  limit:        Int!
  offset:       Int!
  currentPage:  Int!   # ← add this
  totalPages:   Int!   # ← add this
}
```

**Update resolver:**
```js
page: {
  ...existing,
  currentPage: Math.floor(offset / limit) + 1,
  totalPages:  Math.ceil(result.total / limit),
}
```

---

## Exercise 2 — Add sort argument to offset query

Let clients sort by `createdAt` or `views`.

**Add to typeDefs:**
```graphql
enum SortField { CREATED_AT  VIEWS }
enum SortOrder { ASC  DESC }

# Add to posts query:
posts(
  limit:    Int
  offset:   Int
  category: Category
  sortBy:   SortField   # ← new
  order:    SortOrder   # ← new
): PostsPage!
```

**Update resolver:**
```js
const sortField = args.sortBy === 'VIEWS' ? 'views' : 'createdAt'
const sortOrder = args.order  === 'ASC'   ? 1       : -1
const sort      = { [sortField]: sortOrder }
```

---

## Exercise 3 — Add backward pagination to cursor query

The Relay spec supports going backwards with `last` and `before` args.

**Add to typeDefs:**
```graphql
postsFeed(
  first:    Int
  after:    String
  last:     Int     # ← new — fetch last N items
  before:   String  # ← new — cursor to paginate backwards from
  category: Category
): PostConnection!
```

**Hint for resolver:**
- `last` + `before` → find items where `_id > decodedBeforeCursor` sorted ascending, then reverse
- This is complex — research "Relay backward pagination"

---

## Exercise 4 — Paginate authors

Add a paginated `authors` query using cursor pagination.
Create an `Author` model with `name`, `bio`, `bookCount`.
Seed 20 authors and implement `authorsConnection(first, after)`.

---

## Exercise 5 — Combined filter + pagination

Combine category filter AND author filter with pagination:

```graphql
posts(
  limit:    Int
  offset:   Int
  category: Category
  author:   String   # ← filter by author name
): PostsPage!
```

Make sure `totalCount` and `hasMore` also respect the combined filter.
