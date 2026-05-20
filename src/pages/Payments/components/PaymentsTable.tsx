import { memo } from 'react'
import { Box } from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { SearchField } from '../../../components/common/SearchField'

type PaymentsTableProps<TRow extends { _id: string }> = {
  rows: TRow[]
  columns: GridColDef<TRow>[]
  loading?: boolean
  search: string
  searchPlaceholder: string
  resultHint: string
  emptyLabel: string
  paginationModel: GridPaginationModel
  onSearchChange: (value: string) => void
  onPaginationChange: (model: GridPaginationModel) => void
}

export const PaymentsTable = memo(function PaymentsTable<
  TRow extends { _id: string },
>({
  rows,
  columns,
  loading = false,
  search,
  searchPlaceholder,
  resultHint,
  emptyLabel,
  paginationModel,
  onSearchChange,
  onPaginationChange,
}: PaymentsTableProps<TRow>) {
  return (
    <Box className="payments-table">
      <Box className="payments-table__filters">
        <SearchField
          className="payments-table__search"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <span className="payments-table__hint">{resultHint}</span>
      </Box>

      <Box className="payments-table__grid-wrap">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          rowHeight={64}
          columnHeaderHeight={52}
          density="comfortable"
          localeText={{
            noRowsLabel: loading ? 'Loading…' : emptyLabel,
          }}
          sx={{ border: 0 }}
        />
      </Box>
    </Box>
  )
}) as <TRow extends { _id: string }>(
  props: PaymentsTableProps<TRow>,
) => JSX.Element
