import { Global } from '@emotion/react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import { CREATE_STUDENT_MUTATION } from './api/createStudentMutation'
import { FIND_ALL_USERS_QUERY } from './api/findAllUsersQuery'
import { createStudentColumns } from './AllStudentsPage.columns'
import {
  STUDENTS,
  STUDENTS_PAGE_SIZE,
  type StudentLevelTone,
  type StudentRow,
} from './AllStudentsPage.constants'
import {
  AllStudentsPageRoot,
  allStudentsModalGlobalStyles,
} from './AllStudentsPage.style'

const avatarGradients = [
  'linear-gradient(135deg, #38b2ac 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #7dd3fc 0%, #60a5fa 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #fb7185 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
] as const

const levelTones: StudentLevelTone[] = ['orange', 'teal', 'pink', 'yellow', 'blue']
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

type CreateStudentMutationResponse = {
  createUser: {
    _id: string
    firstName: string
    lastName: string
    email: string
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
  password: string
  phone?: string
  centerId?: string
}

type FindAllUsersQueryResponse = {
  findAllUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
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

function UploadArtwork() {
  return (
    <Box className="students-modal__upload-artwork" aria-hidden="true">
      <svg viewBox="0 0 86 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="12" width="52" height="42" rx="8" fill="#DDE4FF" />
        <circle cx="31" cy="23" r="5" fill="#FFB21D" />
        <path
          d="M11 47.5L24.4 33.4C26.5 31.2 30 31.2 32.1 33.4L38.1 39.7L51.8 24.8C54 22.4 57.9 22.4 60.1 24.8L76 42.1V50C76 54.4 72.4 58 68 58H19C14.6 58 11 54.4 11 50V47.5Z"
          fill="url(#upload-art-gradient)"
        />
        <circle cx="61" cy="51" r="11" fill="#4FA6F8" />
        <path
          d="M61 56.3C60.2 56.3 59.6 55.7 59.6 54.9V49.4L57.4 51.7C56.9 52.2 56 52.2 55.5 51.7C54.9 51.1 54.9 50.2 55.5 49.6L60.1 45C60.6 44.5 61.4 44.5 61.9 45L66.5 49.6C67.1 50.2 67.1 51.1 66.5 51.7C66 52.2 65.1 52.2 64.6 51.7L62.4 49.4V54.9C62.4 55.7 61.8 56.3 61 56.3Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="upload-art-gradient"
            x1="19.6"
            y1="29.5"
            x2="70.1"
            y2="59.3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4E8EF7" />
            <stop offset="1" stopColor="#7647F7" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  )
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

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-left', totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis-right', totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, 'ellipsis-left', currentPage, 'ellipsis-right', totalPages] as const
}

export function AllStudentsPage() {
  const [studentRows, setStudentRows] = useState<StudentRow[]>(STUDENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name' | 'Creation date'>('Name')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [studentGroup, setStudentGroup] = useState('Add New')
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [studentDepartment, setStudentDepartment] = useState('')
  const [studentPhotoName, setStudentPhotoName] = useState('')
  const [extraFields, setExtraFields] = useState<Array<{ id: string; label: string }>>([])
  const [formError, setFormError] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: STUDENTS_PAGE_SIZE,
  })
  const [createStudent, { loading: isCreatingStudent }] = useMutation<
    CreateStudentMutationResponse,
    CreateStudentMutationVariables
  >(CREATE_STUDENT_MUTATION)
  const { data: usersData, refetch: refetchUsers } = useQuery<FindAllUsersQueryResponse>(
    FIND_ALL_USERS_QUERY,
  )

  const resetStudentModal = () => {
    setStudentGroup('Add New')
    setStudentName('')
    setStudentEmail('')
    setStudentPhone('')
    setStudentPassword('')
    setStudentDepartment('')
    setStudentPhotoName('')
    setExtraFields([])
    setFormError('')
  }

  const closeStudentModal = () => {
    setIsAddStudentOpen(false)
    resetStudentModal()
  }

  const addExtraField = () => {
    setExtraFields((currentFields) => [
      ...currentFields,
      {
        id: `field-${currentFields.length + 1}`,
        label: `Custom field ${currentFields.length + 1}`,
      },
    ])
  }

  const handleSaveStudent = async () => {
    const trimmedName = studentName.trim()
    const normalizedEmail = studentEmail.trim().toLowerCase()
    const normalizedPhone = studentPhone.trim()
    const trimmedPassword = studentPassword.trim()
    const trimmedDepartment = studentDepartment.trim()
    const normalizedCenterId = OBJECT_ID_PATTERN.test(trimmedDepartment) ? trimmedDepartment : ''

    if (!trimmedName || !normalizedEmail || !trimmedPassword) {
      setFormError('Student yaratish uchun name, email va password majburiy.')
      return
    }

    if (trimmedPassword.length < 6) {
      setFormError("Password kamida 6 ta belgidan iborat bo'lishi kerak.")
      return
    }

    setFormError('')
    const [firstNameRaw, ...lastNameParts] = trimmedName.split(/\s+/)
    const firstName = firstNameRaw?.trim() || trimmedName
    const lastName = lastNameParts.join(' ').trim() || '-'

    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '24497a',
      },
      body: JSON.stringify({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'AllStudentsPage.tsx:handleSaveStudent',
        message: 'Create student submit payload snapshot',
        data: {
          fullNameLength: trimmedName.length,
          emailLength: normalizedEmail.length,
          phoneLength: normalizedPhone.length,
          passwordLength: trimmedPassword.length,
          hasCenterIdCandidate: Boolean(trimmedDepartment),
          hasValidCenterId: Boolean(normalizedCenterId),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    try {
      const result = await createStudent({
        variables: {
          firstName,
          lastName,
          email: normalizedEmail,
          password: trimmedPassword,
          ...(normalizedPhone ? { phone: normalizedPhone } : {}),
          ...(normalizedCenterId ? { centerId: normalizedCenterId } : {}),
        },
      })

      const createdStudent = result.data?.createUser ?? null
      const apolloErrorMessage = result.error?.message ?? null

      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H2',
          location: 'AllStudentsPage.tsx:handleSaveStudent',
          message: 'Create student mutation result snapshot',
          data: {
            hasCreateUserData: Boolean(createdStudent),
            createdStudentId: createdStudent?._id ?? null,
            returnedRole: createdStudent?.role ?? null,
            hasApolloError: Boolean(result.error),
            apolloErrorMessage,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion

      if (!createdStudent?._id) {
        setFormError(apolloErrorMessage ?? "Student yaratishda xatolik bo'ldi.")
        return
      }

      await refetchUsers()
      closeStudentModal()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Student yaratishda kutilmagan xatolik.')
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H4',
          location: 'AllStudentsPage.tsx:handleSaveStudent',
          message: 'Create student mutation threw exception',
          data: {
            errorMessage: error instanceof Error ? error.message : 'unknown-error',
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
  }

  useEffect(() => {
    const serverUsers = usersData?.findAllUsers ?? []
    const studentUsers = serverUsers.filter((user) => user.role === 'student')
    const mappedStudents: StudentRow[] = studentUsers.map((user, index) => {
      const fullName = `${user.firstName} ${user.lastName}`.trim()
      const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0]?.toUpperCase() ?? '')
        .join('')

      return {
        serial: String(index + 1).padStart(2, '0'),
        name: fullName || 'Student',
        email: user.email ?? '-',
        points: '00/100',
        loginTime: '--:--',
        creationDate: new Date(user.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        department: user.centerId ?? 'No center',
        status: 'Active',
        initials: initials || 'ST',
        avatarGradient: avatarGradients[index % avatarGradients.length],
        levelTone: levelTones[index % levelTones.length],
      }
    })
    setStudentRows(mappedStudents)

    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '24497a',
      },
      body: JSON.stringify({
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
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [usersData])

  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleStudents = studentRows.filter((student) => {
      return (
        normalizedSearch.length === 0 ||
        student.name.toLowerCase().includes(normalizedSearch) ||
        student.email.toLowerCase().includes(normalizedSearch) ||
        student.department.toLowerCase().includes(normalizedSearch) ||
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
        id: `${student.serial}-${student.name}-${index}`,
        ...student,
      })),
    [filteredStudents],
  )

  const columns = useMemo(() => createStudentColumns(), [])
  const currentPage = paginationModel.page + 1
  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize))
  const visiblePages = getVisiblePages(currentPage, totalPages)
  const rangeStart = rows.length === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1
  const rangeEnd =
    rows.length === 0
      ? 0
      : Math.min((paginationModel.page + 1) * paginationModel.pageSize, rows.length)

  useEffect(() => {
    if (paginationModel.page > totalPages - 1) {
      setPaginationModel((currentState) => ({
        ...currentState,
        page: Math.max(0, totalPages - 1),
      }))
    }
  }, [paginationModel.page, totalPages])

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
                onClick={() => setIsAddStudentOpen(true)}
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
                Add New Students
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

            <DataGrid
              rows={rows}
              columns={columns}
              pagination
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize
              hideFooter
              autoHeight
              rowHeight={72}
              columnHeaderHeight={54}
              pageSizeOptions={[STUDENTS_PAGE_SIZE]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={{
                noRowsLabel: 'No students matched the current search.',
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0,
                    pageSize: STUDENTS_PAGE_SIZE,
                  },
                },
              }}
              sx={{
                border: 0,
              }}
            />

            <Box className="students-table__footer">
              <Box className="students-table__pagination">
                <Button
                  className="students-table__page-button"
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: Math.max(0, currentState.page - 1),
                    }))
                  }
                >
                  ‹
                </Button>

                {visiblePages.map((item) =>
                  typeof item === 'number' ? (
                    <Button
                      key={item}
                      className={`students-table__page-number${
                        item === currentPage
                          ? ' students-table__page-number--active'
                          : ''
                      }`}
                      variant="text"
                      onClick={() =>
                        setPaginationModel((currentState) => ({
                          ...currentState,
                          page: item - 1,
                        }))
                      }
                    >
                      {item}
                    </Button>
                  ) : (
                    <span key={item} className="students-table__page-ellipsis">
                      ...
                    </span>
                  ),
                )}

                <Button
                  className="students-table__page-button"
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: Math.min(totalPages - 1, currentState.page + 1),
                    }))
                  }
                >
                  ›
                </Button>
              </Box>

              <Box className="students-table__footer-meta">
                <span>
                  Showing {rangeStart} to {rangeEnd} of {rows.length} entries
                </span>
                <Button className="students-table__show-button" variant="outlined">
                  Show {paginationModel.pageSize} ⌃
                </Button>
              </Box>
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
                Add Students
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
                <label className="students-modal__label">Group</label>
                <Box className="students-modal__group-row">
                  <TextField
                    select
                    fullWidth
                    className="students-modal__control students-modal__control--select"
                    value={studentGroup}
                    onChange={(event) => setStudentGroup(event.target.value)}
                  >
                    <MenuItem value="Add New">Add New</MenuItem>
                    <MenuItem value="IELTS Group A">IELTS Group A</MenuItem>
                    <MenuItem value="IELTS Group B">IELTS Group B</MenuItem>
                  </TextField>
                  <Button className="students-modal__select-button" variant="contained">
                    Select
                  </Button>
                </Box>
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Photo</label>
                <Box component="label" className="students-modal__upload">
                  <input
                    className="students-modal__upload-input"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) =>
                      setStudentPhotoName(event.target.files?.[0]?.name ?? '')
                    }
                  />
                  <UploadArtwork />
                  <Box className="students-modal__upload-content">
                    <Typography component="p" className="students-modal__upload-title">
                      Click or Drop your picture here, or <span>Browse</span>
                    </Typography>
                    <Typography component="p" className="students-modal__upload-copy">
                      Recommended image size: 1080 × 780 pixels
                    </Typography>
                    <Typography component="p" className="students-modal__upload-copy">
                      Accepted image formats: JPG, PNG.
                    </Typography>
                    {studentPhotoName ? (
                      <Typography component="p" className="students-modal__upload-file">
                        Selected: {studentPhotoName}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Name</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter name"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                />
              </Box>

              <Box className="students-modal__field">
                <label className="students-modal__label">Email</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter email"
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                />
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

              <Box className="students-modal__field">
                <label className="students-modal__label">Department</label>
                <TextField
                  fullWidth
                  className="students-modal__control"
                  placeholder="Enter department"
                  value={studentDepartment}
                  onChange={(event) => setStudentDepartment(event.target.value)}
                />
              </Box>

              {extraFields.map((field) => (
                <Box key={field.id} className="students-modal__field">
                  <label className="students-modal__label">{field.label}</label>
                  <TextField
                    fullWidth
                    className="students-modal__control"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </Box>
              ))}

              <Button
                className="students-modal__add-field"
                variant="contained"
                onClick={addExtraField}
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
                Add New Field
              </Button>
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
                disabled={isCreatingStudent}
              >
                {isCreatingStudent ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Dialog>
        </Box>
      </AllStudentsPageRoot>
    </Layout>
  )
}
