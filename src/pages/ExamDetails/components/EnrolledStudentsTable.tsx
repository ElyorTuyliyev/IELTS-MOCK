import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation } from '@apollo/client/react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ROUTES_PATH } from '../../../routes/paths'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { useToast } from '../../../components/common/Toast'
import { REMOVE_STUDENT_EXAM_MUTATION } from '../api/queries'
import type { StudentExam, User } from '../api'
import { AssignQuestionsModal } from './AssignQuestionsModal'

type EnrolledRow = {
  id: string
  serial: number
  fullName: string
  startedAt: string
  progress: string
  overallScore: string
  studentId: string
  examId: string
  questionIds: string[]
  isReleased: boolean
  isCompleted: boolean
}

type EnrolledStudentsTableProps = {
  examId: string
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
  const [pendingDelete, setPendingDelete] = useState<EnrolledRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [assignRow, setAssignRow] = useState<EnrolledRow | null>(null)

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

  const handleOpenAssign = useCallback((row: EnrolledRow) => {
    setAssignRow(row)
  }, [])

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
      { field: 'startedAt', headerName: 'Started at', flex: 0.7, minWidth: 140 },
      { field: 'progress', headerName: 'Status', flex: 0.7, minWidth: 130 },
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
        width: 110,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 0.75 }}>
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
              >
                <AssignQuestionsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleRequestDelete, handleOpenAssign, isArchived],
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
        progress: item.isCompleted
          ? `Completed${item.completedAt ? ` · ${formatShortDate(item.completedAt)}` : ''}`
          : item.isReleased
            ? 'In progress'
            : 'Not started',
        overallScore: formatOverallScore(item),
        studentId: item.studentId,
        examId: item.examId,
        questionIds: item.questionIds ?? [],
        isReleased: Boolean(item.isReleased),
        isCompleted: Boolean(item.isCompleted),
      }
    })
  }, [examId, studentExams, users])

  return (
    <Box className="exam-details__card">
      <Typography className="exam-details__card-title">Enrolled students</Typography>
      <Typography className="exam-details__card-sub">
        Students currently assigned to this exam.
      </Typography>

      <Box className="exam-details__grid-wrap">
        <DataGrid
          rows={rows}
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
          localeText={{ noRowsLabel: 'No students have been added to this exam yet.' }}
        />
      </Box>

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
