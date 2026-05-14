import { memo } from 'react'
import { Box } from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { c } from '../../../theme'
import { SearchField } from '../../../components/common/SearchField'
import { Select } from '../../../components/common/Select'

import type { StudentGridRow } from '../AllStudentsPage.constants'

type StudentsTableProps = {
  rows: StudentGridRow[]
  columns: GridColDef<StudentGridRow>[]
  loading: boolean
  searchTerm: string
  sortOption: string
  paginationModel: GridPaginationModel
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  onPaginationChange: (model: GridPaginationModel) => void
}

export const StudentsTable = memo(function StudentsTable({
  rows,
  columns,
  loading,
  searchTerm,
  sortOption,
  paginationModel,
  onSearchChange,
  onSortChange,
  onPaginationChange,
}: StudentsTableProps) {
  return (
    <Box className="students-table">
      <Box className="students-table__filters">
        <SearchField
          className="students-table__search"
          aria-label="Search students"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Box className="students-table__actions">
          <Select
            className="students-table__select"
            aria-label="Sort students"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            options={[
              { value: 'Name', label: 'Name' },
              { value: 'Creation date', label: 'Creation date' },
            ]}
          />
        </Box>
      </Box>

      <Box className="students-table__grid-wrap">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          pageSizeOptions={[8, 10, 25, 50]}
          disableRowSelectionOnClick
          rowHeight={72}
          columnHeaderHeight={54}
          localeText={{
            noRowsLabel: 'No students matched the current search.',
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
