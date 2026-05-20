import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Chip, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ROUTES_PATH } from '../../../routes/paths'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { useToast } from '../../../components/common/Toast'
import { END_STUDENT_EXAM_MUTATION, REMOVE_STUDENT_EXAM_MUTATION } from '../api/queries'
import type { StudentExam, User } from '../api'
import {
  APPROVE_STUDENT_EXAM_WITH_PAYMENT_MUTATION,
  FIND_EXAM_REGISTRATION_PAYMENTS_QUERY,
  type ExamRegistrationPaymentRecord,
} from '../../../features/examPayments/api/examPaymentsQueries'
import { AssignQuestionsModal } from './AssignQuestionsModal'
import { ApproveStudentRegistrationDialog } from './ApproveStudentRegistrationDialog'

type EnrolledRow = {
  id: string
  serial: number
  fullName: string
  startedAt: string
  completedAt: string
  status: 'Pending approval' | 'Approved' | 'In progress' | 'Completed'
  overallScore: string
  studentId: string
  examId: string
  questionIds: string[]
  isReleased: boolean
  isCompleted: boolean
  isApproved: boolean
  paymentStatus: string | null
  paymentId: string | null
}

type EnrolledStudentsTableProps = {
  examId: string
  examPrice?: number
  isArchived?: boolean
  studentExams: StudentExam[]
  users: User[]
  loading: boolean
  error?: { message: string } | null
  onDeleted?: () => void
}
import { formatShortDate } from '../../../helpers/dateFormat'
import { computeOverallModuleScore, formatModuleScore } from '../../../helpers/scores'

function formatOverallScore(item: StudentExam) {
  if (!item.isCompleted) return '-'
  return formatModuleScore(
    computeOverallModuleScore(
      item.listeningScore,
      item.readingScore,
      item.writingScore,
      item.speakingScore,
    ),
  )
}

function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      className="exam-details__action-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </Box>
  )
}

function DeleteIcon() {
  return (
    <ActionIcon>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </ActionIcon>
  )
}

function EndAttemptIcon() {
  return (
    <ActionIcon>
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </ActionIcon>
  )
}

/** Clipboard + lines — assign / change exam questions (not “view only”). */
function AssignQuestionsIcon() {
  return (
    <ActionIcon>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 3h6v4H9z" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </ActionIcon>
  )
}

