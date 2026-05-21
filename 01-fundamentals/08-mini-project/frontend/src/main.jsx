/**
 * main.jsx — React entry point + Apollo Client setup
 *
 * This is where we connect React to our GraphQL backend.
 *
 * ApolloClient is configured with:
 *   - uri: the URL of our GraphQL server
 *   - cache: InMemoryCache — Apollo's built-in caching layer
 *
 * ApolloProvider wraps the entire app so every component
 * can use useQuery and useMutation hooks.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import App from './App.jsx'

// Create the Apollo Client — one instance shared across the whole app
const client = new ApolloClient({
  // Point to our backend GraphQL server
  uri: 'http://localhost:4000/graphql',

  // InMemoryCache stores query results in memory
  // Apollo uses this to avoid re-fetching data it already has
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ApolloProvider makes `client` available to every component below it */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
