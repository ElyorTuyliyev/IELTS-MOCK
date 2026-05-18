import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { Box, CircularProgress, Typography } from '@mui/material'

import {
  PURCHASE_HISTORY_QUERY,
  type PurchaseHistoryItem,
} from '../api/billingQueries'
import { BillingStatusChip } from './BillingStatusChip'

const ME_CENTER_QUERY = gql`
  query MeCenterPlanSummary {
    meCenter {
      availableExamCredits
    }
  }
`

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function pickDisplayPlan(items: PurchaseHistoryItem[]) {
  const planPurchases = items.filter((row) => row.recordType === 'plan_purchase')
  const pending = planPurchases.find((row) => row.status === 'awaiting_approval')
  if (pending) {
    return { plan: pending, label: 'Current plan (pending approval)' as const }
  }
  const lastApproved = planPurchases.find((row) => row.status === 'approved')
  if (lastApproved) {
    return { plan: lastApproved, label: 'Last purchased plan' as const }
  }
  return null
}

export function CurrentOrLastPlanCard() {
  const { data: centerData } = useQuery<{
    meCenter?: { availableExamCredits?: number } | null
  }>(ME_CENTER_QUERY)

  const { data: historyData, loading } = useQuery<{
    purchaseHistory: { items: PurchaseHistoryItem[] }
  }>(PURCHASE_HISTORY_QUERY, {
    variables: { page: 1, pageSize: 50 },
    fetchPolicy: 'network-only',
  })

  const availableCredits = centerData?.meCenter?.availableExamCredits ?? 0
  const display = useMemo(
    () => pickDisplayPlan(historyData?.purchaseHistory?.items ?? []),
    [historyData?.purchaseHistory?.items],
  )

  return (
    <Box className="buy-plan-page__credits">
      <Box className="buy-plan-page__credits-inner">
        <Box className="buy-plan-page__credits-stat">
          <Typography className="buy-plan-page__credits-label">Available credits</Typography>
          <Typography className="buy-plan-page__credits-value">{availableCredits}</Typography>
          <Typography className="buy-plan-page__credits-hint">
            Exam slots ready to use at your center
          </Typography>
        </Box>

        <Box className="buy-plan-page__credits-plan">
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={22} />
              <Typography color="text.secondary" variant="body2">
                Loading plan details…
              </Typography>
            </Box>
          ) : display ? (
            <>
              <Typography className="buy-plan-page__credits-plan-label">{display.label}</Typography>
              <Box className="buy-plan-page__credits-plan-row">
                <Typography className="buy-plan-page__credits-plan-name">
                  {display.plan.planName}
                </Typography>
                <BillingStatusChip
                  status={display.plan.status}
                  recordType={display.plan.recordType}
                />
              </Box>
              <Typography className="buy-plan-page__credits-meta">
                {display.plan.examCredits ?? 0} exams · ${display.plan.amount.toFixed(2)}
              </Typography>
              <Typography className="buy-plan-page__credits-date">
                {formatDate(display.plan.occurredAt)}
              </Typography>
            </>
          ) : (
            <>
              <Typography className="buy-plan-page__credits-plan-label">Your plan</Typography>
              <Typography className="buy-plan-page__credits-plan-name">
                No plan yet
              </Typography>
              <Typography className="buy-plan-page__credits-meta">
                Pick a package below to purchase exam credits for your center.
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