export function EnrolledStudentsTable({
  examId,
  examPrice = 0,
  isArchived = false,
  studentExams,
  users,
  loading,
  error,
  onDeleted,
}: EnrolledStudentsTableProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const [removeStudentExam] = useMutation<{ removeStudentExam: boolean }>(
    REMOVE_STUDENT_EXAM_MUTATION,
  )
  const [endStudentExam] = useMutation<{
    endStudentExam: { _id: string; isCompleted: boolean }
  }>(END_STUDENT_EXAM_MUTATION)
  const [pendingDelete, setPendingDelete] = useState<EnrolledRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [pendingEnd, setPendingEnd] = useState<EnrolledRow | null>(null)
  const [endLoading, setEndLoading] = useState(false)
  const [assignRow, setAssignRow] = useState<EnrolledRow | null>(null)
  const [tab, setTab] = useState<'approved' | 'pending'>('approved')
  const [pendingApprove, setPendingApprove] = useState<EnrolledRow | null>(null)
  const [approveStudentExamWithPayment, { loading: approving }] = useMutation(
    APPROVE_STUDENT_EXAM_WITH_PAYMENT_MUTATION,
  )

  const { data: paymentsData } = useQuery<{
    findExamRegistrationPayments: ExamRegistrationPaymentRecord[]
  }>(FIND_EXAM_REGISTRATION_PAYMENTS_QUERY)

  const requiresPayment = Number(examPrice) > 0
  const paymentsByStudentExamId = useMemo(() => {
    const map = new Map<string, ExamRegistrationPaymentRecord>()
    for (const payment of paymentsData?.findExamRegistrationPayments ?? []) {
      if (String(payment.examId) === String(examId)) {
        map.set(payment.studentExamId, payment)
      }
    }
    return map
  }, [examId, paymentsData?.findExamRegistrationPayments])

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message)
    }
  }, [error, toast])

  const handleRequestDelete = useCallback(
    (row: EnrolledRow) => {
      if (isArchived) {
        toast.warning('Archived exams cannot remove enrolled students.')
        return
      }
      setPendingDelete(row)
    },
    [isArchived, toast],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return
    setDeleteLoading(true)
    try {
      const res = await removeStudentExam({ variables: { _id: pendingDelete.id } })
      if (res.error || res.data?.removeStudentExam !== true) {
        toast.error(res.error?.message ?? 'Delete failed.')
      } else {
        setPendingDelete(null)
        onDeleted?.()
        toast.success('Student removed from exam.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }, [pendingDelete, removeStudentExam, onDeleted, toast])

  const handleCloseDelete = useCallback(() => {
    if (!deleteLoading) setPendingDelete(null)
  }, [deleteLoading])

  const handleRequestEnd = useCallback(
    (row: EnrolledRow) => {
      if (isArchived) {
        toast.warning('Archived exams cannot end student attempts.')
        return
      }
      setPendingEnd(row)
    },
    [isArchived, toast],
  )

  const handleConfirmEnd = useCallback(async () => {
    if (!pendingEnd) return
    setEndLoading(true)
    try {
      const res = await endStudentExam({ variables: { _id: pendingEnd.id } })
      if (res.error || !res.data?.endStudentExam?._id) {
        toast.error(res.error?.message ?? 'Could not end the student attempt.')
      } else {
        setPendingEnd(null)
        onDeleted?.()
        toast.success(`${pendingEnd.fullName}'s attempt has been ended.`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not end the student attempt.')
    } finally {
      setEndLoading(false)
    }
  }, [endStudentExam, onDeleted, pendingEnd, toast])

  const handleCloseEnd = useCallback(() => {
    if (!endLoading) setPendingEnd(null)
  }, [endLoading])

  const handleOpenAssign = useCallback((row: EnrolledRow) => {
    setAssignRow(row)
  }, [])

  const handleRequestApprove = useCallback((row: EnrolledRow) => {
    setPendingApprove(row)
  }, [])

  const handleConfirmApprove = useCallback(
    async (alsoApprovePayment: boolean) => {
      if (!pendingApprove) return
      try {
        const res = await approveStudentExamWithPayment({
          variables: {
            input: {
              _id: pendingApprove.id,
              alsoApprovePayment,
            },
          },
        })
        if (res.error) {
          toast.error(res.error.message ?? 'Failed to approve registration.')
          return
        }
        toast.success(`${pendingApprove.fullName} approved for this exam.`)
        setPendingApprove(null)
        onDeleted?.()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to approve registration.')
      }
    },
    [approveStudentExamWithPayment, onDeleted, pendingApprove, toast],
  )

  const handleCloseAssign = useCallback(() => {
    setAssignRow(null)
  }, [])

  const handleAssignSaved = useCallback(() => {
    onDeleted?.()
  }, [onDeleted])

  const handleRowClick = useCallback(
    (row: EnrolledRow) => {
      navigate(
        ROUTES_PATH.examStudentReview
          .replace(':examId', examId)
          .replace(':studentExamId', row.id),
      )
    },
    [examId, navigate],
  )

  const columns = useMemo<GridColDef<EnrolledRow>[]>(
    () => [
      { field: 'serial', headerName: '#', width: 70, sortable: false },
      { field: 'fullName', headerName: 'Student', flex: 1, minWidth: 220 },
      { field: 'startedAt', headerName: 'Started', flex: 0.7, minWidth: 130 },
      { field: 'completedAt', headerName: 'Completed', flex: 0.7, minWidth: 130 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 140,
        renderCell: (params) => <Chip size="small" label={params.row.status} />,
      },
      {
        field: 'paymentStatus',
        headerName: 'Payment',
        flex: 0.8,
        minWidth: 150,
        renderCell: (params) => {
          if (!params.row.paymentStatus) {
            return (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )
          }
          const label =
            params.row.paymentStatus === 'pending_approval'
              ? 'Pending'
              : params.row.paymentStatus === 'approved'
                ? 'Approved'
                : 'Rejected'
          const color =
            params.row.paymentStatus === 'approved'
              ? 'success'
              : params.row.paymentStatus === 'rejected'
                ? 'error'
                : 'warning'
          return <Chip size="small" variant="outlined" label={label} color={color} />
        },
      },
      {
        field: 'overallScore',
        headerName: 'Overall',
        width: 90,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <Typography className="exam-details__score-cell exam-details__score-cell--overall">
            {params.row.overallScore}
          </Typography>
        ),
      },
      {
        field: 'actions',
        headerName: 'Action',
        width: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 0.75 }}>
            {params.row.status === 'In progress' ? (
              <Tooltip
                title={
                  isArchived
                    ? 'Archived exams cannot end student attempts'
                    : `End attempt for ${params.row.fullName}`
                }
              >
                <span>
                  <IconButton
                    size="small"
                    className="exam-details__action-btn"
                    aria-label={`End attempt for ${params.row.fullName}`}
                    disabled={isArchived || endLoading}
                    onClick={() => handleRequestEnd(params.row)}
                  >
                    <EndAttemptIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
            <Tooltip
              title={
                isArchived
                  ? 'Archived exams cannot remove enrolled students'
                  : `Remove ${params.row.fullName}`
              }
            >
              <span>
                <IconButton
                  size="small"
                  className="exam-details__action-btn exam-details__action-btn--danger"
                  aria-label={`Delete ${params.row.fullName}`}
                  disabled={isArchived}
                  onClick={() => handleRequestDelete(params.row)}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={`Assign questions for ${params.row.fullName}`}>
              <IconButton
                size="small"
                className="exam-details__action-btn"
                aria-label={`Assign questions for ${params.row.fullName}`}
                onClick={() => handleOpenAssign(params.row)}
                disabled={!params.row.isApproved}
              >
                <AssignQuestionsIcon />
              </IconButton>
            </Tooltip>
            {!params.row.isApproved ? (
              <Tooltip title={`Approve ${params.row.fullName}`}>
                <span>
                  <IconButton
                    size="small"
                    className="exam-details__action-btn"
                    aria-label={`Approve ${params.row.fullName}`}
                    disabled={approving}
                    onClick={() => handleRequestApprove(params.row)}
                  >
                    ✓
                  </IconButton>
                </span>
              </Tooltip>
            ) : null}
          </Box>
        ),
      },
    ],
    [approving, endLoading, handleRequestApprove, handleRequestDelete, handleRequestEnd, handleOpenAssign, isArchived],
  )

  const rows = useMemo(() => {
    const userMap = new Map(users.map((u) => [u._id, u]))
    const forExam = studentExams.filter((item) => String(item.examId) === String(examId))

    const bestByStudent = new Map<string, StudentExam>()
    for (const item of forExam) {
      const prev = bestByStudent.get(item.studentId)
      const itemStarted = item.startedAt ? new Date(item.startedAt).getTime() : 0
      const prevStarted = prev?.startedAt ? new Date(prev.startedAt).getTime() : 0
      if (!prev || itemStarted > prevStarted) {
        bestByStudent.set(item.studentId, item)
      }
    }

    return Array.from(bestByStudent.values()).map((item, index) => {
      const user = userMap.get(item.studentId)
      const released = Boolean(item.isReleased)
      return {
        id: item._id,
        serial: index + 1,
        fullName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown student',
        startedAt: released && item.startedAt ? formatShortDate(item.startedAt) : '-',
        completedAt: item.completedAt ? formatShortDate(item.completedAt) : '-',
        status: (!item.isApproved
          ? 'Pending approval'
          : item.isCompleted
            ? 'Completed'
            : item.isReleased
              ? 'In progress'
              : 'Approved') as EnrolledRow['status'],
        paymentStatus: paymentsByStudentExamId.get(item._id)?.status ?? null,
        paymentId: paymentsByStudentExamId.get(item._id)?._id ?? null,
        overallScore: formatOverallScore(item),
        studentId: item.studentId,
        examId: item.examId,
        questionIds: item.questionIds ?? [],
        isReleased: Boolean(item.isReleased),
        isCompleted: Boolean(item.isCompleted),
        isApproved: Boolean(item.isApproved),
      }
    })
  }, [examId, paymentsByStudentExamId, studentExams, users])

  const visibleRows = useMemo(
    () => rows.filter((row) => (tab === 'pending' ? !row.isApproved : row.isApproved)),
    [rows, tab],
  )

  return (
    <Box className="exam-details__card">
      <Typography className="exam-details__card-title">Enrolled students</Typography>
      <Typography className="exam-details__card-sub">
        Students currently assigned to this exam.
      </Typography>
      <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
        <Tab
          value="approved"
          label={`Approved (${rows.filter((row) => row.isApproved).length})`}
        />
        <Tab
          value="pending"
          label={`Approval required (${rows.filter((row) => !row.isApproved).length})`}
        />
      </Tabs>

      <Box className="exam-details__grid-wrap">
        <DataGrid
          rows={visibleRows}
          columns={columns}
          autoHeight
          loading={loading}
          disableRowSelectionOnClick
          onRowClick={(params, event) => {
            const target = event.target as HTMLElement
            if (target.closest('button')) return
            handleRowClick(params.row)
          }}
          sx={{
            '& .MuiDataGrid-row': { cursor: 'pointer' },
          }}
          slotProps={{
            cell: {
              onMouseDown: (event) => {
                const target = event.target as HTMLElement
                if (target.closest('button')) {
                  event.stopPropagation()
                }
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          localeText={{
            noRowsLabel:
              tab === 'pending'
                ? 'No students are waiting for approval.'
                : 'No approved students in this exam yet.',
          }}
        />
      </Box>

      <ConfirmDialog
        open={Boolean(pendingEnd)}
        title="End student attempt"
        description={
          pendingEnd
            ? `End "${pendingEnd.fullName}"'s in-progress attempt? They will no longer be able to continue this exam, and results will be marked as ready.`
            : undefined
        }
        confirmLabel="End attempt"
        cancelLabel="Cancel"
        confirmColor="warning"
        loading={endLoading}
        onClose={handleCloseEnd}
        onConfirm={handleConfirmEnd}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove student"
        description={
          pendingDelete
            ? `Remove "${pendingDelete.fullName}" from this exam? This cannot be undone.`
            : undefined
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        confirmColor="error"
        loading={deleteLoading}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />

      <ApproveStudentRegistrationDialog
        open={Boolean(pendingApprove)}
        studentName={pendingApprove?.fullName ?? ''}
        showPaymentOption={
          requiresPayment &&
          Boolean(pendingApprove?.paymentId) &&
          pendingApprove?.paymentStatus === 'pending_approval'
        }
        loading={approving}
        onClose={() => {
          if (!approving) setPendingApprove(null)
        }}
        onConfirm={handleConfirmApprove}
      />

      <AssignQuestionsModal
        open={Boolean(assignRow)}
        studentExamId={assignRow?.id ?? ''}
        studentName={assignRow?.fullName ?? ''}
        examId={examId}
        existingQuestionIds={assignRow?.questionIds ?? []}
        onClose={handleCloseAssign}
        onSaved={handleAssignSaved}
      />
    </Box>
  )
}
