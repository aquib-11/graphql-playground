/**
 * server.js — Book Library API backend
 *
 * Run:  npm run dev
 * Open: http://localhost:4000/graphql
 */

import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from "@as-integrations/express5";
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'

const server = new ApolloServer({ typeDefs, resolvers })
const app = express()

async function startServer() {
  await server.start()

  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server))

  app.listen(4000, () => {
    console.log(' Book Library API running at http://localhost:4000/graphql')   
  })
}

startServer()
