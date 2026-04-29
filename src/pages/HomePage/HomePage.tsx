import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { EXAMS, type ExamCard } from './HomePage.constants'
import { CREATE_EXAM_MUTATION } from './api/createExamMutation'
import { FIND_ALL_EXAMS_QUERY } from './api/findAllExamsQuery'
import { HomePageRoot } from './HomePage.style'

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
  }>
}

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [newCategory, setNewCategory] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [isCreateExamModalOpen, setIsCreateExamModalOpen] = useState(false)
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
  const { data: examsData, refetch: refetchExams } = useQuery<FindAllExamsQueryResponse>(
    FIND_ALL_EXAMS_QUERY,
  )

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

    const backendExams = (examsData?.findAllExams ?? []).map((exam, index): ExamCard => {
      const status: ExamCard['status'] = exam.isCompleted
        ? 'Archived'
        : exam.isActive
          ? 'Active'
          : 'Draft'

      return {
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
      }
    })

    return backendExams.length > 0 ? backendExams : EXAMS
  }, [examsData])

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

  const handleCloseCreateExamModal = () => {
    setIsCreateExamModalOpen(false)
    resetCreateExamForm()
  }

  const handleCreateExam = async () => {
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

    try {
      setCreateExamError(null)
      const examDateIso = new Date(`${examDate}T00:00:00`).toISOString()

      await createExam({
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

      await refetchExams()
      setCreateExamSuccess('Exam created successfully.')
      setTimeout(() => {
        handleCloseCreateExamModal()
      }, 700)
    } catch (error: any) {
      setCreateExamError(error?.message ?? 'Failed to create exam.')
    }
  }

  return (
    <Layout>
      <HomePageRoot>
        <Box component="section" className="content__toolbar">
          <Box component="header" className="content__toolbar-header">
            <Typography component="h2" className="content__section-title">
              All Exams
            </Typography>
            <Button
              className="content__primary-button"
              variant="contained"
              onClick={() => setIsCreateExamModalOpen(true)}
            >
              + Add New Exam
            </Button>
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

          {filteredExams.length > 0 ? (
            <Box className="content__grid">
              {filteredExams.map((exam) => (
                <Box key={`${exam.title}-${exam.gradient}`} component="article" className="exam-card">
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

                    <Button className="exam-card__action" variant="outlined">
                      View More
                    </Button>
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

        {isCreateExamModalOpen ? (
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
            onClick={handleCloseCreateExamModal}
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
                Add New Exam
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
                <Button variant="outlined" onClick={handleCloseCreateExamModal}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleCreateExam} disabled={isCreatingExam}>
                  {isCreatingExam ? 'Saving...' : 'Save Exam'}
                </Button>
              </Box>
            </Box>
          </Box>
        ) : null}
      </HomePageRoot>
    </Layout>
  )
}
