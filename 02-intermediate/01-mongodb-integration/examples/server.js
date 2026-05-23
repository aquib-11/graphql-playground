/**
 * server.js — Book Library API with real MongoDB
 *
 * Setup:
 *   1. cp .env.example .env  (add your MONGODB_URI)
 *   2. npm run seed          (populate the database)
 *   3. npm run dev           (start the server)
 *
 * Open: http://localhost:4000/graphql
 */

import { ApolloServer }     from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import express              from 'express'
import cors                 from 'cors'
import { config }           from 'dotenv'
import { connectDB }        from './config/db.js'
import { typeDefs }         from './src/schema/typeDefs.js'
import { resolvers }        from './src/resolvers/index.js'

config()

const server = new ApolloServer({ typeDefs, resolvers })
const app    = express()

async function startServer() {
  // Connect to MongoDB FIRST — if this fails, don't start the API
  await connectDB()

  await server.start()

  app.use('/graphql', cors(), express.json(), expressMiddleware(server))

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`\n Book Library API (MongoDB) → http://localhost:${PORT}/graphql`)
    console.log('   Run queries in Apollo Sandbox\n')
  })
}

startServer()
