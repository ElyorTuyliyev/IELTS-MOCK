import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { Global } from '@emotion/react'
import { Box, CircularProgress } from '@mui/material'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

import { apolloClient } from '../graphql/client'
import { persistor, store } from '../store'
import { globalStyles } from './globalStyles'

function RouteFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress size={28} />
    </Box>
  )
}

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <Global styles={globalStyles} />
            <Suspense fallback={<RouteFallback />}>{children}</Suspense>
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  )
}
