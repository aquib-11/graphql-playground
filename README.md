    # GraphQL Journey 

     A complete, hands-on learning path from GraphQL beginner to advanced — built topic by topic, explained clearly, with real working code at every step.

    ---

    ## What is this?

    **GraphQL Journey** is a structured, public learning repository designed to teach GraphQL from the ground up — through clean explanations, practical code, and real projects.

    Whether you're learning for yourself or teaching others, every topic in this repo follows the same pattern:

    - **Concept first** — what it is and why it exists, before a single line of code
    - **Working examples** — runnable, commented code you can copy and modify
    - **Notes** — key takeaways and common mistakes
    - **Exercises** — challenges to test your understanding

    ---

    ## Who is this for?

    - Developers who know JavaScript/Node.js and want to learn GraphQL properly
    - Developers coming from REST who want to understand the differences
    - Anyone building a portfolio and wanting a real, public learning repo
    - Teachers and mentors who want ready-made GraphQL learning material

    ---

    ## Tech stack

    | Layer | Technology |
    |---|---|
    | Runtime | Node.js v18+ |
    | HTTP framework | Express.js v4 |
    | GraphQL server | Apollo Server v4 |
    | Database | MongoDB v6 |
    | ODM | Mongoose v8 |
    | Auth | JWT + bcryptjs |
    | Performance | DataLoader v2 |
    | Real-time | graphql-ws + WebSockets |
    | Frontend (projects) | React v18 + Apollo Client v3 |
    | Build tool | Vite v5 |

    ---

    ## Learning path

    ### 01 — Fundamentals

    | Topic | What you'll learn |
    |---|---|
    | [What is GraphQL?](./01-fundamentals/01-what-is-graphql/) | History, concepts, the query language, type system |
    | [REST vs GraphQL](./01-fundamentals/02-rest-vs-graphql/) | Overfetching, underfetching, N+1, when to use which |
    | [Server Setup](./01-fundamentals/03-server-setup/) | Node + Express + Apollo Server, first running server |
    | [Schemas & Types](./01-fundamentals/04-schemas-and-types/) | SDL, scalars, objects, enums, inputs, non-null, lists |
    | [Queries](./01-fundamentals/05-queries/) | Arguments, aliases, fragments, variables, nesting |
    | [Mutations](./01-fundamentals/06-mutations/) | Create, update, delete, input types, returning data |
    | [Resolvers](./01-fundamentals/07-resolvers/) | Resolver chain, context, field resolvers |
    | [Mini Project — Book Library API](./01-fundamentals/08-mini-project/) | Full in-memory CRUD API with books and authors |

    ### 02 — Intermediate

    | Topic | What you'll learn |
    |---|---|
    | [MongoDB Integration](./02-intermediate/01-mongodb-integration/) | Mongoose models, wiring resolvers to a real database |
    | [Authentication](./02-intermediate/02-authentication/) | JWT, context, protecting resolvers, login + register |
    | [Pagination](./02-intermediate/03-pagination/) | Offset, cursor-based, Relay spec |
    | [Filtering & Sorting](./02-intermediate/04-filtering/) | Dynamic filters, sort args, combined with pagination |
    | [Error Handling](./02-intermediate/05-error-handling/) | GraphQL errors, custom classes, user-friendly messages |

    ### 03 — Advanced

    | Topic | What you'll learn |
    |---|---|
    | [DataLoader](./03-advanced/01-dataloader/) | N+1 problem, batching, caching, real benchmarks |
    | [Subscriptions](./03-advanced/02-subscriptions/) | WebSockets, pub/sub, real-time data |
    | [Federation](./03-advanced/03-federation/) | Subgraphs, supergraph, Apollo Federation v2 |
    | [Caching](./03-advanced/04-caching/) | Response caching, field-level caching, Redis |
    | [GraphQL Gateways](./03-advanced/05-graphql-gateways/) | Apollo Gateway, schema composition |
    | [Distributed Graphs](./03-advanced/06-distributed-graphs/) | Multi-service architecture, real-world design |

    ### 04 — Projects

    | Project | Stack |
    |---|---|
    | [Blog API](./04-projects/01-blog-api/) | Full backend + React frontend — users, posts, comments, auth, pagination |
    | [Social Media Backend](./04-projects/02-social-media-backend/) | Follows, likes, feed, notifications, real-time |

    ---

    ## How each topic folder is structured

    ```
    01-what-is-graphql/
    ├── README.md        ← full explanation of the concept
    ├── notes/
    │   └── notes.md     ← key takeaways, gotchas, cheat sheet
    ├── examples/        ← runnable code files
    └── exercises/       ← challenges for you to try

    Folder structure may vary slightly depending on the topic. Some concepts may not require runnable examples or exercises.
    ```

    ---

    ## Getting started

    ### Prerequisites

    - Node.js v18 or higher — [download here](https://nodejs.org)
    - MongoDB — [install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
    - A code editor — VS Code recommended

    ### Running any example

    Each topic's `examples/` folder has its own `package.json`. To run:

    ```bash
    # Navigate to the example folder
    cd 01-fundamentals/03-server-setup/examples

    # Install dependencies
    npm install

    # Start the server
    npm run dev
    ```

    Then open [http://localhost:4000/graphql](http://localhost:4000/graphql) to see Apollo Sandbox.

    ---

    ## Resources

    - [GraphQL Cheatsheet](./resources/cheatsheet.md)
    - [GraphQL Glossary](./resources/glossary.md)
    - [Useful Links & Docs](./resources/links.md)

    ---

    ## Contributing

    This repo is designed to grow. If you find errors, want to add examples, or improve explanations — contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

    ---

    *Built for learning. Designed for sharing. Made to grow with you.*
