/**
 * GraphQL approach — fetching the same blog post page
 *
 * Scenario: Display a post with its author and 3 latest comments (with commenter names)
 *
 * Compare this to rest-approach.js — same data, completely different experience.
 * One request. Exactly the fields we need. Nothing extra.
 */

// This simulates what Apollo Server does internally when it receives a query.
// On Day 4 (Server Setup) you'll run a real server. For now, just follow the flow.

// ─── Simulated database ───────────────────────────────────────────────────────

const db = {
  posts: {
    42: {
      id: '42',
      title: 'Getting Started with GraphQL',
      body: 'GraphQL is a query language for your API...',
      authorId: '7',
    },
  },
  users: {
    '7':  { id: '7',  name: 'Sarah', profilePicture: 'https://avatars.example.com/7' },
    '21': { id: '21', name: 'Ali',   profilePicture: 'https://avatars.example.com/21' },
    '35': { id: '35', name: 'Priya', profilePicture: 'https://avatars.example.com/35' },
    '48': { id: '48', name: 'Chen',  profilePicture: 'https://avatars.example.com/48' },
  },
  comments: {
    '42': [
      { id: '1', postId: '42', authorId: '21', text: 'Great article!' },
      { id: '2', postId: '42', authorId: '35', text: 'Very helpful, thanks.' },
      { id: '3', postId: '42', authorId: '48', text: 'Can you do a follow-up on mutations?' },
    ],
  },
}

// ─── This is the GraphQL query the client sends ───────────────────────────────
//
// Notice: the client describes exactly what it needs.
// No more, no less.
//
// query GetPostPage {
//   post(id: "42") {
//     title
//     body
//     author {
//       name
//       profilePicture
//     }
//     comments(limit: 3) {
//       text
//       author {
//         name
//       }
//     }
//   }
// }

// ─── Resolvers — functions that fetch each piece of data ──────────────────────
//
// Each resolver is responsible for ONE field.
// GraphQL calls them automatically based on what the query asked for.

const resolvers = {
  Query: {
    // Called when query asks for: post(id: "42")
    post: (parent, args) => {
      console.log(`Resolver called: Query.post(id: ${args.id})`)
      return db.posts[args.id]
    },
  },

  Post: {
    // Called when query asks for: post { author { ... } }
    author: (parent) => {
      console.log(`Resolver called: Post.author — looking up user ${parent.authorId}`)
      return db.users[parent.authorId]
    },

    // Called when query asks for: post { comments(...) { ... } }
    comments: (parent, args) => {
      console.log(`Resolver called: Post.comments`)
      const all = db.comments[parent.id] || []
      // Only return as many as requested
      return args.limit ? all.slice(0, args.limit) : all
    },
  },

  Comment: {
    // Called when query asks for: comments { author { ... } }
    author: (parent) => {
      console.log(`Resolver called: Comment.author — looking up user ${parent.authorId}`)
      return db.users[parent.authorId]
    },
  },
}

// ─── Simulate GraphQL execution ───────────────────────────────────────────────
//
// In real life, Apollo Server does all of this automatically.
// This shows you the logic so you understand what's happening.

async function executeGraphQLQuery() {
  console.log('--- GraphQL Approach ---')
  console.log('Single request to /graphql with the query')
  console.log('')
  console.log('GraphQL engine calling resolvers:')
  console.log('')

  // Step 1: resolve the root — post(id: "42")
  const post = resolvers.Query.post(null, { id: '42' })

  // Step 2: resolve post.author
  const author = resolvers.Post.author(post)

  // Step 3: resolve post.comments(limit: 3)
  const comments = resolvers.Post.comments(post, { limit: 3 })

  // Step 4: resolve each comment's author
  // (In real GraphQL, this is where DataLoader would batch these into ONE DB call)
  const commentsWithAuthors = comments.map(comment => ({
    text: comment.text,
    author: resolvers.Comment.author(comment),
  }))

  // Step 5: assemble the final response — shaped exactly like the query
  const response = {
    data: {
      post: {
        title: post.title,           // only title — not likesCount, viewsCount, etc.
        body: post.body,             // only body
        author: {
          name: author.name,
          profilePicture: author.profilePicture,
        },
        comments: commentsWithAuthors.map(c => ({
          text: c.text,
          author: { name: c.author.name }, // only name — not bio, email, etc.
        })),
      },
    },
  }

  console.log('')
  console.log('Total network requests made: 1')
  console.log('(The resolver calls above are all in-process — no extra HTTP round trips)')
  console.log('')
  console.log('Response (shaped exactly like the query):')
  console.log(JSON.stringify(response, null, 2))
}

executeGraphQLQuery()
