import { Box, IconButton, Tooltip } from '@mui/material'
import { c } from '../../../../theme'
import type { GridColDef } from '@mui/x-data-grid'

import type { EditableCenter, MappedCenterRow } from '@/types/centers'

const ACTION_ICON_SX = {
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: '10px',
  border: `1px solid ${c.border.soft}`,
  backgroundColor: c.surface.default,
  color: c.text.secondary,
  '&:hover': { backgroundColor: c.surface.muted, borderColor: c.border.strong },
  '&.Mui-disabled': { borderColor: c.border.dashed, color: c.neutral[900] },
} as const

const DELETE_ICON_SX = {
  ...ACTION_ICON_SX,
  '&:hover': { backgroundColor: c.error.bg, borderColor: c.error.border, color: c.error.bright },
} as const

const ICON_SX = { width: 20, height: 20 } as const

const DELETE_ICON = (
  <Box component="svg" viewBox="0 0 24 24" sx={ICON_SX} fill="currentColor" aria-hidden>
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
  </Box>
)

const EDIT_ICON = (
  <Box component="svg" viewBox="0 0 24 24" sx={ICON_SX} fill="currentColor" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Box>
)

const VIEW_ICON = (
  <Box component="svg" viewBox="0 0 24 24" sx={ICON_SX} fill="currentColor" aria-hidden>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </Box>
)

type CenterColumnHandlers = {
  canDeleteCenter: boolean
  canEditCenter: boolean
  onDelete: (id: string) => void
  onEdit: (row: EditableCenter) => void
  onView: (row: EditableCenter) => void
}

export function createCentersColumns(handlers: CenterColumnHandlers): GridColDef<MappedCenterRow>[] {
  return [
    {
      field: 'logo',
      headerName: 'Logo',
      minWidth: 120,
      sortable: false,
      renderCell: (params) =>
        params.value ? (
          <Box
            component="img"
            src={String(params.value)}
            alt="Center logo"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              objectFit: 'cover',
              border: `1px solid ${c.border.medium}`,
            }}
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      field: 'name',
      headerName: 'Center name',
      minWidth: 200,
      flex: 1,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 220,
      flex: 1.1,
      sortable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone number',
      minWidth: 160,
      sortable: false,
    },
    {
      field: 'address',
      headerName: 'Address',
      minWidth: 240,
      flex: 1.2,
      sortable: false,
    },
    {
      field: 'manager',
      headerName: 'Manager',
      minWidth: 160,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: 'Action',
      minWidth: 148,
      maxWidth: 160,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
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
        }
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 0.75,
              flexWrap: 'nowrap',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Tooltip title="Delete">
              <span>
                <IconButton
                  size="small"
                  disabled={!handlers.canDeleteCenter}
                  onClick={() => handlers.onDelete(row.id)}
                  aria-label="Delete center"
                  sx={DELETE_ICON_SX}
                >
                  {DELETE_ICON}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  size="small"
                  disabled={!handlers.canEditCenter}
                  onClick={() => handlers.onEdit(row)}
                  aria-label="Edit center"
                  sx={ACTION_ICON_SX}
                >
                  {EDIT_ICON}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="View">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlers.onView(row)}
                  aria-label="View center"
                  sx={ACTION_ICON_SX}
                >
                  {VIEW_ICON}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )
      },
    },
  ]
}
