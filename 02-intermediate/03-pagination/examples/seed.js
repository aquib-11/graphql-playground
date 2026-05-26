/**
 * seed.js — Creates 50 posts across 5 categories
 *
 * Run: npm run seed
 */

import { config }  from 'dotenv'
import mongoose    from 'mongoose'
import { Post }    from './src/models/Post.js'

config()

const categories = ['TECH', 'SCIENCE', 'HISTORY', 'FICTION', 'BUSINESS']
const authors    = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']

const titles = {
  TECH:     (i) => `Understanding ${['GraphQL', 'Node.js', 'MongoDB', 'Docker', 'TypeScript', 'React', 'APIs', 'WebSockets', 'Redis', 'Kubernetes'][i % 10]}`,
  SCIENCE:  (i) => `The Science of ${['Black Holes', 'DNA', 'Quantum Physics', 'Relativity', 'Evolution'][i % 5]}`,
  HISTORY:  (i) => `${['Ancient Rome', 'World War II', 'The Renaissance', 'The Ottoman Empire', 'The Cold War'][i % 5]} Explained`,
  FICTION:  (i) => `${['The Last City', 'Dark Waters', 'Beyond the Stars', 'The Hidden World', 'Echoes of Time'][i % 5]} Part ${i + 1}`,
  BUSINESS: (i) => `${['Startup', 'Leadership', 'Marketing', 'Finance', 'Strategy'][i % 5]} Insights for 2025`,
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected')

    await Post.deleteMany()
    console.log('🗑  Cleared existing posts')

    const posts = []
    for (let i = 0; i < 50; i++) {
      const category = categories[i % 5]
      posts.push({
        title:    titles[category](i),
        content:  `This is the content for post #${i + 1}. It covers ${category.toLowerCase()} topics in depth.`,
        author:   authors[i % 5],
        category,
        views:    Math.floor(Math.random() * 1000),
      })
    }

    // Insert with a small delay between each so createdAt timestamps differ
    for (const post of posts) {
      await Post.create(post)
    }

    console.log('✅ Inserted 50 posts across 5 categories')
    console.log('🚀 Run: npm run dev\n')
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
  }
}

seed()
