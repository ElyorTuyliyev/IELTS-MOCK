import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { store } from '../store'

const rawGraphqlUrl = import.meta.env.VITE_GRAPHQL_URL ?? 'http://127.0.0.1:8000/graphql'

function normalizeGraphqlUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname === 'localhost') {
      parsedUrl.hostname = '127.0.0.1'
      return parsedUrl.toString()
    }
  } catch {
    return url
  }

  return url
}

const graphqlUrl = normalizeGraphqlUrl(rawGraphqlUrl)
const graphqlToken = import.meta.env.VITE_GRAPHQL_TOKEN

const httpLink = createHttpLink({
  uri: graphqlUrl,
  credentials: 'omit',
})

const authLink = setContext((operation, { headers }) => {
  const operationName = operation.operationName?.toLowerCase()
  const isPublicAuthOperation =
    operationName === 'login' ||
    operationName === 'signup' ||
    operationName === 'logout' ||
    operationName === 'createstudentsignupleaddata'

  if (isPublicAuthOperation) {
    return {
      headers: {
        ...headers,
      },
    }
  }

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
