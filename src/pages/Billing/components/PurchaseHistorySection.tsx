import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Typography } from '@mui/material'

import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { useUrlPagination } from '../../../hooks/useUrlPagination'
import { useAppSelector } from '../../../store/hooks'
import { selectUserRole } from '../../../store'
import { USER_ROLES } from '../../../store/slices/authSlice'
import {
  PURCHASE_HISTORY_QUERY,
  REVIEW_PLAN_PURCHASE_MUTATION,
  type PendingPlanPurchase,
  type PurchaseHistoryItem,
} from '../api/billingQueries'
import { ReviewPurchaseDialog } from '../../Payments/components/ReviewPurchaseDialog'
import { BillingStatusChip } from './BillingStatusChip'

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function formatRecordType(type: string) {
  return type === 'plan_purchase' ? 'Plan request' : 'Payment'
}

function isPendingPlanPurchase(row: PurchaseHistoryItem) {
  return row.recordType === 'plan_purchase' && row.status === 'awaiting_approval'
}

type PurchaseHistorySectionProps = {
  pageParam?: string
  showTitle?: boolean
  showAdminHint?: boolean
  embedded?: boolean
}

export function PurchaseHistorySection({
  pageParam = 'page',
  showTitle = true,
  showAdminHint = true,
  embedded = false,
}: PurchaseHistorySectionProps) {
  const toast = useToast()
  const role = useAppSelector(selectUserRole)
  const isAdmin = role === USER_ROLES.superAdmin
  const { page, pageSize, setPage } = useUrlPagination(10, pageParam)
  const [reviewRow, setReviewRow] = useState<PurchaseHistoryItem | null>(null)

  const { data, loading, refetch } = useQuery<{
    purchaseHistory: {
      items: PurchaseHistoryItem[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }>(PURCHASE_HISTORY_QUERY, {
    variables: { page, pageSize },
    fetchPolicy: 'network-only',
  })

  const [reviewPurchaseMutation, { loading: reviewing }] = useMutation(
    REVIEW_PLAN_PURCHASE_MUTATION,
  )

  const history = data?.purchaseHistory
  const items = history?.items ?? []
  const totalPages = history?.totalPages ?? 1
  const total = history?.total ?? 0

  const rangeLabel = useMemo(() => {
    if (total === 0) return 'No records'
    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)
    return `Showing ${start}–${end} of ${total}`
  }, [page, pageSize, total])

  const reviewPurchase = useMemo<PendingPlanPurchase | null>(() => {
    if (!reviewRow || !isPendingPlanPurchase(reviewRow)) return null
    return {
      _id: reviewRow._id,
      centerId: reviewRow.centerId,
      planName: reviewRow.planName ?? 'Plan',
      examCount: reviewRow.examCredits ?? 0,
      amount: reviewRow.amount,
      status: reviewRow.status ?? 'awaiting_approval',
      centerNote: reviewRow.note,
      createdAt: reviewRow.occurredAt,
    }
  }, [reviewRow])

  const reviewCenters = useMemo(() => {
    if (!reviewRow) return []
    return [{ _id: reviewRow.centerId, name: reviewRow.centerName ?? reviewRow.centerId }]
  }, [reviewRow])

  const handleReviewConfirm = useCallback(
    async (approve: boolean, adminNote: string) => {
      if (!reviewRow) return
      try {
        await reviewPurchaseMutation({
          variables: {
            input: {
              _id: reviewRow._id,
              approve,
              adminNote: adminNote.trim() || (approve ? 'Approved' : 'Rejected'),
            },
          },
        })
        toast.success(
          approve ? 'Purchase approved and credits added.' : 'Purchase rejected.',
        )
        setReviewRow(null)
        await refetch()
      } catch (error) {
        toast.error(getGraphQLErrorMessage(error, 'Could not review purchase.'))
      }
    },
    [refetch, reviewPurchaseMutation, reviewRow, toast],
  )

  return (
    <Box className={embedded ? 'purchase-history purchase-history--embedded' : 'purchase-history'}>
      {showTitle ? (
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: embedded ? 0 : 1 }}
          className="purchase-history__title"
        >
          Purchase history
        </Typography>
      ) : null}
      {isAdmin && showAdminHint ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: showTitle ? 1 : 0 }}>
          Pending plan requests can be approved or rejected here. For full payment management,
          use Billing overview under Payments.
        </Typography>
      ) : embedded ? null : (
        <Box sx={{ mb: 2 }} />
      )}

      <Box
        className="purchase-history__table-wrap"
        sx={
          embedded
            ? undefined
            : { overflowX: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2 }
        }
      >
        <Box
          component="table"
          className="purchase-history__table"
          sx={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <Box component="thead" sx={embedded ? undefined : { bgcolor: 'action.hover' }}>
            <Box component="tr">
              {[
                'Date',
                'Type',
                ...(isAdmin ? ['Center'] : []),
                'Details',
                'Amount',
                'Credits',
                'Status',
                ...(isAdmin ? ['Actions'] : []),
              ].map((col) => (
                <Box
                  key={col}
                  component="th"
                  sx={{ textAlign: 'left', p: 1.5, fontSize: '0.875rem' }}
                >
                  {col}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {loading ? (
              <Box component="tr">
                <Box component="td" colSpan={isAdmin ? 8 : 6} sx={{ p: 2 }}>
                  Loading…
                </Box>
              </Box>
            ) : items.length === 0 ? (
              <Box component="tr">
                <Box component="td" colSpan={isAdmin ? 8 : 6} sx={{ p: 2 }}>
                  No records found.
                </Box>
              </Box>
            ) : (
              items.map((row) => (
                <Box
                  component="tr"
                  key={`${row.recordType}-${row._id}`}
                  sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    {formatDate(row.occurredAt)}
                  </Box>
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    {formatRecordType(row.recordType)}
                  </Box>
                  {isAdmin ? (
                    <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                      {row.centerName || row.centerId}
                    </Box>
                  ) : null}
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    {row.planName || row.method || '—'}
                    {row.note ? (
                      <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                        {row.note}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    <span className="purchase-history__amount">${row.amount.toFixed(2)}</span>
                  </Box>
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    {row.examCredits != null ? (
                      <span className="purchase-history__credits">{row.examCredits}</span>
                    ) : (
                      '—'
                    )}
                  </Box>
                  <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                    <BillingStatusChip status={row.status} recordType={row.recordType} />
                  </Box>
                  {isAdmin ? (
                    <Box component="td" sx={{ p: 1.5, fontSize: '0.875rem' }}>
                      {isPendingPlanPurchase(row) ? (
                        <Button variant="primary" onClick={() => setReviewRow(row)}>
                          Review
                        </Button>
                      ) : (
                        '—'
                      )}
                    </Box>
                  ) : null}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>

      <Box
        className="purchase-history__footer"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: embedded ? 1.5 : 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" className="purchase-history__range">
          {rangeLabel}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>

      {isAdmin ? (
        <ReviewPurchaseDialog
          open={Boolean(reviewPurchase)}
          purchase={reviewPurchase}
          centers={reviewCenters}
          loading={reviewing}
          onClose={() => setReviewRow(null)}
          onConfirm={handleReviewConfirm}
        />
      ) : null}
    </Box>
  )
}
