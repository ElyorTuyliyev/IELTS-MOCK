import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Checkbox,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { formatPriceInSom } from '../../../utils/priceFormat'
import { resolveMediaUrl } from '../../AddQuestion/utils'
import { FIND_ALL_USERS_QUERY } from '../../AllStudents/api/findAllUsersQuery'
import { FIND_ALL_EXAMS_QUERY } from '../../CreateExam/api/findAllExamsQuery'
import {
  CENTER_PAYMENT_SETTINGS_QUERY,
  FIND_EXAM_REGISTRATION_PAYMENTS_QUERY,
  REVIEW_EXAM_REGISTRATION_PAYMENT_MUTATION,
  UPDATE_CENTER_PAYMENT_SETTINGS_MUTATION,
  type ExamRegistrationPaymentRecord,
} from '../../../features/examPayments/api/examPaymentsQueries'
import { CenterExamPaymentsPageRoot } from './CenterExamPaymentsPage.style'

type PaymentRow = ExamRegistrationPaymentRecord & {
  studentName: string
  examTitle: string
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString()
}

export function CenterExamPaymentsPage() {
  const toast = useToast()
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [globalInstructions, setGlobalInstructions] = useState('')
  const [savingSettings, setSavingSettings] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<PaymentRow | null>(null)
  const [alsoApproveRegistration, setAlsoApproveRegistration] = useState(true)
  const [adminNote, setAdminNote] = useState('')

  const { data: settingsData, refetch: refetchSettings } = useQuery<{
    centerPaymentSettings: { globalPaymentInstructions?: string | null }
  }>(CENTER_PAYMENT_SETTINGS_QUERY)

  const { data: paymentsData, loading, refetch } = useQuery<{
    findExamRegistrationPayments: ExamRegistrationPaymentRecord[]
  }>(FIND_EXAM_REGISTRATION_PAYMENTS_QUERY, {
    variables: { status: tab === 'pending' ? 'pending_approval' : undefined },
  })

  const { data: studentsData } = useQuery<{
    findAllUsers: Array<{ _id: string; firstName: string; lastName: string }>
  }>(FIND_ALL_USERS_QUERY)

  const { data: examsData } = useQuery<{
    findAllExams: Array<{ _id: string; title: string }>
  }>(FIND_ALL_EXAMS_QUERY)

  const [updateSettings] = useMutation(UPDATE_CENTER_PAYMENT_SETTINGS_MUTATION)
  const [reviewPayment, { loading: reviewing }] = useMutation(
    REVIEW_EXAM_REGISTRATION_PAYMENT_MUTATION,
  )

  useEffect(() => {
    setGlobalInstructions(settingsData?.centerPaymentSettings?.globalPaymentInstructions ?? '')
  }, [settingsData?.centerPaymentSettings?.globalPaymentInstructions])

  const rows = useMemo<PaymentRow[]>(() => {
    const studentMap = new Map(
      (studentsData?.findAllUsers ?? []).map((u) => [
        u._id,
        `${u.firstName} ${u.lastName}`.trim(),
      ]),
    )
    const examMap = new Map(
      (examsData?.findAllExams ?? []).map((e) => [e._id, e.title]),
    )

    return (paymentsData?.findExamRegistrationPayments ?? []).map((payment) => ({
      ...payment,
      studentName: studentMap.get(payment.studentId) ?? 'Unknown student',
      examTitle: examMap.get(payment.examId) ?? 'Unknown exam',
    }))
  }, [examsData?.findAllExams, paymentsData?.findExamRegistrationPayments, studentsData?.findAllUsers])

  const saveGlobalInstructions = useCallback(async () => {
    setSavingSettings(true)
    try {
      const result = await updateSettings({
        variables: {
          input: { globalPaymentInstructions: globalInstructions.trim() },
        },
      })
      if (result.error) {
        toast.error(result.error.message ?? 'Failed to save payment instructions.')
        return
      }
      toast.success('Global payment instructions saved.')
      await refetchSettings()
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err, 'Failed to save payment instructions.'))
    } finally {
      setSavingSettings(false)
    }
  }, [globalInstructions, refetchSettings, toast, updateSettings])

  const handleReview = useCallback(
    async (approve: boolean) => {
      if (!reviewTarget) return
      try {
        const result = await reviewPayment({
          variables: {
            input: {
              _id: reviewTarget._id,
              approve,
              alsoApproveRegistration: approve ? alsoApproveRegistration : false,
              adminNote: adminNote.trim() || undefined,
            },
          },
        })
        if (result.error) {
          toast.error(result.error.message ?? 'Failed to review payment.')
          return
        }
        toast.success(approve ? 'Payment approved.' : 'Payment rejected.')
        setReviewTarget(null)
        setAdminNote('')
        await refetch()
      } catch (err) {
        toast.error(getGraphQLErrorMessage(err, 'Failed to review payment.'))
      }
    },
    [adminNote, alsoApproveRegistration, refetch, reviewPayment, reviewTarget, toast],
  )

  const columns = useMemo<GridColDef<PaymentRow>[]>(
    () => [
      { field: 'studentName', headerName: 'Student', flex: 1, minWidth: 160 },
      { field: 'examTitle', headerName: 'Exam', flex: 1, minWidth: 160 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 130,
        valueFormatter: (value) => formatPriceInSom(Number(value)),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: ({ row }) => (
          <Chip
            size="small"
            label={row.status === 'pending_approval' ? 'Pending approval' : row.status}
            color={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'error' : 'warning'}
          />
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Submitted',
        width: 170,
        valueFormatter: (value) => formatDate(String(value)),
      },
      {
        field: 'actions',
        headerName: 'Action',
        width: 120,
        sortable: false,
        renderCell: ({ row }) =>
          row.status === 'pending_approval' ? (
            <Button variant="secondary" onClick={() => setReviewTarget(row)}>
              Review
            </Button>
          ) : (
            '—'
          ),
      },
    ],
    [],
  )

  return (
    <Layout>
      <CenterExamPaymentsPageRoot>
        <Typography component="h1" className="center-payments-page__title">
          Exam payments
        </Typography>
        <Typography className="center-payments-page__subtitle">
          Manage global payment instructions and review student exam registration payments.
        </Typography>

        <Box className="center-payments-page__settings-card">
          <Typography className="center-payments-page__card-title">
            Global payment instructions
          </Typography>
          <Typography className="center-payments-page__card-sub">
            Used by default for all paid exams. Exams can override with custom instructions.
          </Typography>
          <TextField
            label="Payment instructions"
            placeholder="Bank name, account number, payment reference format..."
            value={globalInstructions}
            onChange={(e) => setGlobalInstructions(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="primary" disabled={savingSettings} onClick={() => void saveGlobalInstructions()}>
              {savingSettings ? 'Saving...' : 'Save global instructions'}
            </Button>
          </Box>
        </Box>

        <Box className="center-payments-page__table-card">
          <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
            <Tab value="pending" label="Pending approval" />
            <Tab value="all" label="All payments" />
          </Tabs>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row._id}
            autoHeight
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          />
        </Box>
      </CenterExamPaymentsPageRoot>

      <Dialog open={Boolean(reviewTarget)} onClose={reviewing ? undefined : () => setReviewTarget(null)} fullWidth maxWidth="sm">
        <DialogTitle>Review payment</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          {reviewTarget ? (
            <>
              <Typography variant="body2">
                <strong>{reviewTarget.studentName}</strong> · {reviewTarget.examTitle}
              </Typography>
              <Typography variant="body2">Amount: {formatPriceInSom(reviewTarget.amount)}</Typography>
              {reviewTarget.studentNote ? (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Student note
                  </Typography>
                  <Typography variant="body2">{reviewTarget.studentNote}</Typography>
                </Box>
              ) : null}
              {reviewTarget.proofImageUrl ? (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment proof
                  </Typography>
                  <Box
                    component="img"
                    src={resolveMediaUrl(reviewTarget.proofImageUrl) ?? ''}
                    alt="Payment proof"
                    sx={{ maxWidth: '100%', borderRadius: 2, mt: 1 }}
                  />
                </Box>
              ) : null}
              <Divider />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={alsoApproveRegistration}
                    onChange={(e) => setAlsoApproveRegistration(e.target.checked)}
                  />
                }
                label="Also approve student's exam registration"
              />
              <TextField
                label="Admin note (optional)"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button variant="secondary" disabled={reviewing} onClick={() => setReviewTarget(null)}>
            Cancel
          </Button>
          <Button variant="secondary" disabled={reviewing} onClick={() => void handleReview(false)}>
            Reject
          </Button>
          <Button variant="primary" disabled={reviewing} onClick={() => void handleReview(true)}>
            Approve payment
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}
