import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

import { store } from '../store'
import { clearAuth } from '../store/slices/authSlice'
import { ROUTES_PATH } from '../routes/paths'

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

let isAutoLoggingOut = false

function forceLogoutOnAuthError() {
  if (isAutoLoggingOut) {
    return
  }

  isAutoLoggingOut = true
  store.dispatch(clearAuth())

  if (typeof window !== 'undefined' && window.location.pathname !== ROUTES_PATH.signIn) {
    window.location.replace(ROUTES_PATH.signIn)
    return
  }

  isAutoLoggingOut = false
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const hasUnauthenticatedGraphqlError =
    graphQLErrors?.some((error) => error.extensions?.code === 'UNAUTHENTICATED') ?? false
  const hasUnauthorizedNetworkError =
    'statusCode' in (networkError ?? {}) &&
    (networkError as { statusCode?: number }).statusCode === 401

  if (hasUnauthenticatedGraphqlError || hasUnauthorizedNetworkError) {
    forceLogoutOnAuthError()
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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
