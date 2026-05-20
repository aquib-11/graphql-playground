# Notes — What is GraphQL?

## Key takeaways

- GraphQL = query language + runtime. Not a database, not a framework.
- Created by Facebook in 2012, open-sourced 2015
- Single endpoint (`/graphql`) vs many endpoints in REST
- The **schema** is the contract between client and server
- Three operation types: `query`, `mutation`, `subscription`
- Response shape always mirrors query shape
- APIs are self-documenting via introspection

## Common misconceptions

| Misconception | Reality |
|---|---|
| "GraphQL replaces databases" | No — it sits in front of them |
| "GraphQL is always better than REST" | No — REST is still great for simple, public APIs |
| "GraphQL requires a special database" | No — use any database you like |
| "GraphQL is only for Facebook-scale apps" | No — works great for small apps too |

## When GraphQL shines

- Complex, nested data relationships
- Multiple clients (web, mobile) needing different data shapes
- Rapidly evolving APIs where adding fields shouldn't break clients
- Apps that need to combine data from multiple sources

## When REST might be better

- Simple CRUD APIs with straightforward data
- Public APIs consumed by many unknown clients
- File uploads (GraphQL handles these awkwardly)
- When caching is critical (REST caches at HTTP layer more naturally)

## Vocabulary to know

- **SDL** — Schema Definition Language. The syntax used to define a GraphQL schema.
- **Resolver** — A function that returns the data for a specific field.
- **Introspection** — The ability to query a GraphQL API about its own schema.
- **Overfetching** — Getting more data than you need (REST problem GraphQL solves).
- **Underfetching** — Not getting enough data in one request (REST problem GraphQL solves).
