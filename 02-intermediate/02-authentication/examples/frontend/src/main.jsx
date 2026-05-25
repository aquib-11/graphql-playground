/**
 * main.jsx — Apollo Client setup with auth link
 *
 * authLink automatically attaches the JWT token to every
 * request's Authorization header — resolvers receive it via context.
 */

import React              from 'react'
import ReactDOM           from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext }     from '@apollo/client/link/context'
import { onError }        from '@apollo/client/link/error'
import App                from './App.jsx'
import { AuthProvider }   from './context/AuthContext.jsx'

const TOKEN_KEY = 'gql_auth_token'

// 1. HTTP link — destination
const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })

// 2. Auth link — attaches token to every request header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_KEY)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// 3. Error link — handles global errors (e.g. auto-logout on token expiry)
const errorLink = onError(({ graphQLErrors }) => {
  const isUnauthenticated = graphQLErrors?.some(
    e => e.extensions?.code === 'UNAUTHENTICATED'
  )
  if (isUnauthenticated) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('gql_auth_user')
    // Reload to reset all state cleanly
    window.location.reload()
  }
})

// Chain: errorLink → authLink → httpLink
const client = new ApolloClient({
  link:  errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query:      { errorPolicy: 'all' },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
)
