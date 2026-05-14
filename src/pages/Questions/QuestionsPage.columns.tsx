import { Box } from '@mui/material'

import { MenuActionCell } from '../../components/common/MenuAction'
import type { GridColDef } from '@mui/x-data-grid'

import type { QuestionGridRow } from './QuestionsPage.constants'
import { QuestionRowActionsMenu } from './components'

function ModuleCell({ moduleType }: { moduleType: string }) {
  return (
    <Box className="question-table__module-cell">
      <span className="question-table__module-text">{moduleType}</span>
    </Box>
  )
}

type CreateQuestionColumnsOptions = {
  onDelete?: (row: QuestionGridRow) => void
  onEdit?: (row: QuestionGridRow) => void
  onView?: (row: QuestionGridRow) => void
}

export function createQuestionColumns({
  onDelete,
  onEdit,
  onView,
}: CreateQuestionColumnsOptions): GridColDef<QuestionGridRow>[] {
  return [
    {
      field: 'questionType',
      headerName: 'Module',
      flex: 1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => <ModuleCell moduleType={params.row.questionType} />,
    },
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
