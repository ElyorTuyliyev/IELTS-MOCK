import { Box, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import { MenuActionCell } from '../../../components/common/MenuAction'
import { Button } from '../../../components/common/Button'
import { formatPriceInSom } from '../../../utils/priceFormat'
import type { ExamCard } from '../HomePage.constants'
import { ExamRowActionsMenu } from './ExamRowActionsMenu'

type ExamColumnHandlers = {
  canManageExams: boolean
  getStatusClassName: (status: ExamCard['status']) => string
  onView: (exam: ExamCard) => void
  onEdit: (exam: ExamCard) => void
  onDelete: (exam: ExamCard) => void
}

export function createExamsColumns(handlers: ExamColumnHandlers): GridColDef<ExamCard>[] {
  return [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: ({ row }) => (
        <Box className="exam-table__center-cell">
          <Typography className="exam-table__title" title={row.title}>
            {row.title}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'examiner',
      headerName: 'Examiner',
      flex: 1,
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'startTime',
      headerName: 'Time',
      flex: 1,
      minWidth: 130,
      sortable: false,
      valueGetter: (_, row) => `${row.startTime} - ${row.endTime}`,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box className="exam-table__center-cell">
          <Typography className="exam-table__meta">{formatPriceInSom(row.price)}</Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      flex: 1,
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography component="span" className={handlers.getStatusClassName(row.status)}>
          {row.status}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: handlers.canManageExams ? 160 : 140,
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      maxWidth: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        
        <Box
          className="exam-table__actions"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Button
            className="exam-table__view-btn"
            variant="secondary"
            type="button"
            onClick={() => handlers.onView(row)}
          >
            View
          </Button>
          {handlers.canManageExams ? (
            <MenuActionCell>
              <ExamRowActionsMenu
                className="exam-table__menu-action"
                exam={row}
                onEdit={handlers.onEdit}
                onDelete={handlers.onDelete}
              />
            </MenuActionCell>
          ) : null}
        </Box>
      ),
    },
  ]
}
