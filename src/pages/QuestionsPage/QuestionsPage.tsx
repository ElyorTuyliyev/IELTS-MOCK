import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { ROUTES_PATH } from '../../routes'
import { createQuestionColumns } from './QuestionsPage.columns'
import {
  QUESTIONS,
  QUESTION_PAGE_SIZE,
  type QuestionType,
} from './QuestionsPage.constants'
import { QuestionsPageRoot } from './QuestionsPage.style'

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

export function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All question types' | QuestionType>(
    'All question types',
  )
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: QUESTION_PAGE_SIZE,
  })

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return QUESTIONS.filter((question) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        question.title.toLowerCase().includes(normalizedSearch) ||
        question.tag.toLowerCase().includes(normalizedSearch) ||
        question.author.toLowerCase().includes(normalizedSearch) ||
        question.category.toLowerCase().includes(normalizedSearch)

      const matchesType =
        typeFilter === 'All question types' ||
        question.questionType === typeFilter

      return matchesSearch && matchesType
    })
  }, [searchTerm, typeFilter])

  const rows = useMemo(
    () =>
      filteredQuestions.map((question, index) => ({
        id: `${question.title}-${question.tag}-${index}`,
        ...question,
      })),
    [filteredQuestions],
  )

  const columns = useMemo(() => createQuestionColumns(), [])
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
                  aria-label="Question types"
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(
                      event.target.value as 'All question types' | QuestionType,
                    )
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: 0,
                    }))
                  }}
                >
                  <MenuItem value="All question types">Question types</MenuItem>
                  <MenuItem value="Multiple response">Multiple response</MenuItem>
                  <MenuItem value="Single choice">Single choice</MenuItem>
                  <MenuItem value="Matching">Matching</MenuItem>
                </TextField>

                <Button className="question-table__ghost-button" variant="outlined">
                  Add new category
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
              rowHeight={66}
              columnHeaderHeight={54}
              pageSizeOptions={[QUESTION_PAGE_SIZE]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              localeText={{
                noRowsLabel:
                  'No questions matched the current search or type filter.',
              }}
              initialState={{
                pagination: {
                  paginationModel: {
                    page: 0,
                    pageSize: QUESTION_PAGE_SIZE,
                  },
                },
              }}
              sx={{
                border: 0,
              }}
            />

            <Box className="question-table__footer">
              <Box className="question-table__pagination">
                <Button
                  className="question-table__page-button"
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
                      className={`question-table__page-number${
                        item === currentPage
                          ? ' question-table__page-number--active'
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
                    <span key={item} className="question-table__page-ellipsis">
                      ...
                    </span>
                  ),
                )}

                <Button
                  className="question-table__page-button"
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

              <Box className="question-table__footer-meta">
                <span>
                  Showing {rangeStart} to {rangeEnd} of {rows.length} entries
                </span>
                <Button className="question-table__show-button" variant="outlined">
                  Show {paginationModel.pageSize} ⌃
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </QuestionsPageRoot>
    </Layout>
  )
}
