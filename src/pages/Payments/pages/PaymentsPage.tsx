import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { ROUTES_PATH } from '../../../routes/paths'
import {
  CREATE_PAYMENT_MUTATION,
  FIND_ALL_CENTERS_BILLING_QUERY,
  FIND_ALL_PAYMENTS_QUERY,
  FIND_PENDING_PLAN_PURCHASES_QUERY,
  REMOVE_PAYMENT_MUTATION,
  REVIEW_PLAN_PURCHASE_MUTATION,
  UPDATE_PAYMENT_MUTATION,
  type PaymentRecord,
  type PendingPlanPurchase,
} from '../../Billing/api/billingQueries'
import { PaymentFormDialog, type PaymentFormValues } from '../components/PaymentFormDialog'
import { ReviewPurchaseDialog } from '../components/ReviewPurchaseDialog'
import { resolveCenterName } from '../components/paymentUtils'
import {
  createPaymentColumns,
  createPendingColumns,
  type PaymentRow,
  type PendingRow,
} from './PaymentsPage.columns'
import {
  PAYMENTS_TABS,
  usePaymentsTab,
  type PaymentsTabKey,
} from '../hooks/usePaymentsTab'
import { PaymentsPageRoot } from './PaymentsPage.style'

function parseCredits(value: string) {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined
}

