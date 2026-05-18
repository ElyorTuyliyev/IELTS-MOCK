import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import { ROUTES_PATH } from '../../../routes/paths'
import { FIND_ALL_EXAMS_QUERY } from '../../CreateExam/api/findAllExamsQuery'
import { FIND_MY_STUDENT_EXAMS_QUERY, type FindMyStudentExamsResponse } from '../api/findMyStudentExamsQuery'
import { StudentMyExamsPageRoot } from './StudentMyExamsPage.style'

type StudentExamListItem = {
  id: string
  title: string
  scheduleLabel: string
  examStatus: 'active' | 'ended' | 'draft'
  studentCompleted: boolean
  canStart: boolean
}

type FindAllExamsResponse = {
  findAllExams: Array<{
    _id: string
    title: string
    examiner: string
    examDate: string
    startTime: string
    endTime: string
    isActive: boolean
    isCompleted: boolean
  }>
}

function formatSchedule(examDate: string, startTime: string, endTime: string) {
  const parsed = new Date(examDate)
  const dateLabel = Number.isNaN(parsed.getTime())
    ? '—'
    : parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  return `${dateLabel} · ${startTime} – ${endTime}`
}

function getExamStatusLabel(status: StudentExamListItem['examStatus']) {
  if (status === 'active') return 'Active'
  if (status === 'ended') return 'Ended'
  return 'Draft'
}

function getExamStatusClass(status: StudentExamListItem['examStatus']) {
  return `student-exam-card__status student-exam-card__status--${status}`
}

export function StudentMyExamsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { data: examsData, loading: examsLoading, error: examsError } = useQuery<FindAllExamsResponse>(
    FIND_ALL_EXAMS_QUERY,
  )
  const {
    data: enrollmentsData,
    loading: enrollmentsLoading,
    error: enrollmentsError,
  } = useQuery<FindMyStudentExamsResponse>(FIND_MY_STUDENT_EXAMS_QUERY)

  const items = useMemo<StudentExamListItem[]>(() => {
    const exams = examsData?.findAllExams ?? []
    const examsById = new Map(exams.map((exam) => [exam._id, exam]))

    return (enrollmentsData?.findMyStudentExams ?? [])
      .map((enrollment) => {
        const exam = examsById.get(String(enrollment.examId))
        if (!exam) return null

        const studentCompleted = Boolean(enrollment.isCompleted)
        const examStatus: StudentExamListItem['examStatus'] = exam.isCompleted
          ? 'ended'
          : exam.isActive
            ? 'active'
            : 'draft'

        return {
          id: exam._id,
          title: exam.title,
          scheduleLabel: formatSchedule(exam.examDate, exam.startTime, exam.endTime),
          examStatus,
          studentCompleted,
          canStart:
            Boolean(enrollment.isReleased) &&
            exam.isActive &&
            !exam.isCompleted &&
            !studentCompleted,
        }
      })
      .filter((item): item is StudentExamListItem => item != null)
  }, [enrollmentsData?.findMyStudentExams, examsData?.findAllExams])

  const loading = examsLoading || enrollmentsLoading
  const error = examsError ?? enrollmentsError

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message)
    }
  }, [error, toast])

  return (
    <Layout>
      <StudentMyExamsPageRoot>
        <Box className="student-exams-page">
          <Box>
            <Typography component="h1" className="student-exams-page__title">
              My exams
            </Typography>
            <Typography className="student-exams-page__subtitle">
              Choose an active exam and start the test.
            </Typography>
          </Box>

          {loading ? (
            <Typography color="text.secondary">Loading exams...</Typography>
          ) : items.length === 0 ? (
            <Box className="student-exams-page__empty">No exams are assigned to you.</Box>
          ) : (
            <Box className="student-exams-page__grid">
              {items.map((item) => (
                <Box key={item.id} className="student-exam-card">
                  <Typography component="h2" className="student-exam-card__title">
                    {item.title}
                  </Typography>
                  <Typography className="student-exam-card__meta">{item.scheduleLabel}</Typography>
                  <Box className={getExamStatusClass(item.examStatus)}>
                    {getExamStatusLabel(item.examStatus)}
                    {item.studentCompleted ? ' · Completed' : ''}
                  </Box>
                  <Button
                    variant="primary"
                    className="student-exam-card__action"
                    disabled={!item.canStart}
                    onClick={() =>
                      navigate(`${ROUTES_PATH.studentExamPlayer}?examId=${encodeURIComponent(item.id)}`)
                    }
                  >
                    {item.studentCompleted
                      ? 'Submitted'
                      : item.examStatus === 'ended'
                        ? 'Exam ended'
                        : 'Start'}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </StudentMyExamsPageRoot>
    </Layout>
  )
}
