import { memo, useMemo } from 'react'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import { Box, CircularProgress, Typography } from '@mui/material'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { SearchField } from '../../../../components/common/SearchField'
import { CENTER_PAGE_SIZE, CENTER_PAGE_SIZE_OPTIONS } from '../../api/centersData'
import type { EditableCenter, MappedCenterRow } from '@/types/centers'
import { createCentersColumns } from './CentersColumns'

type CentersTableProps = {
  rows: MappedCenterRow[]
  searchTerm: string
  loading: boolean
  paginationModel: GridPaginationModel
  canDeleteCenter: boolean
  canEditCenter: boolean
  onSearchChange: (value: string) => void
  onPaginationChange: (model: GridPaginationModel) => void
  onDelete: (id: string) => void
  onEdit: (row: EditableCenter) => void
  onRowClick: (row: EditableCenter) => void
}

export const CentersTable = memo(function CentersTable({
  rows,
  searchTerm,
  loading,
  paginationModel,
  canDeleteCenter,
  canEditCenter,
  onSearchChange,
  onPaginationChange,
  onDelete,
  onEdit,
  onRowClick,
}: CentersTableProps) {
  const columns = useMemo(
    () =>
      createCentersColumns({
        canDeleteCenter,
        canEditCenter,
        onDelete,
        onEdit,
      }),
    [canDeleteCenter, canEditCenter, onDelete, onEdit],
  )

  const hasSearch = searchTerm.trim().length > 0
  const showEmpty = !loading && rows.length === 0

  return (
    <Box className="centers-page__panel">
      <Box className="centers-page__panel-head">
        <Box>
          <Typography component="h2" className="centers-page__panel-title">
            All centers
          </Typography>
          <Typography component="p" className="centers-page__panel-subtitle">
            Search by name, email, phone, address, or manager.
          </Typography>
        </Box>
        <span className="centers-page__panel-count">{rows.length} listed</span>
      </Box>

      <Box className="centers-page__toolbar">
        <SearchField
          className="centers-page__search"
          aria-label="Search centers"
          placeholder="Search centers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {!showEmpty ? (
          <span className="centers-page__result-hint">
            {hasSearch
              ? `${rows.length} result${rows.length === 1 ? '' : 's'} for "${searchTerm.trim()}"`
              : `${rows.length} center${rows.length === 1 ? '' : 's'} total`}
          </span>
        ) : null}
      </Box>

      <Box className="centers-page__table-wrap">
        {loading && rows.length === 0 ? (
          <Box className="centers-page__loading">
            <CircularProgress size={28} />
          </Box>
        ) : showEmpty ? (
          <Box className="centers-page__empty">
            <Box className="centers-page__empty-icon" aria-hidden="true">
              <BusinessOutlinedIcon />
            </Box>
            <Typography component="h2">
              {hasSearch ? 'No centers match your search' : 'No centers yet'}
            </Typography>
            <Typography component="p">
              {hasSearch
                ? 'Try a different name, email, or address keyword.'
                : 'Add your first center to start managing branches and exam credits.'}
            </Typography>
          </Box>
        ) : (
          <Box className="centers-page__table">
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              pagination
              paginationMode="client"
              paginationModel={paginationModel}
              onPaginationModelChange={onPaginationChange}
              pageSizeOptions={[...CENTER_PAGE_SIZE_OPTIONS]}
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnResize
              onRowClick={(params, event) => {
                const target = event.target as HTMLElement
                if (target.closest('button')) return
                onRowClick({
                  id: String(params.row.id),
                  name: String(params.row.name ?? ''),
                  manager: String(params.row.manager ?? ''),
                  email: String(params.row.email ?? ''),
                  phone: String(params.row.phone ?? ''),
                  address: String(params.row.address ?? ''),
                  logo: String(params.row.logo ?? ''),
                  establishedAt: String(params.row.establishedAt ?? ''),
                  availableExamCredits: Number(params.row.availableExamCredits ?? 0),
                })
              }}
              rowHeight={72}
              columnHeaderHeight={48}
              density="comfortable"
              localeText={{
                noRowsLabel: 'No centers matched the current search.',
              }}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: CENTER_PAGE_SIZE } },
              }}
              sx={{
                border: 0,
                '& .MuiDataGrid-row': { cursor: 'pointer' },
              }}
              slotProps={{
                cell: {
                  onMouseDown: (event) => {
                    const target = event.target as HTMLElement
                    if (target.closest('button')) {
                      event.stopPropagation()
                    }
                  },
                },
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
        )}
      </Box>
    </Box>
  )
})
