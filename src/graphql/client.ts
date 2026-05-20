import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  type Operation,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

import { isAuthTokenOversized, isSafeAuthToken } from '../helpers/authToken'
import { store } from '../store'
import { clearAuth } from '../store/slices/authSlice'
import { ROUTES_PATH } from '../routes/paths'

const rawGraphqlUrl =
  import.meta.env.VITE_GRAPHQL_URL ??
  ('http://localhost:8000/graphql')

function normalizeGraphqlUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname === 'localhost') {
      parsedUrl.hostname = 'localhost'
      return parsedUrl.toString()
    }
  } catch {
    return url
  }

  return url
}

const graphqlUrl = normalizeGraphqlUrl(rawGraphqlUrl)
const graphqlToken = import.meta.env.VITE_GRAPHQL_TOKEN

const PUBLIC_AUTH_OPERATIONS = new Set([
  'login',
  'signup',
  'logout',
  'createstudentsignupleaddata',
  'paymentrequestbytoken',
  'submitpaymentrequestbytoken',
])

function resolveOperationName(operation: Operation) {
  if (operation.operationName) {
    return operation.operationName.toLowerCase()
  }

  for (const definition of operation.query.definitions) {
    if (definition.kind === 'OperationDefinition' && definition.name) {
      return definition.name.value.toLowerCase()
    }
  }

  return undefined
}

function resolveAuthToken() {
  const token = store.getState().auth.token ?? graphqlToken ?? null

  if (!token) {
    return null
  }

  if (isAuthTokenOversized(token)) {
    store.dispatch(clearAuth())
    return null
  }

  return token
}

const httpLink = createHttpLink({
  uri: graphqlUrl,
  credentials: 'omit',
})

const authLink = setContext((operation, { headers }) => {
  const operationName = resolveOperationName(operation)
  const isPublicAuthOperation =
    operationName != null && PUBLIC_AUTH_OPERATIONS.has(operationName)

  if (isPublicAuthOperation) {
    const nextHeaders = { ...headers } as Record<string, string>
    delete nextHeaders.Authorization
    delete nextHeaders.authorization
    return { headers: nextHeaders }
  }

  const token = resolveAuthToken()

  return {
    headers: {
      ...headers,
      ...(isSafeAuthToken(token)
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

const errorLink = onError((errorContext) => {
  const legacyContext = errorContext as {
    graphQLErrors?: Array<{ extensions?: { code?: string } }>
    networkError?: unknown
  }
  const graphQLErrors =
    legacyContext.graphQLErrors ??
    ((errorContext as { error?: { errors?: Array<{ extensions?: { code?: string } }> } }).error
      ?.errors ?? [])
  const networkError =
    legacyContext.networkError ??
    (errorContext as { error?: { networkError?: unknown } }).error?.networkError
  const hasUnauthenticatedGraphqlError =
    graphQLErrors.some((error: { extensions?: { code?: string } }) => error.extensions?.code === 'UNAUTHENTICATED')
  const networkErrorObject =
    typeof networkError === 'object' && networkError !== null
      ? (networkError as { statusCode?: number })
      : null
  const hasUnauthorizedNetworkError =
    Boolean(networkErrorObject && 'statusCode' in networkErrorObject && networkErrorObject.statusCode === 401)
  const hasHeaderTooLargeNetworkError =
    Boolean(networkErrorObject && 'statusCode' in networkErrorObject && networkErrorObject.statusCode === 431)

  if (hasUnauthenticatedGraphqlError || hasUnauthorizedNetworkError || hasHeaderTooLargeNetworkError) {
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
