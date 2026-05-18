import { Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import { MenuActionCell } from '../../components/common/MenuAction'

import type { StudentGridRow, StudentStatus } from './AllStudentsPage.constants'
import { StudentRowActionsMenu } from './components/StudentRowActionsMenu'

function getStatusClassName(status: StudentStatus) {
  return `students-table__pill students-table__pill--${status.toLowerCase()}`
}

export function createStudentColumns(): GridColDef<StudentGridRow>[] {
  return createStudentColumnsWithActions({})
}

type StudentColumnActionHandlers = {
  onDelete?: (row: StudentGridRow) => void
  onEdit?: (row: StudentGridRow) => void
}

export function createStudentColumnsWithActions(
  handlers: StudentColumnActionHandlers,
): GridColDef<StudentGridRow>[] {
  return [
    {
      field: 'serial',
      headerName: 'No',
      minWidth: 72,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="students-table__serial">{params.row.serial}</span>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1.1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <Typography component="span" className="students-table__name-text">
          {params.row.name}
        </Typography>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 150,
      flex: 0.9,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="students-table__meta">{params.row.phone}</span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 220,
      flex: 1,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="students-table__meta students-table__meta--strong">
          {params.row.email}
        </span>
      ),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      minWidth: 110,
      flex: 0.7,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="students-table__meta">{params.row.gender}</span>
      ),
    },
    {
      field: 'creationDate',
      headerName: 'Create date',
      minWidth: 150,
      flex: 0.9,
      sortable: false,
      headerAlign: 'left',
      renderCell: (params) => (
        <span className="students-table__meta">{params.row.creationDate}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      sortable: false,
      headerAlign: 'center',
      renderCell: (params) => (
        <span className={getStatusClassName(params.row.status)}>
          {params.row.status}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Action',
      minWidth: 72,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <MenuActionCell>
          <StudentRowActionsMenu
            row={params.row}
            onDelete={handlers.onDelete}
            onEdit={handlers.onEdit}
          />
        </MenuActionCell>
      ),
    },
  ]
}
