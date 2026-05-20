import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { Box, Typography } from '@mui/material'
import type { GridPaginationModel } from '@mui/x-data-grid'

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
import { PaymentsTable } from '../components/PaymentsTable'
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

function filterPendingRows(rows: PendingRow[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.centerName.toLowerCase().includes(q) ||
      row.planName.toLowerCase().includes(q) ||
      (row.centerNote?.toLowerCase().includes(q) ?? false),
  )
}

function filterPaymentRows(rows: PaymentRow[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return rows
  return rows.filter(
    (row) =>
      row.centerName.toLowerCase().includes(q) ||
      row.method.toLowerCase().includes(q) ||
      row.source.toLowerCase().includes(q) ||
      (row.note?.toLowerCase().includes(q) ?? false),
  )
}

export function PaymentsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { tab, setTab } = usePaymentsTab()
  const [search, setSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
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

  const creditBalanceRefetchQueries = [
    'GetAllCenters',
    'MeCenter',
    'MeCenterCredits',
    'MeCenterPlanSummary',
  ] as const

  const [reviewPurchaseMutation, { loading: reviewing }] = useMutation(
    REVIEW_PLAN_PURCHASE_MUTATION,
    { refetchQueries: [...creditBalanceRefetchQueries] },
  )
  const [createPayment, { loading: creatingPayment }] = useMutation(CREATE_PAYMENT_MUTATION, {
    refetchQueries: [...creditBalanceRefetchQueries],
  })
  const [updatePayment, { loading: updatingPayment }] = useMutation(UPDATE_PAYMENT_MUTATION, {
    refetchQueries: [...creditBalanceRefetchQueries],
  })
  const [removePayment, { loading: removingPayment }] = useMutation<{ removePayment: boolean }>(
    REMOVE_PAYMENT_MUTATION,
    { refetchQueries: [...creditBalanceRefetchQueries] },
  )

  const centers = centersData?.findAllCenters ?? []
  const pending = pendingData?.findPendingPlanPurchases ?? []
  const payments = paymentsData?.findAllPayments ?? []

  const totalCredits = useMemo(
    () => payments.reduce((sum, row) => sum + Number(row.examCreditsAdded ?? 0), 0),
    [payments],
  )

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

  const filteredPendingRows = useMemo(
    () => filterPendingRows(pendingRows, search),
    [pendingRows, search],
  )

  const filteredPaymentRows = useMemo(
    () => filterPaymentRows(paymentRows, search),
    [paymentRows, search],
  )

  const refreshAll = useCallback(async () => {
    await Promise.all([refetchPending(), refetchPayments()])
  }, [refetchPending, refetchPayments])

  const handleTabChange = useCallback(
    (nextTab: PaymentsTabKey) => {
      setTab(nextTab)
      setSearch('')
      setPaginationModel((current) => ({ ...current, page: 0 }))
    },
    [setTab],
  )

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
  const isPendingTab = tab === PAYMENTS_TABS.pending
  const activeRows = isPendingTab ? filteredPendingRows : filteredPaymentRows
  const activeLoading = isPendingTab ? pendingLoading : paymentsLoading

  return (
    <Layout>
      <PaymentsPageRoot>
        <Box className="payments-page" sx={{ p: { xs: 2, md: 3 } }}>
          <Box className="payments-page__hero">
            <Box className="payments-page__hero-main">
              <Box className="payments-page__hero-icon" aria-hidden="true">
                <AccountBalanceWalletOutlinedIcon />
              </Box>
              <Box>
                <Typography component="h1" className="payments-page__title">
                  Payments & Billing
                </Typography>
                <Typography component="p" className="payments-page__subtitle">
                  Review plan purchases, record manual payments, and track exam credits across
                  centers.
                </Typography>
              </Box>
            </Box>
            <Box className="payments-page__actions">
              <Button variant="secondary" onClick={() => navigate(ROUTES_PATH.examPlans)}>
                Exam plans
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  setPaymentDialog({ open: true, mode: 'create', payment: null })
                }
              >
                Record payment
              </Button>
            </Box>
          </Box>

          <Box className="payments-page__stats">
            <Box className="payments-page__stat payments-page__stat--pending">
              <span className="payments-page__stat-icon" aria-hidden="true">
                <PendingActionsOutlinedIcon />
              </span>
              <Typography component="p" className="payments-page__stat-label">
                Pending approvals
              </Typography>
              <Typography component="p" className="payments-page__stat-value">
                {pending.length}
              </Typography>
              <Typography component="p" className="payments-page__stat-meta">
                Plan purchase requests
              </Typography>
            </Box>
            <Box className="payments-page__stat payments-page__stat--payments">
              <span className="payments-page__stat-icon" aria-hidden="true">
                <ReceiptLongOutlinedIcon />
              </span>
              <Typography component="p" className="payments-page__stat-label">
                Recorded payments
              </Typography>
              <Typography component="p" className="payments-page__stat-value">
                {payments.length}
              </Typography>
              <Typography component="p" className="payments-page__stat-meta">
                Manual and approved plan payments
              </Typography>
            </Box>
            <Box className="payments-page__stat payments-page__stat--centers">
              <span className="payments-page__stat-icon" aria-hidden="true">
                <BusinessOutlinedIcon />
              </span>
              <Typography component="p" className="payments-page__stat-label">
                Centers
              </Typography>
              <Typography component="p" className="payments-page__stat-value">
                {centers.length}
              </Typography>
              <Typography component="p" className="payments-page__stat-meta">
                Active billing accounts
              </Typography>
            </Box>
            <Box className="payments-page__stat payments-page__stat--credits">
              <span className="payments-page__stat-icon" aria-hidden="true">
                <ConfirmationNumberOutlinedIcon />
              </span>
              <Typography component="p" className="payments-page__stat-label">
                Credits issued
              </Typography>
              <Typography component="p" className="payments-page__stat-value">
                {totalCredits}
              </Typography>
              <Typography component="p" className="payments-page__stat-meta">
                From listed payment records
              </Typography>
            </Box>
          </Box>

          <Box className="payments-page__panel">
            <Box className="payments-page__tabs" role="tablist" aria-label="Payments views">
              <button
                type="button"
                role="tab"
                aria-selected={isPendingTab}
                className={
                  isPendingTab
                    ? 'payments-page__tab payments-page__tab--active'
                    : 'payments-page__tab'
                }
                onClick={() => handleTabChange(PAYMENTS_TABS.pending)}
              >
                Pending approvals
                <span className="payments-page__tab-badge">{pending.length}</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isPendingTab}
                className={
                  !isPendingTab
                    ? 'payments-page__tab payments-page__tab--active'
                    : 'payments-page__tab'
                }
                onClick={() => handleTabChange(PAYMENTS_TABS.payments)}
              >
                Payment records
                <span className="payments-page__tab-badge">{payments.length}</span>
              </button>
            </Box>

            <Box className="payments-page__panel-head">
              <Typography component="h2" className="payments-page__panel-title">
                {isPendingTab ? 'Plan purchase requests' : 'Payment records'}
              </Typography>
              <Typography component="p" className="payments-page__panel-desc">
                {isPendingTab
                  ? 'Approve to add exam credits to the center, or reject to decline the request.'
                  : 'Edit manual payments or delete records. Deleting a manual payment may reverse credits that were added with it.'}
              </Typography>
            </Box>

            <PaymentsTable
              key={tab}
              rows={activeRows}
              columns={isPendingTab ? pendingColumns : paymentColumns}
              loading={activeLoading}
              search={search}
              searchPlaceholder={
                isPendingTab
                  ? 'Search center, plan, or note…'
                  : 'Search center, method, source, or note…'
              }
              resultHint={`${activeRows.length} result${activeRows.length === 1 ? '' : 's'}`}
              emptyLabel={
                isPendingTab
                  ? 'No pending purchase requests.'
                  : 'No payment records yet.'
              }
              paginationModel={paginationModel}
              onSearchChange={(value) => {
                setSearch(value)
                setPaginationModel((current) => ({ ...current, page: 0 }))
              }}
              onPaginationChange={setPaginationModel}
            />
          </Box>
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
