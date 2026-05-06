import { Global } from '@emotion/react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { agentLog } from '../../utils/agentLog'
import { selectAuthToken, selectUserRole } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { USER_ROLES } from '../../store/slices/authSlice'
import { CREATE_STUDENT_MUTATION } from './api/createStudentMutation'
import { DELETE_STUDENT_MUTATION } from './api/deleteStudentMutation'
import { FIND_ALL_USERS_QUERY } from './api/findAllUsersQuery'
import { UPDATE_STUDENT_MUTATION } from './api/updateStudentMutation'
import { createStudentColumnsWithActions } from './AllStudentsPage.columns'
import { STUDENTS, type StudentLevelTone, type StudentRow } from './AllStudentsPage.constants'
import {
  AllStudentsPageRoot,
  allStudentsModalGlobalStyles,
} from './AllStudentsPage.style'

const levelTones: StudentLevelTone[] = ['orange', 'teal', 'pink', 'yellow', 'blue']
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

function decodeJwtPayload(token: string | null): Record<string, unknown> | null {
  if (!token) {
    return null
  }

  const tokenParts = token.split('.')
  if (tokenParts.length < 2) {
    return null
  }

  try {
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

type CreateStudentMutationResponse = {
  createUser: {
    _id: string
    firstName: string
    lastName: string
    email: string
    birthday?: string | null
    gender?: string | null
    phone?: string | null
    role: string | null
    centerId?: string | null
    createdAt?: string
  } | null
}

type CreateStudentMutationVariables = {
  firstName: string
  lastName: string
  email: string
  birthday?: string
  gender?: string
  password: string
  phone?: string
  centerId?: string
}

type UpdateStudentMutationResponse = {
  updateUser: {
    _id: string
    birthday?: string | null
    gender?: string | null
    role?: string | null
  } | null
}

type UpdateStudentMutationVariables = {
  _id: string
  firstName?: string
  lastName?: string
  email?: string
  birthday?: string
  gender?: string
  password?: string
  phone?: string
  role?: string
  centerId?: string
}

type DeleteStudentMutationResponse = {
  removeUser: boolean | null
}

type DeleteStudentMutationVariables = {
  _id: string
}

type FindAllUsersQueryResponse = {
  findAllUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
    birthday?: string | null
    gender?: string | null
    phone?: string | null
    role?: string | null
    centerId?: string | null
    createdAt: string
  }>
}

function HeadActionIcon({
  children,
}: {
  children: ReactNode
}) {
  return <Box component="span" className="students-page__button-icon">{children}</Box>
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AllStudentsPage() {
  const authToken = useAppSelector(selectAuthToken)
  const currentRole = useAppSelector(selectUserRole)
  const [studentRows, setStudentRows] = useState<StudentRow[]>(STUDENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name' | 'Creation date'>('Name')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentFirstName, setStudentFirstName] = useState('')
  const [studentLastName, setStudentLastName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentBirthday, setStudentBirthday] = useState('')
  const [studentGender, setStudentGender] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [createStudent, { loading: isCreatingStudent }] = useMutation<
    CreateStudentMutationResponse,
    CreateStudentMutationVariables
  >(CREATE_STUDENT_MUTATION)
  const [updateStudent, { loading: isUpdatingStudent }] = useMutation<
    UpdateStudentMutationResponse,
    UpdateStudentMutationVariables
  >(UPDATE_STUDENT_MUTATION)
  const [deleteStudent, { loading: isDeletingStudent }] = useMutation<
    DeleteStudentMutationResponse,
    DeleteStudentMutationVariables
  >(DELETE_STUDENT_MUTATION)
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } =
    useQuery<FindAllUsersQueryResponse>(FIND_ALL_USERS_QUERY)

  const resetStudentModal = () => {
    setStudentFirstName('')
    setStudentLastName('')
    setStudentEmail('')
    setStudentBirthday('')
    setStudentGender('')
    setStudentPhone('')
    setStudentPassword('')
    setEditingStudentId(null)
    setFormError('')
  }

  const closeStudentModal = () => {
    setIsAddStudentOpen(false)
    resetStudentModal()
  }

  const handleEditStudent = useCallback(
    (row: StudentRow) => {
      const sourceUser = (usersData?.findAllUsers ?? []).find((user) => user._id === row.userId)
      const [firstNameRaw, ...lastNameParts] = row.name.split(/\s+/).filter(Boolean)
      setStudentFirstName(firstNameRaw ?? '')
      setStudentLastName(lastNameParts.join(' '))
      setStudentEmail(row.email === '-' ? '' : row.email)
      setStudentBirthday(sourceUser?.birthday ? sourceUser.birthday.slice(0, 10) : '')
      setStudentGender(sourceUser?.gender ?? '')
      setStudentPhone(sourceUser?.phone ?? '')
      setStudentPassword('')
      setEditingStudentId(row.userId)
      setFormError('')
      setIsAddStudentOpen(true)
    },
    [usersData],
  )

  const handleDeleteStudent = useCallback(
    async (row: StudentRow) => {
      if (!row.userId || isDeletingStudent) {
        return
      }
      try {
        const result = await deleteStudent({
          variables: { _id: row.userId },
        })
        if (!result.data?.removeUser) {
          setFormError(result.error?.message ?? 'Could not delete student.')
          return
        }
        await refetchUsers()
      } catch (error) {
        setFormError(error instanceof Error ? error.message : 'Could not delete student.')
      }
    },
    [deleteStudent, isDeletingStudent, refetchUsers],
  )

  const handleSaveStudent = async () => {
    const trimmedFirstName = studentFirstName.trim()
    const trimmedLastName = studentLastName.trim()
    const normalizedEmail = studentEmail.trim().toLowerCase()
    const normalizedBirthday = studentBirthday.trim()
    const normalizedGender = studentGender.trim().toLowerCase()
    const normalizedPhone = studentPhone.trim()
    const trimmedPassword = studentPassword.trim()
    const normalizedBirthdayIso = normalizedBirthday
      ? new Date(`${normalizedBirthday}T00:00:00.000Z`).toISOString()
      : ''
    const tokenPayload = decodeJwtPayload(authToken)
    const centerIdFromToken = [
      tokenPayload?.centerId,
      tokenPayload?.center_id,
      tokenPayload?.['center'] && typeof tokenPayload.center === 'object'
        ? (tokenPayload.center as Record<string, unknown>)?._id
        : null,
    ]
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
      .find((value) => OBJECT_ID_PATTERN.test(value))
    const normalizedCenterId = currentRole === USER_ROLES.center ? centerIdFromToken ?? '' : ''

    if (!trimmedFirstName || !trimmedLastName || !normalizedEmail || (!editingStudentId && !trimmedPassword)) {
      setFormError(
        editingStudentId
          ? 'Student yangilash uchun first name, last name va gmail majburiy.'
          : 'Student yaratish uchun first name, last name, gmail va password majburiy.',
      )
      return
    }

    if (trimmedPassword && trimmedPassword.length < 6) {
      setFormError("Password kamida 6 ta belgidan iborat bo'lishi kerak.")
      return
    }

    if (currentRole === USER_ROLES.center && !normalizedCenterId) {
      setFormError('Center profiling topilmadi. Qayta login qilib urinib ko‘ring.')
      return
    }

    setFormError('')

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'AllStudentsPage.tsx:handleSaveStudent',
      message: editingStudentId
        ? 'Update student submit payload snapshot'
        : 'Create student submit payload snapshot',
      data: {
        firstNameLength: trimmedFirstName.length,
        lastNameLength: trimmedLastName.length,
        emailLength: normalizedEmail.length,
        birthdayLength: normalizedBirthday.length,
        hasGender: Boolean(normalizedGender),
        phoneLength: normalizedPhone.length,
        passwordLength: trimmedPassword.length,
        centerIdFromToken: centerIdFromToken ?? null,
        hasValidCenterId: Boolean(normalizedCenterId),
        currentRole,
      },
    })

    try {
      const result = editingStudentId
        ? await updateStudent({
            variables: {
              _id: editingStudentId,
              firstName: trimmedFirstName,
              lastName: trimmedLastName,
              email: normalizedEmail,
              ...(normalizedBirthdayIso ? { birthday: normalizedBirthdayIso } : {}),
              ...(normalizedGender ? { gender: normalizedGender } : {}),
              ...(trimmedPassword ? { password: trimmedPassword } : {}),
              ...(normalizedPhone ? { phone: normalizedPhone } : {}),
              ...(normalizedCenterId ? { centerId: normalizedCenterId } : {}),
              role: 'student',
            },
          })
        : await createStudent({
            variables: {
              firstName: trimmedFirstName,
              lastName: trimmedLastName,
              email: normalizedEmail,
              ...(normalizedBirthdayIso ? { birthday: normalizedBirthdayIso } : {}),
              ...(normalizedGender ? { gender: normalizedGender } : {}),
              password: trimmedPassword,
              ...(normalizedPhone ? { phone: normalizedPhone } : {}),
              ...(normalizedCenterId ? { centerId: normalizedCenterId } : {}),
            },
          })

      const createdStudent = editingStudentId
        ? (result.data as UpdateStudentMutationResponse | null)?.updateUser ?? null
        : (result.data as CreateStudentMutationResponse | null)?.createUser ?? null
      const apolloErrorMessage = result.error?.message ?? null

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H2',
        location: 'AllStudentsPage.tsx:handleSaveStudent',
        message: editingStudentId
          ? 'Update student mutation result snapshot'
          : 'Create student mutation result snapshot',
        data: {
          hasCreateUserData: Boolean(createdStudent),
          createdStudentId: createdStudent?._id ?? null,
          returnedRole: createdStudent?.role ?? 'student',
          hasApolloError: Boolean(result.error),
          apolloErrorMessage,
          mode: editingStudentId ? 'update' : 'create',
        },
      })

      if (!createdStudent?._id) {
        setFormError(
          apolloErrorMessage ??
            (editingStudentId
              ? "Student yangilashda xatolik bo'ldi."
              : "Student yaratishda xatolik bo'ldi."),
        )
        return
      }

      await refetchUsers()
      closeStudentModal()
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : editingStudentId
            ? 'Student yangilashda kutilmagan xatolik.'
            : 'Student yaratishda kutilmagan xatolik.',
      )
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'AllStudentsPage.tsx:handleSaveStudent',
        message: editingStudentId
          ? 'Update student mutation threw exception'
          : 'Create student mutation threw exception',
        data: {
          errorMessage: error instanceof Error ? error.message : 'unknown-error',
        },
      })
    }
  }

  useEffect(() => {
    const serverUsers = usersData?.findAllUsers ?? []
    const studentUsers = serverUsers.filter((user) => user.role === 'student')
    const mappedStudents: StudentRow[] = studentUsers.map((user, index) => {
      const fullName = `${user.firstName} ${user.lastName}`.trim()

      return {
        userId: user._id,
        serial: String(index + 1).padStart(2, '0'),
        name: fullName || 'Student',
        email: user.email ?? '-',
        points: '00/100',
        creationDate: new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        status: 'Active',
        levelTone: levelTones[index % levelTones.length],
      }
    })
    setStudentRows(mappedStudents)

    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H3',
      location: 'AllStudentsPage.tsx:usersDataEffect',
      message: 'Hydrated students from backend query',
      data: {
        serverUsersCount: serverUsers.length,
        studentUsersCount: studentUsers.length,
        mappedStudentsCount: mappedStudents.length,
        mappedStudentsWithEmailCount: mappedStudents.filter((student) => student.email !== '-').length,
      },
    })
  }, [usersData])

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleStudents = studentRows.filter((student) => {
      return (
        normalizedSearch.length === 0 ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        student.status.toLowerCase().includes(normalizedSearch)
      )
    })

    return [...visibleStudents].sort((left, right) => {
      if (sortOption === 'Creation date') {
        return left.serial.localeCompare(right.serial)
      }

      return left.name.localeCompare(right.name)
    })
  }, [searchTerm, sortOption, studentRows])

  const rows = useMemo(
    () =>
      filteredStudents.map((student, index) => ({
        id: student.userId || `${student.serial}-${student.name}-${index}`,
        ...student,
      })),
    [filteredStudents],
  )

  const columns = useMemo(
    () =>
      createStudentColumnsWithActions({
        onDelete: handleDeleteStudent,
        onEdit: handleEditStudent,
      }),
    [handleDeleteStudent, handleEditStudent],
  )

  return (
    <Layout>
      <Global styles={allStudentsModalGlobalStyles} />
      <AllStudentsPageRoot>
        <Box className="students-page">
          <Box className="students-page__head">
            <Typography component="h1" className="students-page__title">
              All Students
            </Typography>

            <Box className="students-page__head-actions">
              <Button className="students-page__utility-button" variant="outlined">
                <HeadActionIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.6 13.4L13.4 10.6M8.2 15.8L5.8 18.2C4.3 19.7 1.9 19.7 0.4 18.2C-1.1 16.7 -1.1 14.3 0.4 12.8L4.2 9C5.7 7.5 8.1 7.5 9.6 9"
                      transform="translate(4 3)"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.8 8.2L18.2 5.8C19.7 4.3 19.7 1.9 18.2 0.4C16.7 -1.1 14.3 -1.1 12.8 0.4L9 4.2C7.5 5.7 7.5 8.1 9 9.6"
                      transform="translate(4 3)"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </HeadActionIcon>
                Login page
              </Button>
              <Button className="students-page__utility-button" variant="outlined">
                <HeadActionIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3.5" y="4.5" width="17" height="15" rx="4" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M9 9H15M12 9V15"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </HeadActionIcon>
                Login fields
              </Button>
              <Button
                className="students-page__primary-button"
                variant="contained"
                onClick={() => {
                  resetStudentModal()
                  setIsAddStudentOpen(true)
                }}
              >
                <HeadActionIcon>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </HeadActionIcon>
                Add New Student
              </Button>
            </Box>
          </Box>

          <Box className="students-table">
            <Box className="students-table__filters">
              <TextField
                className="students-table__search"
                type="search"
                placeholder="Search..."
                aria-label="Search students"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="students-table__search-icon">⌕</Box>
                      </InputAdornment>
                    ),
                  },
                }}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPaginationModel((currentState) => ({
                    ...currentState,
                    page: 0,
                  }))
                }}
              />

              <Box className="students-table__actions">
                <TextField
                  select
                  className="students-table__select"
                  aria-label="Sort students"
                  value={sortOption}
                  onChange={(event) => {
                    setSortOption(event.target.value as 'Name' | 'Creation date')
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: 0,
                    }))
                  }}
                >
                  <MenuItem value="Name">Name</MenuItem>
                  <MenuItem value="Creation date">Creation date</MenuItem>
                </TextField>

                <Button className="students-table__ghost-button" variant="outlined">
                  Display columns
                </Button>
              </Box>
            </Box>

            <Box className="students-table__grid-wrap">
              <DataGrid
                rows={rows}
                columns={columns}
                loading={usersLoading}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[8, 10, 25, 50]}
                disableRowSelectionOnClick
                rowHeight={72}
                columnHeaderHeight={54}
                localeText={{
                  noRowsLabel: 'No students matched the current search.',
                }}
                sx={{
                  border: 0,
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #dbe2f1',
                  },
                }}
              />
            </Box>
          </Box>

          <Dialog
            open={isAddStudentOpen}
            onClose={closeStudentModal}
            maxWidth="sm"
            fullWidth
            className="students-modal"
            slotProps={{
              paper: {
                className: 'students-modal__paper',
              },
              backdrop: {
                className: 'students-modal__backdrop',
              },
            }}
          >
            <Box className="students-modal__header">
              <Typography component="h2" className="students-modal__title">
                {editingStudentId ? 'Update Student' : 'Add Students'}
              </Typography>

              <IconButton
                className="students-modal__close"
                aria-label="Close add students modal"
                onClick={closeStudentModal}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent className="students-modal__body">
              {formError ? <Alert severity="error">{formError}</Alert> : null}
              <Box className="students-modal__field">
                <label className="students-modal__label">First Name</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter first name"
                  value={studentFirstName}
                  onChange={(event) => setStudentFirstName(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Last Name</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter last name"
                  value={studentLastName}
                  onChange={(event) => setStudentLastName(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Gmail</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter gmail"
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Birthday</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  type="date"
                  value={studentBirthday}
                  onChange={(event) => setStudentBirthday(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Gender</label>
                <TextField
                  select
                  fullWidth
                  className="students-modal__control"
                  value={studentGender}
                  onChange={(event) => setStudentGender(event.target.value)}
                >
                  <MenuItem value="">Select gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </TextField>
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Phone</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="998901234567"
                  value={studentPhone}
                  onChange={(event) => setStudentPhone(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Password</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  type="password"
                  placeholder="Enter password"
                  value={studentPassword}
                  onChange={(event) => setStudentPassword(event.target.value)}
                />
              </Box>

            </DialogContent>

            <Box className="students-modal__footer">
              <Button
                className="students-modal__cancel"
                variant="outlined"
                onClick={closeStudentModal}
              >
                Cancel
              </Button>
              <Button
                className="students-modal__save"
                variant="contained"
                onClick={handleSaveStudent}
                disabled={isCreatingStudent || isUpdatingStudent}
              >
                {isCreatingStudent || isUpdatingStudent
                  ? 'Saving...'
                  : editingStudentId
                    ? 'Update'
                    : 'Save'}
              </Button>
            </Box>
          </Dialog>
        </Box>
      </AllStudentsPageRoot>
    </Layout>
  )
}
