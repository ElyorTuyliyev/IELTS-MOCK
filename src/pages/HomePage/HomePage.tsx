import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Alert, Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { Layout } from '../../components/layout'
import { selectAuthToken, selectUserRole } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { USER_ROLES } from '../../store/slices/authSlice'
import { ROUTES_PATH } from '../../routes/paths'
import { type ExamCard } from './HomePage.constants'
import { CREATE_EXAM_MUTATION } from './api/createExamMutation'
import { FIND_ALL_EXAMS_QUERY } from './api/findAllExamsQuery'
import { REMOVE_EXAM_MUTATION } from './api/removeExamMutation'
import { UPDATE_EXAM_MUTATION } from './api/updateExamMutation'
import { HomePageRoot } from './HomePage.style'

type ExamFormDialog = null | { mode: 'create' } | { mode: 'edit'; examId: string }

function isoToDateInputValue(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function normalizeTimeForInput(t: string) {
  const trimmed = t.trim()
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(trimmed)
  if (!m) {
    return trimmed
  }
  const h = Number(m[1])
  const min = m[2]
  if (!Number.isFinite(h)) {
    return trimmed
  }
  return `${String(h).padStart(2, '0')}:${min}`
}

type FindAllExamsQueryResponse = {
  findAllExams: Array<{
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
    createdAt: string
    centerId?: string | null
  }>
}

export function HomePage() {
  const navigate = useNavigate()
  const authToken = useAppSelector(selectAuthToken)
  const userRole = useAppSelector(selectUserRole)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [newCategory, setNewCategory] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [examFormDialog, setExamFormDialog] = useState<ExamFormDialog>(null)
  const [examCardActionError, setExamCardActionError] = useState<string | null>(null)
  const [examTitle, setExamTitle] = useState('')
  const [examiner, setExaminer] = useState('')
  const [examType, setExamType] = useState<'IELTS' | 'CEFR'>('IELTS')
  const [examDate, setExamDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [price, setPrice] = useState('')
  const [createExamError, setCreateExamError] = useState<string | null>(null)
  const [createExamSuccess, setCreateExamSuccess] = useState<string | null>(null)
  const [createExam, { loading: isCreatingExam }] = useMutation(CREATE_EXAM_MUTATION)
  const [updateExam, { loading: isUpdatingExam }] = useMutation(UPDATE_EXAM_MUTATION)
  const [removeExam, { loading: isRemovingExam }] = useMutation(REMOVE_EXAM_MUTATION)
  const { data: examsData, refetch: refetchExams } = useQuery<FindAllExamsQueryResponse>(
    FIND_ALL_EXAMS_QUERY,
  )

  const canManageExams =
    userRole === USER_ROLES.center || userRole === USER_ROLES.superAdmin

  const examModalBusy = isCreatingExam || isUpdatingExam

  const formatPriceInSom = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0
    return `${new Intl.NumberFormat('uz-UZ').format(safeValue)} so'm`
  }

  const allExams = useMemo(() => {
    const gradientPalette = [
      'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'linear-gradient(135deg, #38bdf8 0%, #93c5fd 100%)',
      'linear-gradient(135deg, #ec4899 0%, #f9a8d4 100%)',
      'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      'linear-gradient(135deg, #fbbf24 0%, #fde68a 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%)',
    ]

    const actorCenterId = (() => {
      if (!authToken) {
        return null
      }

      const parts = authToken.split('.')
      if (parts.length < 2) {
        return null
      }

      try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
        const payload = JSON.parse(atob(padded)) as { centerId?: string | null }
        return payload.centerId ?? null
      } catch {
        return null
      }
    })()

    const scopedExams =
      userRole === USER_ROLES.center && actorCenterId
        ? (examsData?.findAllExams ?? []).filter((exam) => exam.centerId === actorCenterId)
        : (examsData?.findAllExams ?? [])

    const backendExams = scopedExams.map((exam, index): ExamCard => {
      const status: ExamCard['status'] = exam.isCompleted
        ? 'Archived'
        : exam.isActive
          ? 'Active'
          : 'Draft'

      return {
        id: exam._id,
        title: exam.title,
        gradient: gradientPalette[index % gradientPalette.length],
        category: exam.examType ?? 'Mock Exam',
        status,
        meta: [
          `Examiner: ${exam.examiner}`,
          `${exam.startTime} - ${exam.endTime}`,
          `Price: ${formatPriceInSom(exam.price)}`,
        ],
        date: formatExamDateLabel(exam.examDate || exam.createdAt),
        examiner: exam.examiner,
        examType: exam.examType === 'CEFR' ? 'CEFR' : 'IELTS',
        examDateIso: exam.examDate || exam.createdAt,
        startTime: exam.startTime,
        endTime: exam.endTime,
        price: exam.price,
      }
    })

    return backendExams
  }, [authToken, examsData, userRole])

  const categories = useMemo(() => {
    const sourceCategories = allExams.map((exam) => exam.category)
    return Array.from(new Set([...sourceCategories, ...customCategories]))
  }, [allExams, customCategories])

  const filteredExams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return allExams.filter((exam) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        exam.title.toLowerCase().includes(normalizedSearch) ||
        exam.category.toLowerCase().includes(normalizedSearch) ||
        exam.meta.some((item) => item.toLowerCase().includes(normalizedSearch))

      const matchesStatus = statusFilter === 'All statuses' || exam.status === statusFilter
      const matchesCategory = categoryFilter === 'All categories' || exam.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [allExams, categoryFilter, searchTerm, statusFilter])

  const handleAddCategory = () => {
    const normalizedCategory = newCategory.trim()

    if (!normalizedCategory) {
      return
    }

    if (categories.some((category) => category.toLowerCase() === normalizedCategory.toLowerCase())) {
      setCategoryFilter(
        categories.find((category) => category.toLowerCase() === normalizedCategory.toLowerCase()) ??
          normalizedCategory,
      )
      setNewCategory('')
      return
    }

    setCustomCategories((current) => [...current, normalizedCategory])
    setCategoryFilter(normalizedCategory)
    setNewCategory('')
  }

  const getStatusClassName = (status: 'Active' | 'Draft' | 'Archived') =>
    `exam-card__status exam-card__status--${status.toLowerCase()}`

  function formatExamDateLabel(dateValue: string) {
    const parsedDate = new Date(dateValue)
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Created today'
    }

    return `Exam date: ${parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })}`
  }

  const resetCreateExamForm = () => {
    setExamTitle('')
    setExaminer('')
    setExamType('IELTS')
    setExamDate('')
    setStartTime('')
    setEndTime('')
    setPrice('')
    setCreateExamError(null)
    setCreateExamSuccess(null)
  }

  const handleCloseExamModal = () => {
    setExamFormDialog(null)
    resetCreateExamForm()
  }

  const openCreateExamModal = () => {
    resetCreateExamForm()
    setExamFormDialog({ mode: 'create' })
  }

  const openEditExamModal = (exam: ExamCard) => {
    setCreateExamError(null)
    setCreateExamSuccess(null)
    setExamTitle(exam.title)
    setExaminer(exam.examiner)
    setExamType(exam.examType === 'CEFR' ? 'CEFR' : 'IELTS')
    setExamDate(isoToDateInputValue(exam.examDateIso))
    setStartTime(normalizeTimeForInput(exam.startTime))
    setEndTime(normalizeTimeForInput(exam.endTime))
    setPrice(String(exam.price))
    setExamFormDialog({ mode: 'edit', examId: exam.id })
  }

  const handleSaveExam = async () => {
    const normalizedTitle = examTitle.trim()
    const normalizedExaminer = examiner.trim()
    const normalizedPrice = Number(price)

    if (!normalizedTitle || !normalizedExaminer || !examDate || !startTime || !endTime || !price) {
      setCreateExamError('Please fill all fields.')
      return
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      setCreateExamError('Price must be a valid number.')
      return
    }

    setCreateExamError(null)
    const examDateIso = new Date(`${examDate}T00:00:00`).toISOString()

    const gqlErrorMessage = (err: unknown): string | null => {
      if (!err || typeof err !== 'object') {
        return null
      }
      const graphQLErrors =
        'graphQLErrors' in err && Array.isArray((err as { graphQLErrors: unknown }).graphQLErrors)
          ? (err as { graphQLErrors: Array<{ message?: string }> }).graphQLErrors
          : []
      const gqlMsg =
        graphQLErrors[0] && typeof graphQLErrors[0].message === 'string' ? graphQLErrors[0].message : null
      if (gqlMsg) {
        return gqlMsg
      }
      if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message
      }
      return null
    }

    try {
      if (examFormDialog?.mode === 'edit') {
        const res = await updateExam({
          variables: {
            _id: examFormDialog.examId,
            title: normalizedTitle,
            examiner: normalizedExaminer,
            examType,
            examDate: examDateIso,
            startTime,
            endTime,
            price: normalizedPrice,
          },
        })
        if (res.error) {
          setCreateExamError(gqlErrorMessage(res.error) ?? 'Failed to update exam.')
          return
        }
        setCreateExamSuccess('Exam updated successfully.')
      } else {
        const res = await createExam({
          variables: {
            title: normalizedTitle,
            examiner: normalizedExaminer,
            examType,
            examDate: examDateIso,
            startTime,
            endTime,
            price: normalizedPrice,
          },
        })
        if (res.error) {
          setCreateExamError(gqlErrorMessage(res.error) ?? 'Failed to create exam.')
          return
        }
        setCreateExamSuccess('Exam created successfully.')
      }

      await refetchExams()
      setTimeout(() => {
        handleCloseExamModal()
      }, 700)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save exam.'
      setCreateExamError(message)
    }
  }

  const handleDeleteExam = useCallback(
    async (exam: ExamCard) => {
      if (!window.confirm(`Delete "${exam.title}"? This cannot be undone.`)) {
        return
      }
      setExamCardActionError(null)
      try {
        const res = await removeExam({ variables: { _id: exam.id } })
        if (res.error) {
          const gqlErrors =
            'graphQLErrors' in res.error && Array.isArray(res.error.graphQLErrors)
              ? res.error.graphQLErrors
              : []
          const gqlMsg = gqlErrors[0] && 'message' in gqlErrors[0] ? String(gqlErrors[0].message) : null
          setExamCardActionError(gqlMsg ?? res.error.message ?? 'Delete failed.')
          return
        }
        await refetchExams()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete exam.'
        setExamCardActionError(message)
      }
    },
    [refetchExams, removeExam],
  )

  return (
    <Layout>
      <HomePageRoot>
        <Box component="section" className="content__toolbar">
          <Box component="header" className="content__toolbar-header">
            <Typography component="h2" className="content__section-title">
              All Exams
            </Typography>
            {canManageExams ? (
              <Button className="content__primary-button" variant="contained" onClick={openCreateExamModal}>
                + Add New Exam
              </Button>
            ) : null}
          </Box>

          <Box className="content__toolbar-filters">
            <TextField
              className="content__toolbar-search"
              type="search"
              placeholder="Search..."
              aria-label="Search exams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <Box className="content__toolbar-filter-group">
              <TextField
                select
                className="content__toolbar-select"
                aria-label="Exam status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <MenuItem value="All statuses">All statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </TextField>

              <TextField
                select
                className="content__toolbar-select"
                aria-label="Exam category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <MenuItem value="All categories">All categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <Box className="content__category-actions">
                <TextField
                  className="content__category-input"
                  placeholder="New category"
                  aria-label="New category"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <Button
                  className="content__secondary-button"
                  variant="outlined"
                  onClick={handleAddCategory}
                >
                  Add category
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box component="section" className="content__section" aria-labelledby="all-exams-title">
          <Typography component="h2" id="all-exams-title" className="content__screen-reader-title">
            All exams
          </Typography>

          <Box className="content__results-summary">
            <Typography component="span">{filteredExams.length} exams found</Typography>
            <Typography component="span" className="content__results-meta">
              {categoryFilter === 'All categories' ? 'Across all categories' : categoryFilter}
            </Typography>
          </Box>

          {examCardActionError ? (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setExamCardActionError(null)}>
              {examCardActionError}
            </Alert>
          ) : null}

          {filteredExams.length > 0 ? (
            <Box className="content__grid">
              {filteredExams.map((exam) => (
                <Box key={exam.id} component="article" className="exam-card">
                  <Box className="exam-card__visual" sx={{ background: exam.gradient }}>
                    <Box component="span" className="exam-card__orb exam-card__orb--large" />
                    <Box component="span" className="exam-card__orb exam-card__orb--small" />
                    <Box className="exam-card__monitor" aria-hidden="true" />
                    <Box className="exam-card__desk" aria-hidden="true" />
                  </Box>

                  <Box className="exam-card__body">
                    <Box component="header" className="exam-card__header">
                      <Box>
                        <Typography component="h3" className="exam-card__title">
                          {exam.title}
                        </Typography>
                        <Typography component="span" className="exam-card__category">
                          {exam.category}
                        </Typography>
                      </Box>

                      <Typography component="span" className={getStatusClassName(exam.status)}>
                        {exam.status}
                      </Typography>
                    </Box>

                    <Box component="ul" className="exam-card__meta">
                      {exam.meta.map((item) => (
                        <Box key={item} component="li" className="exam-card__meta-item">
                          {item}
                        </Box>
                      ))}
                    </Box>

                    <Typography component="p" className="exam-card__date">
                      {exam.date}
                    </Typography>

                    <Box className="exam-card__actions">
                      <Button
                        className="exam-card__action"
                        variant="outlined"
                        type="button"
                        onClick={() =>
                          navigate(ROUTES_PATH.examDetails.replace(':examId', exam.id), {
                            state: {
                              exam: {
                                _id: exam.id,
                                title: exam.title,
                                examiner: exam.examiner,
                                examType: exam.examType,
                                examDate: exam.examDateIso,
                                startTime: exam.startTime,
                                endTime: exam.endTime,
                                price: exam.price,
                                isActive: exam.status === 'Active',
                                isCompleted: exam.status === 'Archived',
                              },
                            },
                          })
                        }
                      >
                        View More
                      </Button>
                      {canManageExams ? (
                        <>
                          <Button
                            className="exam-card__action"
                            variant="outlined"
                            type="button"
                            onClick={() => openEditExamModal(exam)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="exam-card__action exam-card__action--danger"
                            variant="outlined"
                            type="button"
                            disabled={isRemovingExam}
                            onClick={() => void handleDeleteExam(exam)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="content__empty-state">
              No exams matched this filter. Try another status, category, or search phrase.
            </Box>
          )}
        </Box>

        {examFormDialog ? (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(6, 10, 28, 0.58)',
              p: 2,
            }}
            onClick={handleCloseExamModal}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 520,
                borderRadius: 3,
                p: 3,
                backgroundColor: '#fff',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>
                {examFormDialog.mode === 'edit' ? 'Edit exam' : 'Add New Exam'}
              </Typography>

              <TextField
                label="Exam Title"
                value={examTitle}
                onChange={(event) => setExamTitle(event.target.value)}
                fullWidth
              />
              <TextField
                label="Teacher / Examiner"
                value={examiner}
                onChange={(event) => setExaminer(event.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Exam Type"
                value={examType}
                onChange={(event) => setExamType(event.target.value as 'IELTS' | 'CEFR')}
                fullWidth
              >
                <MenuItem value="IELTS">IELTS</MenuItem>
                <MenuItem value="CEFR">CEFR</MenuItem>
              </TextField>
              <TextField
                label="Exam Date"
                type="date"
                value={examDate}
                onChange={(event) => setExamDate(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Box>
              <TextField
                label="Price (so'm)"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                fullWidth
              />

              {createExamError ? (
                <Typography component="p" sx={{ color: 'error.main', fontSize: 14 }}>
                  {createExamError}
                </Typography>
              ) : null}
              {createExamSuccess ? (
                <Typography component="p" sx={{ color: '#127a45', fontSize: 14 }}>
                  {createExamSuccess}
                </Typography>
              ) : null}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
                <Button variant="outlined" onClick={handleCloseExamModal}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSaveExam} disabled={examModalBusy}>
                  {examModalBusy ? 'Saving...' : 'Save Exam'}
                </Button>
              </Box>
            </Box>
          </Box>
        ) : null}
      </HomePageRoot>
    </Layout>
  )
}
