import { Box, IconButton } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import type { QuestionGridRow } from './QuestionsPage.constants'

function getErrorRateSegments(errorRate: number) {
  const clampedRate = Math.max(0, Math.min(errorRate, 100))
  const activeCount = Math.round(clampedRate / 25)

  return Array.from({ length: 4 }, (_, index) => index < activeCount)
}

export function createQuestionColumns(): GridColDef<QuestionGridRow>[] {
  return [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.5,
      minWidth: 300,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__title">{params.row.title}</span>
      ),
    },
    {
      field: 'tag',
      headerName: 'Tags',
      minWidth: 150,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta">{params.row.tag}</span>
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      minWidth: 160,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta question-table__meta--strong">
          {params.row.author}
        </span>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 140,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta">{params.row.category}</span>
      ),
    },
    {
      field: 'questionType',
      headerName: 'Question type',
      minWidth: 190,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__type">{params.row.questionType}</span>
      ),
    },
    {
      field: 'errorRate',
      headerName: 'Error rate',
      minWidth: 160,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <Box className="question-table__error-rate">
          <Box className="question-table__error-bars" aria-hidden="true">
            {getErrorRateSegments(params.row.errorRate).map((isActive, index) => (
              <Box
                key={`${params.row.id}-error-${index}`}
                className={`question-table__error-bar${
                  isActive ? ' question-table__error-bar--active' : ''
                }`}
              />
            ))}
          </Box>
          <span className="question-table__error-text">
            {String(params.row.errorRate).padStart(2, '0')}%
          </span>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      minWidth: 136,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: 'left',
      renderCell: () => (
        <Box className="question-table__action-buttons">
          <IconButton
            className="question-table__icon-button"
            aria-label="Delete question"
          >
            🗑
          </IconButton>
          <IconButton
            className="question-table__icon-button"
            aria-label="Edit question"
          >
            ✎
          </IconButton>
          <IconButton
            className="question-table__icon-button"
            aria-label="View question"
          >
            👁
          </IconButton>
        </Box>
      ),
    },
  ]
}
