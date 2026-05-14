import { useCallback, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import { selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { FIND_ALL_EXAMS_QUERY } from '../../HomePage/api/findAllExamsQuery'
import { ExamDetailsRoot } from './ExamDetailsPage.style'
import {
  FIND_ALL_USERS_QUERY,
  FIND_ALL_STUDENT_EXAMS_QUERY,
  type FindAllExamsQueryResponse,
  type FindAllUsersQueryResponse,
  type FindAllStudentExamsQueryResponse,
  type Exam,
} from '../api'
import { ExamInfoCard, StudentEnrollSection, EnrolledStudentsTable } from '../components'

type LocationState = { exam?: Exam }

export function ExamDetailsPage() {
  const toast = useToast()
  const userRole = useAppSelector(selectUserRole)
  const navigate = useNavigate()
  const { examId } = useParams()
  const location = useLocation()
  const locationState = location.state as LocationState | null

  const { data, loading, error } = useQuery<FindAllExamsQueryResponse>(FIND_ALL_EXAMS_QUERY)
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery<FindAllUsersQueryResponse>(FIND_ALL_USERS_QUERY)
  const {
    data: studentExamsData,
    loading: studentExamsLoading,
    error: studentExamsError,
    refetch: refetchStudentExams,
  } = useQuery<FindAllStudentExamsQueryResponse>(FIND_ALL_STUDENT_EXAMS_QUERY)

  const exam = useMemo(() => {
    const fromState = locationState?.exam
    if (fromState && fromState._id === examId) return fromState
    return (data?.findAllExams ?? []).find((item) => item._id === examId) ?? null
  }, [data?.findAllExams, examId, locationState?.exam])

  const canAssign = userRole === USER_ROLES.center || userRole === USER_ROLES.superAdmin

  const studentOptions = useMemo(() => {
    const students = (usersData?.findAllUsers ?? []).filter(
      (u) => (u.role ?? '').toLowerCase() === USER_ROLES.student,
    )
    if (!exam?._id) return students
    const enrolledIds = new Set(
      (studentExamsData?.findAllStudentExams ?? [])
        .filter((row) => String(row.examId) === String(exam._id))
        .map((row) => row.studentId),
    )
    return students.filter((u) => !enrolledIds.has(u._id))
  }, [exam?._id, studentExamsData?.findAllStudentExams, usersData?.findAllUsers])

  const handleEnrolled = useCallback(() => {
    void refetchStudentExams()
  }, [refetchStudentExams])

  const handleGoBack = useCallback(() => navigate(-1), [navigate])

  useEffect(() => {
    const message = error?.message ?? usersError?.message ?? studentExamsError?.message
    if (message) {
      toast.error(message)
    }
  }, [error, usersError, studentExamsError, toast])

  return (
    <Layout>
      <ExamDetailsRoot>
        <Box className="exam-details__header">
          <Box>
            <Typography className="exam-details__header-title">
              {exam ? exam.title : 'Exam Details'}
            </Typography>
            <Typography className="exam-details__header-sub">
              {exam
                ? `Exam Date: ${new Date(exam.examDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}`
                : 'Exam details, student enrollment, and progress.'}
            </Typography>
          </Box>
          <Button variant="secondary" className="exam-details__back-btn" onClick={handleGoBack}>
            ← Back
          </Button>
        </Box>

        {loading && (
          <Box className="exam-details__loading">
            <CircularProgress size={20} />
            <Typography>Loading exam...</Typography>
          </Box>
        )}

        {!loading && !error && !exam && <Alert severity="warning">Exam not found.</Alert>}

        {exam && (
          <>
            <ExamInfoCard exam={exam} />

            {canAssign ? (
              <StudentEnrollSection
                examId={exam._id}
                isArchived={exam.isCompleted}
                studentOptions={studentOptions}
                usersLoading={usersLoading}
                usersError={usersError ?? null}
                onEnrolled={handleEnrolled}
              />
            ) : (
              <Box className="exam-details__card">
                <Alert severity="info">This action is only available to center admins and super admins.</Alert>
              </Box>
            )}

            <EnrolledStudentsTable
              examId={exam._id}
              studentExams={studentExamsData?.findAllStudentExams ?? []}
              users={usersData?.findAllUsers ?? []}
              loading={studentExamsLoading || usersLoading}
              error={studentExamsError ?? null}
              onDeleted={handleEnrolled}
            />
          </>
        )}
      </ExamDetailsRoot>
    </Layout>
  )
}
