/**
 * REST approach — fetching a blog post page
 *
 * Scenario: Display a post with its author and 3 latest comments (with commenter names)
 *
 * This file simulates what you would do with a REST API.
 * Notice how many separate requests are needed for one page of data.
 */

// Simulated fetch function (replace with real fetch in a browser or node-fetch in Node)
async function fakeFetch(url) {
  // Simulated database
  const db = {
    posts: {
      42: {
        id: 42,
        title: 'Getting Started with GraphQL',
        body: 'GraphQL is a query language for your API...',
        authorId: 7,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
        likesCount: 128,        // ← not needed for our page
        viewsCount: 4200,       // ← not needed for our page
        tags: ['graphql'],      // ← not needed for our page
        status: 'published',    // ← not needed for our page
        featuredImageUrl: '...',// ← not needed for our page
        seoTitle: '...',        // ← not needed for our page
      },
    },
    users: {
      7:  { id: 7,  name: 'Sarah', profilePicture: 'https://avatars.example.com/7',  bio: '...' },
      21: { id: 21, name: 'Ali',   profilePicture: 'https://avatars.example.com/21', bio: '...' },
      35: { id: 35, name: 'Priya', profilePicture: 'https://avatars.example.com/35', bio: '...' },
      48: { id: 48, name: 'Chen',  profilePicture: 'https://avatars.example.com/48', bio: '...' },
    },
    comments: {
      42: [
        { id: 1, postId: 42, userId: 21, text: 'Great article!' },
        { id: 2, postId: 42, userId: 35, text: 'Very helpful, thanks.' },
        { id: 3, postId: 42, userId: 48, text: 'Can you do a follow-up on mutations?' },
      ],
    },
  }

  // Parse the URL to simulate a real API response
  if (url.match(/\/posts\/(\d+)\/comments/)) {
    const postId = parseInt(url.match(/\/posts\/(\d+)/)[1])
    return db.comments[postId] || []
  }
  if (url.match(/\/posts\/(\d+)/)) {
    const id = parseInt(url.match(/\/posts\/(\d+)/)[1])
    return db.posts[id]
  }
  if (url.match(/\/users\/(\d+)/)) {
    const id = parseInt(url.match(/\/users\/(\d+)/)[1])
    return db.users[id]
  }
}

async function loadPostPage(postId) {
  console.log('--- REST Approach ---')
  console.log('Fetching post page for post ID:', postId)
  console.log('')

  // Request 1 — fetch the post
  console.log('Request 1: GET /posts/42')
  const post = await fakeFetch(`/posts/${postId}`)

  // Look at how much data we got back that we don't need:
  console.log('Received post fields:', Object.keys(post))
  // ['id', 'title', 'body', 'authorId', 'createdAt', 'updatedAt',
  //  'likesCount', 'viewsCount', 'tags', 'status', 'featuredImageUrl', 'seoTitle']
  // We only needed: title, body — this is OVERFETCHING

  // Request 2 — fetch the author using authorId from the post
  console.log('Request 2: GET /users/' + post.authorId)
  const author = await fakeFetch(`/users/${post.authorId}`)

  // Request 3 — fetch the comments
  console.log('Request 3: GET /posts/42/comments')
  const comments = await fakeFetch(`/posts/${postId}/comments`)
  const latestComments = comments.slice(0, 3)

  // Requests 4, 5, 6 ... — N+1 problem!
  // For every comment, we need the commenter's name → separate request per comment
  console.log(`Requests 4-${3 + latestComments.length}: GET /users/:id (one per comment)`)
  const commentersWithAuthors = await Promise.all(
    latestComments.map(async (comment) => {
      const commenter = await fakeFetch(`/users/${comment.userId}`)
      return { ...comment, author: commenter }
    })
  )

  // Assemble the data
  const pageData = {
    title: post.title,
    body: post.body,
    author: {
      name: author.name,
      profilePicture: author.profilePicture,
    },
    comments: commentersWithAuthors.map(c => ({
      text: c.text,
      author: { name: c.author.name },
    })),
  }

  console.log('')
  console.log(`Total network requests made: ${3 + latestComments.length}`)
  console.log('(Would be MORE if there were more comments)')
  console.log('')
  console.log('Final page data:')
  console.log(JSON.stringify(pageData, null, 2))
}

loadPostPage(42)
