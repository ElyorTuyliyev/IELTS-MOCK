import { memo, useMemo } from 'react'
import {
  Box,
  Typography,
} from '@mui/material'
import { DataGrid, type GridPaginationModel } from '@mui/x-data-grid'

import { Button } from '../../../../components/common/Button'
import { SearchField } from '../../../../components/common/SearchField'
import { Select } from '../../../../components/common/Select'
import { CENTER_PAGE_SIZE } from '../../api/centersData'
import { getVisiblePages } from '../../components/pagination'
import type { EditableCenter, MappedCenterRow } from '@/types/centers'
import { createCentersColumns } from './CentersColumns'

type CentersTableProps = {
  rows: MappedCenterRow[]
  searchTerm: string
  paginationModel: GridPaginationModel
  currentPage: number
  totalPages: number
  rangeStart: number
  rangeEnd: number
  canDeleteCenter: boolean
  canEditCenter: boolean
  onSearchChange: (value: string) => void
  onPaginationChange: (model: GridPaginationModel) => void
  onDelete: (id: string) => void
  onEdit: (row: EditableCenter) => void
  onView: (row: EditableCenter) => void
}

export const CentersTable = memo(function CentersTable({
  rows,
  searchTerm,
  paginationModel,
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  canDeleteCenter,
  canEditCenter,
  onSearchChange,
  onPaginationChange,
  onDelete,
  onEdit,
  onView,
}: CentersTableProps) {
  // FIX: columns now stable — handlers are memoized with useCallback in the hook
  // No `isDeletingCenter` in deps
  const columns = useMemo(
    () =>
      createCentersColumns({
        canDeleteCenter,
        canEditCenter,
        onDelete,
        onEdit,
        onView,
      }),
    [canDeleteCenter, canEditCenter, onDelete, onEdit, onView],
  )

  const visiblePages = getVisiblePages(currentPage, totalPages)

  return (
    <Box className="centers-panel">
      <Box className="centers-panel__header">
        <Box>
          <Typography component="h2" className="centers-panel__title">
            Branch Overview
          </Typography>
          <Typography component="p" className="centers-panel__subtitle">
            List of active centers with key metrics.
          </Typography>
        </Box>
      </Box>

      <Box className="centers-table">
        <Box className="centers-table__filters">
          <SearchField
            className="centers-table__search"
            aria-label="Search centers"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <Box className="centers-table__actions">
            <Select
              className="centers-table__select"
              aria-label="Sort centers"
              value="Name"
              onChange={() => {}}
              options={[{ value: 'Name', label: 'Name' }]}
            />

            <Button className="centers-table__ghost-button" variant="secondary">
              Display columns
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnResize
          hideFooter
          autoHeight
          rowHeight={66}
          columnHeaderHeight={54}
          pageSizeOptions={[CENTER_PAGE_SIZE]}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationChange}
          localeText={{ noRowsLabel: 'No centers matched the current search.' }}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: CENTER_PAGE_SIZE } },
          }}
          sx={{ border: 0 }}
        />

        <Box className="centers-table__footer">
          <Box className="centers-table__pagination">
            <Button
              className="centers-table__page-button"
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() =>
                onPaginationChange({
                  ...paginationModel,
                  page: Math.max(0, paginationModel.page - 1),
                })
              }
            >
              ‹
            </Button>

            {visiblePages.map((item) =>
              typeof item === 'number' ? (
                <Button
                  key={item}
                  className={`centers-table__page-number${
                    item === currentPage ? ' centers-table__page-number--active' : ''
                  }`}
                  variant="text"
                  onClick={() =>
                    onPaginationChange({ ...paginationModel, page: item - 1 })
                  }
                >
                  {item}
                </Button>
              ) : (
                <span key={item} className="centers-table__page-ellipsis">
                  ...
                </span>
              ),
            )}

            <Button
              className="centers-table__page-button"
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() =>
                onPaginationChange({
                  ...paginationModel,
                  page: Math.min(totalPages - 1, paginationModel.page + 1),
                })
              }
            >
              ›
            </Button>
          </Box>

          <Box className="centers-table__footer-meta">
            <span>
              Showing {rangeStart} to {rangeEnd} of {rows.length} entries
            </span>
            <Button className="centers-table__show-button" variant="secondary">
              Show {paginationModel.pageSize} ⌃
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})
