import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { Layout } from '../../components/layout'
import { selectUserRole } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { USER_ROLES } from '../../store/slices/authSlice'
import { FIND_ALL_EXAMS_QUERY } from '../HomePage/api/findAllExamsQuery'

type Exam = {
  _id: string
  title: string
  examiner: string
  examType?: string | null
  examDate: string
  startTime: string
  endTime: string
  price: number
  isActive: boolean
  isCompleted: boolean
}

type FindAllExamsQueryResponse = {
  findAllExams: Exam[]
}

type User = {
  _id: string
  firstName: string
  lastName: string
  role?: string | null
}

type FindAllUsersQueryResponse = {
  findAllUsers: User[]
}

type StudentExam = {
  _id: string
  studentId: string
  examId: string
  startedAt: string
  isCompleted: boolean
}

type FindAllStudentExamsQueryResponse = {
  findAllStudentExams: StudentExam[]
}

type CreateStudentExamMutationResponse = {
  createStudentExam: {
    _id: string
    studentId: string
    examId: string
  }
}

type CreateStudentExamMutationVariables = {
  input: {
    startedAt: string
    studentId: string
    examId: string
  }
}

type LocationState = {
  exam?: Exam
}

const FIND_ALL_USERS_QUERY = gql`
  query FindAllUsers {
    findAllUsers {
      _id
      firstName
      lastName
      role
    }
  }
`

const CREATE_STUDENT_EXAM_MUTATION = gql`
  mutation CreateStudentExam($input: CreateStudentExamInput!) {
    createStudentExam(input: $input) {
      _id
      studentId
      examId
    }
  }
`

const FIND_ALL_STUDENT_EXAMS_QUERY = gql`
  query FindAllStudentExams {
    findAllStudentExams {
      _id
      studentId
      examId
      startedAt
      isCompleted
    }
  }
`

function formatPriceInSom(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${new Intl.NumberFormat('uz-UZ').format(safeValue)} so'm`
}

