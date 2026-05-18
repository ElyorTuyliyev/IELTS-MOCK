import { Box } from '@mui/material'

import { MenuActionCell } from '../../components/common/MenuAction'
import type { GridColDef } from '@mui/x-data-grid'

import type { QuestionGridRow } from './QuestionsPage.constants'
import { QuestionRowActionsMenu } from './components'

type CreateQuestionColumnsOptions = {
  onDelete?: (row: QuestionGridRow) => void
  onEdit?: (row: QuestionGridRow) => void
  onView?: (row: QuestionGridRow) => void
  hideModuleColumn?: boolean
}

export function createQuestionColumns({
  onDelete,
  onEdit,
  onView,
  hideModuleColumn = false,
}: CreateQuestionColumnsOptions): GridColDef<QuestionGridRow>[] {
  const moduleColumn: GridColDef<QuestionGridRow> = {
    field: 'questionType',
    headerName: 'Module',
    flex: 1,
    sortable: false,
    headerAlign: 'left',
    renderCell: (params) => (
      <Box className="question-table__module-cell">
        <span className="question-table__module-text">{params.row.questionType}</span>
      </Box>
    ),
  }

  return [
    ...(hideModuleColumn ? [] : [moduleColumn]),
    {
      field: 'title',
      headerName: 'Title',
      flex: 1.6,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__title" title={params.row.title}>
          {params.row.title}
        </span>
      ),
    },
    {
      field: 'partsCount',
      headerName: 'Parts',
      flex:1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta question-table__meta--strong">
          {params.row.partsCount} {params.row.partsCount === 1 ? 'part' : 'parts'}
        </span>
      ),
    },
    {
      field: 'questionsCount',
      headerName: 'Questions',
      flex:1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta">
          {params.row.questionsCount} {params.row.questionsCount === 1 ? 'question' : 'questions'}
        </span>
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      flex:1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="question-table__meta question-table__meta--strong">
          {params.row.author}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex:1,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <MenuActionCell>
          <QuestionRowActionsMenu
            row={params.row}
            onDelete={onDelete}
            onEdit={onEdit}
            onView={onView}
          />
        </MenuActionCell>
      ),
    },
  ]
}
