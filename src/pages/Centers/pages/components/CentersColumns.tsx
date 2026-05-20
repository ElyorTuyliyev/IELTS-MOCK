import { Box, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import { MenuActionCell } from '../../../../components/common/MenuAction'
import type { EditableCenter, MappedCenterRow } from '@/types/centers'
import { CenterRowActionsMenu } from './CenterRowActionsMenu'

type CenterColumnHandlers = {
  canDeleteCenter: boolean
  canEditCenter: boolean
  onDelete: (id: string) => void
  onEdit: (row: EditableCenter) => void
}

function getCenterInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function createCentersColumns(handlers: CenterColumnHandlers): GridColDef<MappedCenterRow>[] {
  return [
    {
      field: 'name',
      headerName: 'center',
      minWidth: 260,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const name = String(params.row.name ?? '')
        const logo = String(params.row.logo ?? '')
        const manager = String(params.row.manager ?? '')

        return (
          <Box className="centers-page__center-cell">
            <Box className="centers-page__center-avatar" aria-hidden="true">
              {logo ? (
                <Box component="img" src={logo} alt="" />
              ) : (
                getCenterInitials(name)
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography component="p" className="centers-page__center-name">
                {name}
              </Typography>
              <Typography component="p" className="centers-page__center-meta">
                {manager !== 'N/A' ? manager : 'No manager assigned'}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      field: 'email',
      headerName: 'email',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box component="span" className="centers-page__email">
          {String(params.value ?? '—')}
        </Box>
      ),
    },
    {
      field: 'phone',
      headerName: 'phone',
      minWidth: 150,
      sortable: false,
    },
    {
      field: 'address',
      headerName: 'address',
      minWidth: 220,
      flex: 1.1,
      sortable: false,
    },
    {
      field: 'availableExamCredits',
      headerName: 'credits',
      minWidth: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const credits = Number(params.value ?? 0)
        return (
          <Box
            component="span"
            className={`centers-page__credits${
              credits === 0 ? ' centers-page__credits--zero' : ''
            }`}
          >
            {credits}
          </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'action',
      width: 90,
      minWidth: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      pinned: 'right',
      renderCell: (params) => {
        const row: EditableCenter = {
          id: String(params.row.id),
          name: String(params.row.name ?? ''),
          manager: String(params.row.manager ?? ''),
          email: String(params.row.email ?? ''),
          phone: String(params.row.phone ?? ''),
          address: String(params.row.address ?? ''),
          logo: String(params.row.logo ?? ''),
          establishedAt: String(params.row.establishedAt ?? ''),
          availableExamCredits: Number(params.row.availableExamCredits ?? 0),
        }
        return (
          <MenuActionCell>
            <CenterRowActionsMenu
              row={row}
              canDeleteCenter={handlers.canDeleteCenter}
              canEditCenter={handlers.canEditCenter}
              onDelete={handlers.onDelete}
              onEdit={handlers.onEdit}
            />
          </MenuActionCell>
        )
      },
    },
  ]
}
