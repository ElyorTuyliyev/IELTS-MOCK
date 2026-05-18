import { useCallback, useMemo, useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { Box, Chip, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import type { Exam, StudentExam } from '../api'
import { START_STUDENT_EXAM_MUTATION } from '../api/queries'
import { formatShortDate } from '../../../helpers/dateFormat'
import { formatPriceInSom } from '../../../utils/priceFormat'

type ExamInfoCardProps = {
  exam: Exam
  studentExams?: StudentExam[]
  isArchived?: boolean
  canStart?: boolean
  onExamStarted?: () => void
}

function getPendingStartIds(examId: string, studentExams: StudentExam[]): string[] {
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

  return Array.from(bestByStudent.values())
    .filter((item) => !item.isReleased && !item.isCompleted)
    .map((item) => item._id)
}

const INFO_FIELDS = (exam: Exam) => [
  { label: 'Type', value: exam.examType ?? 'IELTS' },
  { label: 'Examiner', value: exam.examiner },
  { label: 'Date', value: formatShortDate(exam.examDate) },
  { label: 'Time', value: `${exam.startTime} – ${exam.endTime}` },
  { label: 'Price', value: formatPriceInSom(exam.price) },
]

export function ExamInfoCard({
  exam,
  studentExams = [],
  isArchived = false,
  canStart = false,
  onExamStarted,
}: ExamInfoCardProps) {
  const toast = useToast()
  const [starting, setStarting] = useState(false)
  const [startStudentExam] = useMutation<{
    startStudentExam: { _id: string; isReleased: boolean }
  }>(START_STUDENT_EXAM_MUTATION)

  const pendingIds = useMemo(
    () => getPendingStartIds(exam._id, studentExams),
    [exam._id, studentExams],
  )

  const showStartButton = canStart && !isArchived && exam.isActive && pendingIds.length > 0

  const handleStartAll = useCallback(async () => {
    if (starting || pendingIds.length === 0) return
    setStarting(true)
    let started = 0
    let failed = 0

    try {
      for (const id of pendingIds) {
        try {
          const res = await startStudentExam({ variables: { _id: id } })
          if (res.error || !res.data?.startStudentExam?._id) {
            failed += 1
          } else {
            started += 1
          }
        } catch {
          failed += 1
        }
      }

      onExamStarted?.()

      if (started > 0 && failed === 0) {
        toast.success(
          started === 1 ? 'Exam started for 1 student.' : `Exam started for ${started} students.`,
        )
      } else if (started > 0) {
        toast.warning(`Started for ${started} student(s). ${failed} failed.`)
      } else {
        toast.error('Could not start the exam for students.')
      }
    } finally {
      setStarting(false)
    }
  }, [onExamStarted, pendingIds, startStudentExam, starting, toast])

  return (
    <Box className="exam-details__card">
      <Box className="exam-details__info-header">
        <Typography className="exam-details__card-title">{exam.title}</Typography>
        <Box className="exam-details__info-header-actions">
          {showStartButton && (
            <Button
              size="sm"
              variant="primary"
              className="exam-details__start-exam-btn"
              disabled={starting}
              onClick={() => void handleStartAll()}
            >
              {starting ? 'Starting...' : 'Start exam'}
            </Button>
          )}
          <Chip
            className="exam-details__status-chip"
            label={exam.isCompleted ? 'Archived' : exam.isActive ? 'Active' : 'Draft'}
            color={exam.isCompleted ? 'default' : exam.isActive ? 'success' : 'warning'}
            size="small"
          />
        </Box>
      </Box>

      <Box className="exam-details__info-grid">
        {INFO_FIELDS(exam).map((item) => (
          <Box key={item.label} className="exam-details__info-cell">
            <Typography className="exam-details__info-label">{item.label}</Typography>
            <Typography className="exam-details__info-value">{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
