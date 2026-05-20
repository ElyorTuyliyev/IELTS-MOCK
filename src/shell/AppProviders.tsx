import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { Global } from '@emotion/react'
import { Box, CircularProgress } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

import { ToastProvider } from '../components/common/Toast'
import { apolloClient } from '../graphql/client'
import { NotificationsProvider } from '../features/notifications'
import { isAuthTokenOversized } from '../helpers/authToken'
import { persistor, store } from '../store'
import { clearAuth } from '../store/slices/authSlice'
import { muiTheme } from '../theme'
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
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          if (isAuthTokenOversized(store.getState().auth.token)) {
            store.dispatch(clearAuth())
          }
        }}
      >
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <ThemeProvider theme={muiTheme}>
              <Global styles={globalStyles} />
              <ToastProvider>
                <NotificationsProvider>
                  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
                </NotificationsProvider>
              </ToastProvider>
            </ThemeProvider>
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  )
}
