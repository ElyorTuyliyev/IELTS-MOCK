import { useMemo, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

import { SearchField } from '../../../components/common/SearchField'
import { Select } from '../../../components/common/Select'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { useToast } from '../../../components/common/Toast'
import { selectUserName } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { ROUTES_PATH } from '../../../routes'
import { createQuestionColumns } from '../QuestionsPage.columns'
import { FIND_ALL_QUESTIONS_QUERY, type FindAllQuestionsResponse, type GroupedQuestionItem } from '../api/findAllQuestionsQuery'
import { REMOVE_QUESTION_MUTATION } from '../api/removeQuestionMutation'
import {
  QUESTION_PAGE_SIZE,
  type QuestionModuleFilter,
  type QuestionType,
  type QuestionGridRow,
} from '../QuestionsPage.constants'
import { MODULE_PAGE_META } from '../QuestionsPage.config'
import { resolveQuestionGroupKey } from '../../../helpers/questionGroupKey'
import { QuestionsPageRoot } from './QuestionsPage.style'

const PAGE_SIZE_OPTIONS = [8, 16, 24, 50] as const

type QuestionsPageProps = {
  fixedModule?: QuestionType
}

export function QuestionsPage({ fixedModule }: QuestionsPageProps = {}) {
  const navigate = useNavigate()
  const toast = useToast()
  const userName = useAppSelector(selectUserName)
  const { data: questionsData } = useQuery<FindAllQuestionsResponse>(FIND_ALL_QUESTIONS_QUERY)
  const [removeQuestion] = useMutation(REMOVE_QUESTION_MUTATION)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<QuestionModuleFilter>(
    fixedModule ?? 'All IELTS modules',
  )
  const [pendingDelete, setPendingDelete] = useState<QuestionGridRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: QUESTION_PAGE_SIZE,
  })

  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model)
  }, [])

  const backendRows = useMemo<QuestionGridRow[]>(() => {
    const MODULES: QuestionType[] = ['Listening', 'Reading', 'Writing', 'Speaking']

    const resolveIeltsModule = (q: GroupedQuestionItem['questions'][number]): QuestionType => {
      const stored = q.ieltsModule?.trim()
      if (stored && MODULES.includes(stored as QuestionType)) return stored as QuestionType
      if (q.listeningAudio?.trim()) return 'Listening'
      if (q.speakingAudio?.trim()) return 'Speaking'
      if (q.questionsHtml?.trim()) return 'Reading'
      const hasOptions = (q.options?.length ?? 0) > 0
      return q.type === 'input' && !hasOptions ? 'Writing' : 'Listening'
    }

    const groups = questionsData?.findAllQuestions ?? []
    const allQuestions = groups.flatMap((g) => g.questions)

    const groupMap = new Map<string, {
      module: QuestionType
      examId: string | null
      groupId: string
      title: string
      parts: Set<string>
      questionIds: string[]
    }>()

    for (const q of allQuestions) {
      const mod = resolveIeltsModule(q)
      const gid = resolveQuestionGroupKey(q, mod)
      if (!groupMap.has(gid)) {
        const baseTitle = (q.title ?? '').split(' — ')[0]?.trim() || mod
        groupMap.set(gid, {
          module: mod,
          examId: q.examId ?? null,
          groupId: gid,
          title: baseTitle,
          parts: new Set(),
          questionIds: [],
        })
      }
      const entry = groupMap.get(gid)!
      entry.questionIds.push(q._id)
      if (q.partId) entry.parts.add(q.partId)
    }

    return Array.from(groupMap.entries()).map(([key, entry]) => ({
      id: key,
      title: entry.title,
      partsCount: entry.parts.size || entry.questionIds.length,
      questionsCount: entry.questionIds.length,
      author: userName?.trim() || 'Center Admin',
      category: entry.examId?.trim()
        ? `Exam ${entry.examId.slice(-6)}`
        : 'General bank',
      questionType: entry.module,
      questionIds: entry.questionIds,
    }))
  }, [questionsData, userName])

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return backendRows.filter((question) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.questionType.toLowerCase().includes(normalizedSearch) ||
        question.author.toLowerCase().includes(normalizedSearch) ||
        question.category.toLowerCase().includes(normalizedSearch)

      const activeModule = fixedModule ?? typeFilter
      const matchesType =
        activeModule === 'All IELTS modules' || question.questionType === activeModule

      return matchesSearch && matchesType
    })
  }, [backendRows, searchTerm, typeFilter, fixedModule])

  const rows = filteredQuestions

  const handleRequestDelete = useCallback((row: QuestionGridRow) => {
    setPendingDelete(row)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDelete) {
      return
    }
    setDeleteLoading(true)
    try {
      const ids = pendingDelete.questionIds
      for (let i = 0; i < ids.length; i++) {
        const isLast = i === ids.length - 1
        const res = await removeQuestion({
          variables: { _id: ids[i] },
          ...(isLast && {
            refetchQueries: [{ query: FIND_ALL_QUESTIONS_QUERY }],
            awaitRefetchQueries: true,
          }),
        })
        if (res.error) {
          toast.error(res.error.message ?? 'Delete failed.')
          setDeleteLoading(false)
          return
        }
      }
      setPendingDelete(null)
      toast.success('Question deleted successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }, [pendingDelete, removeQuestion, toast])

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!deleteLoading) {
      setPendingDelete(null)
    }
  }, [deleteLoading])

  const handleEditQuestion = useCallback(
    (row: QuestionGridRow) => {
      const firstId = row.questionIds[0]
      if (firstId) {
        navigate(ROUTES_PATH.editQuestion.replace(':questionId', firstId))
      }
    },
    [navigate],
  )

  const columns = useMemo(
    () =>
      createQuestionColumns({
        onDelete: handleRequestDelete,
        onEdit: handleEditQuestion,
        onView: handleEditQuestion,
        hideModuleColumn: Boolean(fixedModule),
      }),
    [handleRequestDelete, handleEditQuestion, fixedModule],
  )
  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize))
  const gridPaginationModel = useMemo(
    () => ({
      ...paginationModel,
      page: Math.min(paginationModel.page, Math.max(0, totalPages - 1)),
    }),
    [paginationModel, totalPages],
  )

  const statsSummary = useMemo(() => {
    const countByModule = (module: QuestionType) =>
      backendRows.filter((row) => row.questionType === module).length

    return {
      total: backendRows.length,
      listening: countByModule('Listening'),
      reading: countByModule('Reading'),
      writing: countByModule('Writing'),
      speaking: countByModule('Speaking'),
    }
  }, [backendRows])

  const pageMeta = fixedModule
    ? MODULE_PAGE_META[fixedModule]
    : {
        title: 'All Questions',
        subtitle: 'Manage, search and organize your question bank.',
      }

  const moduleCount = fixedModule
    ? backendRows.filter((row) => row.questionType === fixedModule).length
    : null

  const addQuestionPath = fixedModule
    ? `${ROUTES_PATH.addQuestion}?module=${encodeURIComponent(fixedModule)}`
    : ROUTES_PATH.addQuestion

  return (
    <Layout>
      <QuestionsPageRoot>
        <Box className="question-page">
          <Box className="question-page__header">
            <Box>
              <Typography component="h1" className="question-page__title">
                {pageMeta.title}
              </Typography>
              <Typography className="question-page__subtitle">
                {pageMeta.subtitle}
              </Typography>
            </Box>

            <Button
              component={Link}
              to={addQuestionPath}
              className="question-page__primary-button"
              variant="primary"
            >
              + Add New Question
            </Button>
          </Box>

          <Box className="question-page__stats">
            {fixedModule ? (
              <Box className="question-page__stat-card">
                <Box className="question-page__stat-metrics">
                  <Box className="question-page__stat-value-row">
                    <Typography component="span" className="question-page__stat-value">
                      {moduleCount}
                    </Typography>
                  </Box>
                </Box>
                <Typography className="question-page__stat-label">{fixedModule}</Typography>
              </Box>
            ) : (
              <>
                <Box className="question-page__stat-card">
                  <Box className="question-page__stat-metrics">
                    <Box className="question-page__stat-value-row">
                      <Typography component="span" className="question-page__stat-value">
                        {statsSummary.total}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="question-page__stat-label">Total</Typography>
                </Box>
                <Box className="question-page__stat-card">
                  <Box className="question-page__stat-metrics">
                    <Box className="question-page__stat-value-row">
                      <Typography component="span" className="question-page__stat-value">
                        {statsSummary.listening}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="question-page__stat-label">Listening</Typography>
                </Box>
                <Box className="question-page__stat-card">
                  <Box className="question-page__stat-metrics">
                    <Box className="question-page__stat-value-row">
                      <Typography component="span" className="question-page__stat-value">
                        {statsSummary.reading}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="question-page__stat-label">Reading</Typography>
                </Box>
                <Box className="question-page__stat-card">
                  <Box className="question-page__stat-metrics">
                    <Box className="question-page__stat-value-row">
                      <Typography component="span" className="question-page__stat-value">
                        {statsSummary.writing}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="question-page__stat-label">Writing</Typography>
                </Box>
                <Box className="question-page__stat-card">
                  <Box className="question-page__stat-metrics">
                    <Box className="question-page__stat-value-row">
                      <Typography component="span" className="question-page__stat-value">
                        {statsSummary.speaking}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography className="question-page__stat-label">Speaking</Typography>
                </Box>
              </>
            )}
          </Box>

          <Box className="question-table">
            <Box className="question-table__filters">
              <SearchField
                className="question-table__search"
                placeholder="Search questions..."
                aria-label="Search questions"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPaginationModel((currentState) => ({
                    ...currentState,
                    page: 0,
                  }))
                }}
              />

              {!fixedModule && (
                <Select
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
                  options={[
                    { value: 'All IELTS modules', label: 'All modules' },
                    { value: 'Listening', label: 'Listening' },
                    { value: 'Reading', label: 'Reading' },
                    { value: 'Writing', label: 'Writing' },
                    { value: 'Speaking', label: 'Speaking' },
                  ]}
                />
              )}
            </Box>

            <Box className="question-table__grid">
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationMode="client"
                paginationModel={gridPaginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[...PAGE_SIZE_OPTIONS]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnMenu
                disableColumnResize
                rowHeight={64}
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
              />
            </Box>
          </Box>
        </Box>
      </QuestionsPageRoot>
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete question"
        description={
          pendingDelete
            ? `Are you sure you want to delete all ${pendingDelete.questionsCount} questions in "${pendingDelete.title}"? This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="error"
        loading={deleteLoading}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  )
}