export function PaymentsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { tab, setTab } = usePaymentsTab()
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    payment: PaymentRecord | null
  }>({ open: false, mode: 'create', payment: null })
  const [reviewPurchase, setReviewPurchase] = useState<PendingPlanPurchase | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PaymentRecord | null>(null)

  const {
    data: pendingData,
    loading: pendingLoading,
    refetch: refetchPending,
  } = useQuery<{ findPendingPlanPurchases: PendingPlanPurchase[] }>(
    FIND_PENDING_PLAN_PURCHASES_QUERY,
    { fetchPolicy: 'network-only' },
  )

  const {
    data: paymentsData,
    loading: paymentsLoading,
    refetch: refetchPayments,
  } = useQuery<{ findAllPayments: PaymentRecord[] }>(FIND_ALL_PAYMENTS_QUERY, {
    fetchPolicy: 'network-only',
  })

  const { data: centersData } = useQuery<{
    findAllCenters: Array<{ _id: string; name: string }>
  }>(FIND_ALL_CENTERS_BILLING_QUERY)

  const [reviewPurchaseMutation, { loading: reviewing }] = useMutation(REVIEW_PLAN_PURCHASE_MUTATION)
  const [createPayment, { loading: creatingPayment }] = useMutation(CREATE_PAYMENT_MUTATION)
  const [updatePayment, { loading: updatingPayment }] = useMutation(UPDATE_PAYMENT_MUTATION)
  const [removePayment, { loading: removingPayment }] = useMutation<{ removePayment: boolean }>(
    REMOVE_PAYMENT_MUTATION,
  )

  const centers = centersData?.findAllCenters ?? []
  const pending = pendingData?.findPendingPlanPurchases ?? []
  const payments = paymentsData?.findAllPayments ?? []

  const pendingRows = useMemo<PendingRow[]>(
    () =>
      pending.map((item) => ({
        ...item,
        centerName: resolveCenterName(centers, item.centerId),
      })),
    [pending, centers],
  )

  const paymentRows = useMemo<PaymentRow[]>(
    () =>
      [...payments]
        .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
        .map((item) => ({
          ...item,
          centerName: resolveCenterName(centers, item.centerId),
          source: item.planPurchaseId ? 'Plan approval' : 'Manual',
        })),
    [payments, centers],
  )

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchPending(), refetchPayments()])
  }, [refetchPending, refetchPayments])

  const handleReviewConfirm = useCallback(
    async (approve: boolean, adminNote: string) => {
      if (!reviewPurchase) return
      try {
        await reviewPurchaseMutation({
          variables: {
            input: {
              _id: reviewPurchase._id,
              approve,
              adminNote: adminNote.trim() || (approve ? 'Approved' : 'Rejected'),
            },
          },
        })
        toast.success(
          approve ? 'Purchase approved and credits added.' : 'Purchase rejected.',
        )
        setReviewPurchase(null)
        await refreshAll()
      } catch (error) {
        toast.error(getGraphQLErrorMessage(error, 'Could not review purchase.'))
      }
    },
    [reviewPurchase, reviewPurchaseMutation, refreshAll, toast],
  )

  const handlePaymentSubmit = useCallback(
    async (values: PaymentFormValues) => {
      const amount = Number(values.amount)
      const examCreditsAdded = parseCredits(values.examCreditsAdded)
      if (!values.centerId || !Number.isFinite(amount) || amount <= 0) {
        toast.error('Center and amount are required.')
        return
      }

      try {
        if (paymentDialog.mode === 'create') {
          await createPayment({
            variables: {
              centerId: values.centerId,
              amount,
              method: values.method,
              note: values.note.trim() || undefined,
              paidAt: new Date(values.paidAt).toISOString(),
              examCreditsAdded,
            },
          })
          toast.success('Payment recorded.')
        } else if (paymentDialog.payment) {
          await updatePayment({
            variables: {
              _id: paymentDialog.payment._id,
              centerId: values.centerId,
              amount,
              method: values.method,
              note: values.note.trim() || undefined,
              paidAt: new Date(values.paidAt).toISOString(),
              examCreditsAdded: examCreditsAdded ?? 0,
            },
          })
          toast.success('Payment updated.')
        }
        setPaymentDialog({ open: false, mode: 'create', payment: null })
        await refreshAll()
      } catch (error) {
        toast.error(getGraphQLErrorMessage(error, 'Could not save payment.'))
      }
    },
    [createPayment, paymentDialog, refreshAll, toast, updatePayment],
  )

  const handleDeletePayment = useCallback(async () => {
    if (!deleteTarget) return
    try {
      const result = await removePayment({ variables: { _id: deleteTarget._id } })
      if (result.data?.removePayment !== true) {
        toast.error('Delete failed.')
        return
      }
      toast.success('Payment deleted.')
      setDeleteTarget(null)
      await refreshAll()
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, 'Could not delete payment.'))
    }
  }, [deleteTarget, refreshAll, removePayment, toast])

  const pendingColumns = useMemo(
    () => createPendingColumns({ onReview: setReviewPurchase }),
    [],
  )

  const paymentColumns = useMemo(
    () =>
      createPaymentColumns({
        onEdit: (row) =>
          setPaymentDialog({ open: true, mode: 'edit', payment: row }),
        onDelete: setDeleteTarget,
      }),
    [],
  )

  const savingPayment = creatingPayment || updatingPayment

  return (
    <Layout>
      <PaymentsPageRoot>
        <Box className="payments-page" sx={{ p: 3 }}>
          <Box className="payments-page__header" sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Typography className="payments-page__title" variant="h5">
              Payments & Billing
            </Typography>
            <Box className="payments-page__actions">
              <Button variant="secondary" onClick={() => navigate(ROUTES_PATH.examPlans)}>
                Exam plans & history
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setPaymentDialog({ open: true, mode: 'create', payment: null })
                }
              >
                + Record payment
              </Button>
            </Box>
          </Box>

          <Box className="payments-page__stats" sx={{ mb: 3 }}>
            <Box className="payments-page__stat">
              <Typography className="payments-page__stat-label">Pending approvals</Typography>
              <Typography className="payments-page__stat-value">{pending.length}</Typography>
              <Typography className="payments-page__stat-meta">Plan purchase requests</Typography>
            </Box>
            <Box className="payments-page__stat">
              <Typography className="payments-page__stat-label">Recorded payments</Typography>
              <Typography className="payments-page__stat-value">{payments.length}</Typography>
              <Typography className="payments-page__stat-meta">Manual and approved plan payments</Typography>
            </Box>
            <Box className="payments-page__stat">
              <Typography className="payments-page__stat-label">Centers</Typography>
              <Typography className="payments-page__stat-value">{centers.length}</Typography>
              <Typography className="payments-page__stat-meta">Active billing accounts</Typography>
            </Box>
            <Box className="payments-page__stat">
              <Typography className="payments-page__stat-label">Credits issued (page)</Typography>
              <Typography className="payments-page__stat-value">
                {payments.reduce((sum, row) => sum + Number(row.examCreditsAdded ?? 0), 0)}
              </Typography>
              <Typography className="payments-page__stat-meta">From listed payment records</Typography>
            </Box>
          </Box>

          <Tabs
            value={tab}
            onChange={(_event, value) => setTab(value as PaymentsTabKey)}
            sx={{ mb: 2 }}
          >
            <Tab
              value={PAYMENTS_TABS.pending}
              label={`Pending approvals (${pending.length})`}
            />
            <Tab
              value={PAYMENTS_TABS.payments}
              label={`Recorded payments (${payments.length})`}
            />
          </Tabs>

          {tab === PAYMENTS_TABS.pending ? (
            <Box className="payments-page__panel">
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontWeight: 600 }}>Plan purchase requests</Typography>
                <Typography variant="body2" color="text.secondary">
                  Approve to add exam credits to the center, or reject to decline the request.
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={pendingRows}
                  columns={pendingColumns}
                  loading={pendingLoading}
                  autoHeight
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  getRowId={(row) => row._id}
                  sx={{ border: 'none' }}
                  localeText={{
                    noRowsLabel: pendingLoading
                      ? 'Loading…'
                      : 'No pending purchase requests.',
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box className="payments-page__panel">
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ fontWeight: 600 }}>Payment records</Typography>
                <Typography variant="body2" color="text.secondary">
                  Edit manual payments or delete records. Deleting a manual payment reverses
                  credits that were added with it.
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={paymentRows}
                  columns={paymentColumns}
                  loading={paymentsLoading}
                  autoHeight
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                  getRowId={(row) => row._id}
                  sx={{ border: 'none' }}
                  localeText={{
                    noRowsLabel: paymentsLoading ? 'Loading…' : 'No payment records yet.',
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </PaymentsPageRoot>

      <ReviewPurchaseDialog
        open={Boolean(reviewPurchase)}
        purchase={reviewPurchase}
        centers={centers}
        loading={reviewing}
        onClose={() => setReviewPurchase(null)}
        onConfirm={handleReviewConfirm}
      />

      <PaymentFormDialog
        open={paymentDialog.open}
        mode={paymentDialog.mode}
        payment={paymentDialog.payment}
        centers={centers}
        loading={savingPayment}
        onClose={() => setPaymentDialog({ open: false, mode: 'create', payment: null })}
        onSubmit={handlePaymentSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete payment record?"
        description={
          deleteTarget?.planPurchaseId
            ? 'This payment is linked to an approved plan purchase. Deleting it only removes the audit record; credits already granted will stay.'
            : deleteTarget?.examCreditsAdded
              ? `This will remove the payment and subtract ${deleteTarget.examCreditsAdded} exam credit(s) from the center balance.`
              : 'This payment record will be permanently removed.'
        }
        confirmLabel="Delete"
        confirmColor="error"
        loading={removingPayment}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePayment}
      />
    </Layout>
  )
}
