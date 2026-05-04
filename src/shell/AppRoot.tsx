import { AppProviders } from './AppProviders'
import { AppRoutes } from '../routes'

export function AppRoot() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