function formatDate(dateValue: string) {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function ExamDetailsPage() {
  const userRole = useAppSelector(selectUserRole)
  const navigate = useNavigate()
  const { examId } = useParams()
  const location = useLocation()
  const locationState = (location.state as LocationState | null) ?? null
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [enrollError, setEnrollError] = useState<string | null>(null)
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null)

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
  const [createStudentExam, { loading: creatingStudentExam }] = useMutation<
    CreateStudentExamMutationResponse,
    CreateStudentExamMutationVariables
  >(CREATE_STUDENT_EXAM_MUTATION)

  const exam = useMemo(() => {
    const fromState = locationState?.exam
    if (fromState && fromState._id === examId) {
      return fromState
    }
    return (data?.findAllExams ?? []).find((item) => item._id === examId) ?? null
  }, [data?.findAllExams, examId, locationState?.exam])

  const studentOptions = useMemo(
    () =>
      (usersData?.findAllUsers ?? []).filter(
        (user) => (user.role ?? '').toLowerCase() === USER_ROLES.student,
      ),
    [usersData?.findAllUsers],
  )

  const canAssignStudents =
    userRole === USER_ROLES.center || userRole === USER_ROLES.superAdmin

  const enrolledRows = useMemo(() => {
    if (!exam?._id) {
      return []
    }
    const userMap = new Map((usersData?.findAllUsers ?? []).map((user) => [user._id, user]))
    return (studentExamsData?.findAllStudentExams ?? [])
      .filter((item) => item.examId === exam._id)
      .map((item, index) => {
        const user = userMap.get(item.studentId)
        return {
          id: item._id,
          serial: index + 1,
          fullName: user ? `${user.firstName} ${user.lastName}`.trim() : 'Unknown student',
          startedAt: formatDate(item.startedAt),
          progress: item.isCompleted ? 'Completed' : 'In progress',
        }
      })
  }, [exam?._id, studentExamsData?.findAllStudentExams, usersData?.findAllUsers])

  const enrolledColumns: GridColDef<(typeof enrolledRows)[number]>[] = [
    { field: 'serial', headerName: '#', width: 70, sortable: false },
    { field: 'fullName', headerName: 'Student', flex: 1, minWidth: 220 },
    { field: 'startedAt', headerName: 'Started at', flex: 0.7, minWidth: 140 },
    { field: 'progress', headerName: 'Status', flex: 0.7, minWidth: 130 },
  ]

  const handleAssignStudent = async () => {
    if (!exam?._id || !selectedStudentId) {
      setEnrollError('Student tanlang.')
      return
    }

    try {
      setEnrollError(null)
      setEnrollSuccess(null)
      const result = await createStudentExam({
        variables: {
          input: {
            startedAt: new Date().toISOString(),
            studentId: selectedStudentId,
            examId: exam._id,
          },
        },
      })
      if (result.error) {
        setEnrollError(result.error.message ?? "Studentni examga qo'shib bo'lmadi.")
        return
      }
      setEnrollSuccess("Student examga muvaffaqiyatli qo'shildi.")
      setSelectedStudentId('')
      await refetchStudentExams()
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : "Studentni examga qo'shib bo'lmadi.")
    }
  }

  return (
    <Layout>
      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            background:
              'radial-gradient(circle at 12% 18%, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0) 40%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            boxShadow: '0 14px 30px rgba(99, 102, 241, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography component="h1" sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
                Exam Details
              </Typography>
              <Typography sx={{ color: '#64748b', mt: 0.5 }}>
                Exam ma'lumotlari, student biriktirish va progress monitoring.
              </Typography>
            </Box>
            <Button variant="outlined" type="button" onClick={() => navigate(-1)} sx={{ borderRadius: 2 }}>
              Back
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Paper
            elevation={0}
            sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CircularProgress size={20} />
            <Typography>Loading exam...</Typography>
          </Paper>
        ) : null}

        {error ? <Alert severity="error">{error.message}</Alert> : null}

        {!loading && !error && !exam ? <Alert severity="warning">Exam not found.</Alert> : null}

        {exam ? (
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #dbe2f1',
                background: '#ffffff',
                p: { xs: 2, md: 3 },
                display: 'grid',
                gap: 1.25,
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                <Typography component="h2" sx={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {exam.title}
                </Typography>
                <Chip
                  label={exam.isCompleted ? 'Archived' : exam.isActive ? 'Active' : 'Draft'}
                  color={exam.isCompleted ? 'default' : exam.isActive ? 'success' : 'warning'}
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                  gap: 1.2,
                }}
              >
                {[
                  { label: 'Type', value: exam.examType ?? 'IELTS' },
                  { label: 'Examiner', value: exam.examiner },
                  { label: 'Date', value: formatDate(exam.examDate) },
                  { label: 'Time', value: `${exam.startTime} - ${exam.endTime}` },
                  { label: 'Price', value: formatPriceInSom(exam.price) },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      p: 1.4,
                      borderRadius: 2.5,
                      border: '1px solid #eef2ff',
                      background: '#f8fafc',
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.label}</Typography>
                    <Typography sx={{ mt: 0.35, fontWeight: 700, color: '#0f172a' }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #dbe2f1',
                background: '#ffffff',
                p: { xs: 2, md: 3 },
                display: 'grid',
                gap: 1.5,
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Typography component="h3" sx={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Studentlarni Examga Qo'shish
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                Centerga biriktirilgan studentni tanlang va shu examga qo'shing.
              </Typography>

              {usersError ? <Alert severity="error">{usersError.message}</Alert> : null}
              {enrollError ? <Alert severity="error">{enrollError}</Alert> : null}
              {enrollSuccess ? <Alert severity="success">{enrollSuccess}</Alert> : null}

              {canAssignStudents ? (
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    select
                    label="Student"
                    value={selectedStudentId}
                    onChange={(event) => setSelectedStudentId(event.target.value)}
                    sx={{ minWidth: 320, background: '#fff' }}
                    disabled={usersLoading || creatingStudentExam}
                  >
                    <MenuItem value="">Select student</MenuItem>
                    {studentOptions.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {`${student.firstName} ${student.lastName}`.trim()}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    onClick={() => void handleAssignStudent()}
                    disabled={!selectedStudentId || creatingStudentExam}
                    sx={{
                      height: 56,
                      px: 2.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    {creatingStudentExam ? 'Adding...' : 'Add to exam'}
                  </Button>
                </Box>
              ) : (
                <Alert severity="info">Bu amal faqat center yoki super admin uchun.</Alert>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #dbe2f1',
                background: '#ffffff',
                p: { xs: 2, md: 3 },
                display: 'grid',
                gap: 1.5,
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Typography component="h3" sx={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Qo'shilgan Studentlar
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                Ushbu examga biriktirilgan studentlar ro'yxati.
              </Typography>

              {studentExamsError ? <Alert severity="error">{studentExamsError.message}</Alert> : null}

              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={enrolledRows}
                  columns={enrolledColumns}
                  autoHeight
                  loading={studentExamsLoading || usersLoading}
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                  localeText={{
                    noRowsLabel: "Bu examga hali student qo'shilmagan.",
                  }}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      fontWeight: 700,
                    },
                    '& .MuiDataGrid-cell': {
                      borderColor: '#f1f5f9',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        ) : null}
      </Box>
    </Layout>
  )
}
