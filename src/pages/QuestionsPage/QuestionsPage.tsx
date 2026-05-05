import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { ROUTES_PATH } from '../../routes'
import { createQuestionColumns } from './QuestionsPage.columns'
import { FIND_ALL_QUESTIONS_QUERY } from './api/findAllQuestionsQuery'
import { REMOVE_QUESTION_MUTATION } from './api/removeQuestionMutation'
import { UPDATE_QUESTION_MUTATION } from './api/updateQuestionMutation'
import {
  QUESTION_PAGE_SIZE,
  type QuestionModuleFilter,
  type QuestionType,
  type QuestionGridRow,
} from './QuestionsPage.constants'
import { QuestionsPageRoot } from './QuestionsPage.style'

const PAGE_SIZE_OPTIONS = [8, 16, 24, 50] as const

export function QuestionsPage() {
  const { data: questionsData } = useQuery<{
    findAllQuestions: Array<{
      _id: string
      title?: string | null
      question: string
      type: string
      examId: string
      partId: string
      ieltsModule?: string | null
      listeningAudio?: string | null
      speakingAudio?: string | null
      supportingImage?: string | null
      options?: Array<{
        title: string
        isCorrectAnswer: boolean
      }> | null
    }>
  }>(FIND_ALL_QUESTIONS_QUERY)
  const [removeQuestion] = useMutation(REMOVE_QUESTION_MUTATION)
  const [updateQuestion, { loading: isUpdating }] = useMutation(UPDATE_QUESTION_MUTATION)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<QuestionModuleFilter>('All IELTS modules')
  const [actionError, setActionError] = useState<string | null>(null)
  const [editingRow, setEditingRow] = useState<QuestionGridRow | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingModule, setEditingModule] = useState<QuestionType>('Listening')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: QUESTION_PAGE_SIZE,
  })

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model)
  }, [])

  const backendRows = useMemo<QuestionGridRow[]>(() => {
    const MODULES: QuestionType[] = ['Listening', 'Reading', 'Writing', 'Speaking']

    type ModuleSource = {
      ieltsModule?: string | null
      listeningAudio?: string | null
      speakingAudio?: string | null
      supportingImage?: string | null
      type: string
      options?: { title: string; isCorrectAnswer: boolean }[] | null
    }

    const resolveIeltsModule = (questionItem: ModuleSource): QuestionType => {
      const stored = questionItem.ieltsModule?.trim()
      if (stored && MODULES.includes(stored as QuestionType)) {
        return stored as QuestionType
      }
      if (questionItem.listeningAudio?.trim()) {
        return 'Listening'
      }
      if (questionItem.speakingAudio?.trim()) {
        return 'Speaking'
      }
      if (questionItem.supportingImage?.trim()) {
        const hasOptions = (questionItem.options?.length ?? 0) > 0
        return questionItem.type === 'input' && !hasOptions ? 'Writing' : 'Reading'
      }
      return 'Listening'
    }

    return (questionsData?.findAllQuestions ?? []).map((questionItem) => ({
      id: questionItem._id,
      title:
        questionItem.title?.trim() ||
        questionItem.question.replace(/<[^>]+>/g, '').slice(0, 120) ||
        'Untitled question',
      tag: questionItem.type === 'input' ? 'Online lms' : 'Easy',
      author: 'System Admin',
      category: `Exam ${questionItem.examId.slice(-6)}`,
      questionType: resolveIeltsModule(questionItem),
      errorRate: 0,
    }))
  }, [questionsData])

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return backendRows.filter((question) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.tag.toLowerCase().includes(normalizedSearch) ||
        question.author.toLowerCase().includes(normalizedSearch) ||
        question.category.toLowerCase().includes(normalizedSearch)

      const matchesType =
        typeFilter === 'All IELTS modules' || question.questionType === typeFilter

      return matchesSearch && matchesType
    })
  }, [backendRows, searchTerm, typeFilter])

  const rows = filteredQuestions

  const handleDeleteQuestion = useCallback(
    async (row: QuestionGridRow) => {
      if (!window.confirm(`Delete "${row.title}"?`)) {
        return
      }
      setActionError(null)
      try {
        const res = await removeQuestion({
          variables: { _id: row.id },
          refetchQueries: [{ query: FIND_ALL_QUESTIONS_QUERY }],
          awaitRefetchQueries: true,
        })
        if (res.error) {
          setActionError(res.error.message ?? 'Delete failed.')
        }
      } catch (error) {
        setActionError(error instanceof Error ? error.message : 'Delete failed.')
      }
    },
    [removeQuestion],
  )

  const handleOpenEditQuestion = useCallback((row: QuestionGridRow) => {
    setActionError(null)
    setEditingRow(row)
    setEditingTitle(row.title)
    setEditingModule(row.questionType)
  }, [])

  const handleCloseEditQuestion = useCallback(() => {
    setEditingRow(null)
    setEditingTitle('')
  }, [])

  const handleSaveEditQuestion = useCallback(async () => {
    if (!editingRow) {
      return
    }
    const normalizedTitle = editingTitle.trim()
    if (!normalizedTitle) {
      setActionError('Title required.')
      return
    }
    setActionError(null)
    try {
      const res = await updateQuestion({
        variables: {
          input: {
            _id: editingRow.id,
            title: normalizedTitle,
            ieltsModule: editingModule,
          },
        },
        refetchQueries: [{ query: FIND_ALL_QUESTIONS_QUERY }],
        awaitRefetchQueries: true,
      })
      if (res.error) {
        setActionError(res.error.message ?? 'Update failed.')
        return
      }
      handleCloseEditQuestion()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Update failed.')
    }
  }, [editingModule, editingRow, editingTitle, handleCloseEditQuestion, updateQuestion])

  const columns = useMemo(
    () =>
      createQuestionColumns({
        onDelete: (row) => void handleDeleteQuestion(row),
        onEdit: handleOpenEditQuestion,
      }),
    [handleDeleteQuestion, handleOpenEditQuestion],
  )
  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize))

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
      <QuestionsPageRoot>
        <Box className="question-page">
          <Box className="question-page__head">
            <Typography component="h1" className="question-page__title">
              All Questions
            </Typography>

            <Box className="question-page__head-actions">
              <Button className="question-page__utility-button" variant="outlined">
                🏷 Question tags
              </Button>
              <Button className="question-page__utility-button" variant="outlined">
                ⚠ Candidates report errors
              </Button>
              <Button className="question-page__utility-button" variant="outlined">
                ⧉ Check duplication
              </Button>
              <Button
                component={Link}
                to={ROUTES_PATH.addQuestion}
                className="question-page__primary-button"
                variant="contained"
              >
                ⤴ Add New Question
              </Button>
            </Box>
          </Box>

          <Box className="question-table">
            {actionError ? (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError(null)}>
                {actionError}
              </Alert>
            ) : null}
            <Box className="question-table__filters">
              <TextField
                className="question-table__search"
                type="search"
                placeholder="Search..."
                aria-label="Search questions"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="question-table__search-icon">⌕</Box>
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

              <Box className="question-table__actions">
                <TextField
                  select
                  className="question-table__select"
                  aria-label="IELTS module"
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value as QuestionModuleFilter)
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: 0,
                    }))
                  }}
                >
                  <MenuItem value="All IELTS modules">IELTS module</MenuItem>
                  <MenuItem value="Listening">Listening</MenuItem>
                  <MenuItem value="Reading">Reading</MenuItem>
                  <MenuItem value="Writing">Writing</MenuItem>
                  <MenuItem value="Speaking">Speaking</MenuItem>
                </TextField>

                <Button className="question-table__ghost-button" variant="outlined">
                  Add new category
                </Button>
              </Box>
            </Box>

            <Box className="question-table__grid">
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationMode="client"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                disableColumnResize
                rowHeight={60}
                columnHeaderHeight={52}
                localeText={{
                  noRowsLabel:
                    'No questions matched the current search or IELTS module filter.',
                }}
                slotProps={{
                  pagination: {
                    labelRowsPerPage: 'Rows per page:',
                    labelDisplayedRows: ({
                      from,
                      to,
                      count,
                    }: {
                      from: number
                      to: number
                      count: number
                    }) =>
                      `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`,
                  },
                }}
                sx={{
                  border: 0,
                  height: 'min(70vh, 640px)',
                  '& .MuiDataGrid-main': {
                    overflow: 'auto',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid #edf2fb',
                    background: '#fafbff',
                  },
                  '& .MuiDataGrid-selectedRowCount': {
                    display: 'none',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        <Dialog open={Boolean(editingRow)} onClose={handleCloseEditQuestion} maxWidth="sm" fullWidth>
          <DialogTitle>Edit question</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: '10px !important' }}>
            <TextField
              label="Question title"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="IELTS module"
              value={editingModule}
              onChange={(event) => setEditingModule(event.target.value as QuestionType)}
              fullWidth
            >
              <MenuItem value="Listening">Listening</MenuItem>
              <MenuItem value="Reading">Reading</MenuItem>
              <MenuItem value="Writing">Writing</MenuItem>
              <MenuItem value="Speaking">Speaking</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditQuestion}>Cancel</Button>
            <Button onClick={() => void handleSaveEditQuestion()} disabled={isUpdating} variant="contained">
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </QuestionsPageRoot>
    </Layout>
  )
}
