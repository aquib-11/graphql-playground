/**
 * server.js
 *
 * Entry point — clean and minimal.
 * All auth logic lives in middleware, not here.
 *
 * Setup:
 *   cp .env.example .env   ← add your values
 *   npm run dev
 */

import { ApolloServer }     from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express              from 'express'
import cors                 from 'cors'
import { config }           from 'dotenv'
import { connectDB }        from './config/db.js'
import { typeDefs }         from './src/schema/typeDefs.js'
import { resolvers }        from './src/resolvers/index.js'
import { buildContext }     from './src/middleware/auth.middleware.js'

config()

const server = new ApolloServer({ typeDefs, resolvers })
const app    = express()

async function startServer() {
  await connectDB()
  await server.start()

  app.use(
    '/graphql',
    cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }),
    express.json(),
    expressMiddleware(server, {
      // buildContext handles all token extraction and user lookup
      // Resolvers just read context.user — they never touch headers
      context: ({ req }) => buildContext(req),
    })
  )

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`\n🔐 Auth API     → http://localhost:${PORT}/graphql`)
    console.log(`🎨 Frontend     → http://localhost:5173\n`)
  })
}

startServer()
