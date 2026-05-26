/**
 * server.js — Pagination examples server
 *
 * Run:  npm run dev
 * Seed: npm run seed  (do this first)
 * Open: http://localhost:4000/graphql
 */

import { ApolloServer }      from '@apollo/server'
import { expressMiddleware }  from '@as-integrations/express5'
import express               from 'express'
import cors                  from 'cors'
import { config }            from 'dotenv'
import { connectDB }         from './config/db.js'
import { typeDefs }          from './src/schema/typeDefs.js'
import { resolvers }         from './src/resolvers/index.js'

config()

const server = new ApolloServer({ typeDefs, resolvers })
const app    = express()

async function startServer() {
  await connectDB()
  await server.start()

  app.use('/graphql', cors(), express.json(), expressMiddleware(server))

  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`\n📄 Pagination API → http://localhost:${PORT}/graphql`)
    console.log('   Run "npm run seed" first if you haven\'t already\n')
  })
}

startServer()
