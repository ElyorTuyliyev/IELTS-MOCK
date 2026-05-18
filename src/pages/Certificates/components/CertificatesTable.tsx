import { memo } from 'react'
import { Box } from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { c } from '../../../theme'
import { SearchField } from '../../../components/common/SearchField'
import type { CertificateRecord, CertificateStatus } from '../certificates.data'

type StatusFilter = 'all' | CertificateStatus

type CertificatesTableProps = {
  rows: CertificateRecord[]
  columns: GridColDef<CertificateRecord>[]
  search: string
  statusFilter: StatusFilter
  statusFilters: Array<{ value: StatusFilter; label: string }>
  paginationModel: GridPaginationModel
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: StatusFilter) => void
  onPaginationChange: (model: GridPaginationModel) => void
}

export const CertificatesTable = memo(function CertificatesTable({
  rows,
  columns,
  search,
  statusFilter,
  statusFilters,
  paginationModel,
  onSearchChange,
  onStatusFilterChange,
  onPaginationChange,
}: CertificatesTableProps) {
  return (
    <Box className="certificates-table">
      <Box className="certificates-table__filters">
        <SearchField
          className="certificates-table__search"
          aria-label="Search certificates"
          placeholder="Search student, exam, code…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Box className="certificates-table__chips" role="group" aria-label="Filter by status">
          {statusFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={
                statusFilter === item.value
                  ? 'certificates-table__chip certificates-table__chip--active'
                  : 'certificates-table__chip'
              }
              onClick={() => onStatusFilterChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </Box>
      </Box>

      <Box className="certificates-table__grid-wrap">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          pageSizeOptions={[5, 8, 10, 25]}
          disableRowSelectionOnClick
          rowHeight={64}
          columnHeaderHeight={52}
          density="comfortable"
          localeText={{
            noRowsLabel: 'No certificates matched the current filters.',
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${c.border.medium}`,
            },
          }}
        />
      </Box>
    </Box>
  )
})
