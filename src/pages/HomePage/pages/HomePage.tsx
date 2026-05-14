import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'
import { useNavigate } from 'react-router-dom'

import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { MenuItem, Select } from '../../../components/common/Select'
import { SearchField } from '../../../components/common/SearchField'
import { useToast } from '../../../components/common/Toast'
import { Layout } from '../../../components/layout'
import { selectAuthToken, selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { ROUTES_PATH } from '../../../routes/paths'
import { c } from '../../../theme'
import { formatPriceInSom, formatPriceValue, parsePriceValue } from '../../../utils/priceFormat'
import { getGraphQLErrorMessage, tryGetGraphQLErrorMessage } from '../../../helpers'
import { type ExamCard } from '../HomePage.constants'
import { CREATE_EXAM_MUTATION } from '../api/createExamMutation'
import { FIND_ALL_EXAMS_QUERY } from '../api/findAllExamsQuery'
import { REMOVE_EXAM_MUTATION } from '../api/removeExamMutation'
import { UPDATE_EXAM_MUTATION } from '../api/updateExamMutation'
import { HomePageRoot } from './HomePage.style'
import { ExamFormDialog } from '../components'

type ExamFormDialog = null | { mode: 'create' } | { mode: 'edit'; examId: string }

function ExamEditIcon() {
  return (
    <Box component="svg" viewBox="0 0 24 24" className="exam-card__icon-svg" fill="currentColor" aria-hidden>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </Box>
  )
}

function ExamDeleteIcon() {
  return (
    <Box component="svg" viewBox="0 0 24 24" className="exam-card__icon-svg" fill="currentColor" aria-hidden>
      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
    </Box>
  )
}

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

type HomePageProps = {
  /** Archived exams only — `/exams/archive` */
  archiveOnly?: boolean
}

export function HomePage({ archiveOnly = false }: HomePageProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const authToken = useAppSelector(selectAuthToken)
  const userRole = useAppSelector(selectUserRole)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [examFormDialog, setExamFormDialog] = useState<ExamFormDialog>(null)
  const [pendingDeleteExam, setPendingDeleteExam] = useState<ExamCard | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [examFormInitial, setExamFormInitial] = useState<Record<string, string>>({})
  const [createExam, { loading: isCreatingExam }] = useMutation(CREATE_EXAM_MUTATION)
  const [updateExam, { loading: isUpdatingExam }] = useMutation(UPDATE_EXAM_MUTATION)
  const [removeExam, { loading: isRemovingExam }] = useMutation(REMOVE_EXAM_MUTATION)
  const { data: examsData, refetch: refetchExams } = useQuery<FindAllExamsQueryResponse>(
    FIND_ALL_EXAMS_QUERY,
  )

  const canManageExams =
    userRole === USER_ROLES.center || userRole === USER_ROLES.superAdmin

  const examModalBusy = isCreatingExam || isUpdatingExam


  const allExams = useMemo(() => {
    const gradientPalette = [...c.gradient.examCard]

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

  const examsForView = useMemo(() => {
    if (archiveOnly) {
      return allExams.filter((e) => e.status === 'Archived')
    }
    return allExams.filter((e) => e.status !== 'Archived')
  }, [allExams, archiveOnly])

  const categories = useMemo(() => {
    const sourceCategories = examsForView.map((exam) => exam.category)
    return Array.from(new Set(sourceCategories))
  }, [examsForView])

  const filteredExams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return examsForView.filter((exam) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        exam.title.toLowerCase().includes(normalizedSearch) ||
        exam.category.toLowerCase().includes(normalizedSearch) ||
        exam.meta.some((item) => item.toLowerCase().includes(normalizedSearch))

      const matchesStatus =
        archiveOnly ||
        statusFilter === 'All statuses' ||
        exam.status === statusFilter
      const matchesCategory = categoryFilter === 'All categories' || exam.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [archiveOnly, examsForView, categoryFilter, searchTerm, statusFilter])

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

  const handleCloseExamModal = useCallback(() => {
    setExamFormDialog(null)
  }, [])

  const openCreateExamModal = useCallback(() => {
    setExamFormInitial({})
    setExamFormDialog({ mode: 'create' })
  }, [])

  const openEditExamModal = useCallback((exam: ExamCard) => {
    setExamFormInitial({
      title: exam.title,
      examiner: exam.examiner,
      examType: exam.examType === 'CEFR' ? 'CEFR' : 'IELTS',
      examDate: isoToDateInputValue(exam.examDateIso),
      startTime: normalizeTimeForInput(exam.startTime),
      endTime: normalizeTimeForInput(exam.endTime),
      price: formatPriceValue(exam.price),
    })
    setExamFormDialog({ mode: 'edit', examId: exam.id })
  }, [])

  const handleSaveExam = useCallback(
    async (values: { title: string; examiner: string; examType: string; examDate: string; startTime: string; endTime: string; price: string }) => {
      const examDateIso = new Date(`${values.examDate}T00:00:00`).toISOString()
      const normalizedPrice = parsePriceValue(values.price)

      const gqlErrorMessage = (err: unknown): string | null => tryGetGraphQLErrorMessage(err)

      try {
        if (examFormDialog?.mode === 'edit') {
          const res = await updateExam({
            variables: {
              _id: examFormDialog.examId,
              title: values.title.trim(),
              examiner: values.examiner.trim(),
              examType: values.examType,
              examDate: examDateIso,
              startTime: values.startTime,
              endTime: values.endTime,
              price: normalizedPrice,
            },
          })
          if (res.error) {
            toast.error(gqlErrorMessage(res.error) ?? 'Failed to update exam.')
            return
          }
          toast.success('Exam updated successfully.')
        } else {
          const res = await createExam({
            variables: {
              title: values.title.trim(),
              examiner: values.examiner.trim(),
              examType: values.examType,
              examDate: examDateIso,
              startTime: values.startTime,
              endTime: values.endTime,
              price: normalizedPrice,
            },
          })
          if (res.error) {
            toast.error(gqlErrorMessage(res.error) ?? 'Failed to create exam.')
            return
          }
          toast.success('Exam created successfully.')
        }

        await refetchExams()
        handleCloseExamModal()
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Failed to save exam.')
      }
    },
    [examFormDialog, createExam, updateExam, refetchExams, handleCloseExamModal, toast],
  )

  const handleRequestDeleteExam = useCallback((exam: ExamCard) => {
    setPendingDeleteExam(exam)
  }, [])

  const handleConfirmDeleteExam = useCallback(async () => {
    if (!pendingDeleteExam) return
    setDeleteLoading(true)
    try {
      const res = await removeExam({ variables: { _id: pendingDeleteExam.id } })
      if (res.error) {
        toast.error(getGraphQLErrorMessage(res.error, 'Delete failed.'))
      } else {
        await refetchExams()
        setPendingDeleteExam(null)
        toast.success('Exam deleted successfully.')
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete exam.')
    } finally {
      setDeleteLoading(false)
    }
  }, [pendingDeleteExam, removeExam, refetchExams, toast])

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!deleteLoading) setPendingDeleteExam(null)
  }, [deleteLoading])

  return (
    <Layout>
      <HomePageRoot>
        <Box component="section" className="content__toolbar">
          <Box component="header" className="content__toolbar-header">
            <Typography component="h2" className="content__section-title">
              {archiveOnly ? 'Archive' : 'All Exams'}
            </Typography>
            {canManageExams && !archiveOnly ? (
              <Button className="content__primary-button" variant="primary" onClick={openCreateExamModal}>
                + Add New Exam
              </Button>
            ) : null}
          </Box>

          <Box className="content__toolbar-filters">
            <SearchField
              className="content__toolbar-search"
              showIcon={false}
              aria-label="Search exams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <Box className="content__toolbar-filter-group">
              {!archiveOnly ? (
                <Select
                  className="content__toolbar-select"
                  aria-label="Exam status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  options={[
                    { value: 'All statuses', label: 'All statuses' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Draft', label: 'Draft' },
                  ]}
                />
              ) : null}

              <Select
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
              </Select>
            </Box>
          </Box>
        </Box>

        <Box component="section" className="content__section" aria-labelledby="all-exams-title">
          <Typography component="h2" id="all-exams-title" className="content__screen-reader-title">
            {archiveOnly ? 'Archived exams' : 'All exams'}
          </Typography>

          <Box className="content__results-summary">
            <Typography component="span">{filteredExams.length} exams found</Typography>
            <Typography component="span" className="content__results-meta">
              {categoryFilter === 'All categories' ? 'Across all categories' : categoryFilter}
            </Typography>
          </Box>

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
                        variant="secondary"
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
                          <Tooltip title="Edit">
                            <IconButton
                              className="exam-card__icon-action"
                              size="small"
                              type="button"
                              aria-label="Edit exam"
                              onClick={() => openEditExamModal(exam)}
                            >
                              <ExamEditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                className="exam-card__icon-action exam-card__icon-action--danger"
                                size="small"
                                type="button"
                                aria-label="Delete exam"
                                disabled={isRemovingExam}
                                onClick={() => handleRequestDeleteExam(exam)}
                              >
                                <ExamDeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="content__empty-state">
              {archiveOnly
                ? 'No archived exams yet, or no results match the current filter.'
                : 'No exams matched this filter. Try another status, category, or search phrase.'}
            </Box>
          )}
        </Box>

        <ExamFormDialog
          open={Boolean(examFormDialog)}
          formMode={examFormDialog}
          initialValues={examFormInitial}
          busy={examModalBusy}
          onClose={handleCloseExamModal}
          onSave={(values) => void handleSaveExam(values)}
        />

        <ConfirmDialog
          open={Boolean(pendingDeleteExam)}
          title="Delete exam"
          description={
            pendingDeleteExam
              ? `Are you sure you want to delete "${pendingDeleteExam.title}"? This cannot be undone.`
              : undefined
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmColor="error"
          loading={deleteLoading}
          onClose={handleCloseDeleteConfirm}
          onConfirm={handleConfirmDeleteExam}
        />
      </HomePageRoot>
    </Layout>
  )
}
