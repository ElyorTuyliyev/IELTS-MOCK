import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { store } from '../store'

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:8000/graphql'
const graphqlToken = import.meta.env.VITE_GRAPHQL_TOKEN

const httpLink = createHttpLink({
  uri: graphqlUrl,
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  const token = store.getState().auth.token ?? graphqlToken

  return {
    headers: {
      ...headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  }
})

export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: {
    enabled: import.meta.env.DEV,
    name: 'ielts-client',
  },
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

export { graphqlUrl }
