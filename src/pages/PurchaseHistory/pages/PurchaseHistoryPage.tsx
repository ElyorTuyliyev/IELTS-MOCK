import { Navigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { useAppSelector } from '../../../store/hooks'
import { selectUserRole } from '../../../store'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { ROUTES_PATH } from '../../../routes/paths'
import { PurchaseHistorySection } from '../../Billing/components/PurchaseHistorySection'

export function PurchaseHistoryRedirect() {
  const role = useAppSelector(selectUserRole)
  if (role === USER_ROLES.center) {
    return <Navigate to={ROUTES_PATH.buyPlan} replace />
  }
  return <Navigate to={ROUTES_PATH.examPlans} replace />
}

/** @deprecated Use embedded history on Buy Plan / Exam Plans pages. Kept for direct imports if needed. */
export function PurchaseHistoryPage() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Purchase History
        </Typography>
        <PurchaseHistorySection />
      </Box>
    </Layout>
  )
}
