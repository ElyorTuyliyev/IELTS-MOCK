import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { CENTERS, CENTER_PAGE_SIZE, CENTER_STATS } from '../../constants/centers'
import { ROUTES_PATH } from '../../routes'
import { CentersPageRoot } from './CentersPage.style'

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-left', totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis-right', totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, 'ellipsis-left', currentPage, 'ellipsis-right', totalPages] as const
}

export function CentersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name' | 'Students'>('Name')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: CENTER_PAGE_SIZE,
  })

  const filteredCenters = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleCenters = CENTERS.filter((center) => {
      return (
        normalizedSearch.length === 0 ||
        center.name.toLowerCase().includes(normalizedSearch) ||
        center.location.toLowerCase().includes(normalizedSearch) ||
        center.status.toLowerCase().includes(normalizedSearch)
      )
    })

    return [...visibleCenters].sort((left, right) => {
      if (sortOption === 'Students') {
        return Number(right.students) - Number(left.students)
      }

      return left.name.localeCompare(right.name)
    })
  }, [searchTerm, sortOption])

  const rows = useMemo(
    () =>
      filteredCenters.map((center) => ({
        ...center,
      })),
    [filteredCenters],
  )

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'name',
        headerName: 'Center name',
        minWidth: 240,
        flex: 1.2,
        sortable: false,
      },
      {
        field: 'location',
        headerName: 'Location',
        minWidth: 240,
        flex: 1.15,
        sortable: false,
      },
      {
        field: 'students',
        headerName: 'Students',
        minWidth: 120,
        sortable: false,
      },
      {
        field: 'teachers',
        headerName: 'Teachers',
        minWidth: 120,
        sortable: false,
      },
      {
        field: 'rooms',
        headerName: 'Rooms',
        minWidth: 110,
        sortable: false,
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 140,
        sortable: false,
        renderCell: (params) => (
          <span
            className={`centers-table__pill centers-table__pill--${String(params.value)
              .toLowerCase()
              .replace(/\s+/g, '-')}`}
          >
            {String(params.value)}
          </span>
        ),
      },
    ],
    [],
  )

  const currentPage = paginationModel.page + 1
  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize))
  const visiblePages = getVisiblePages(currentPage, totalPages)
  const rangeStart = rows.length === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1
  const rangeEnd =
    rows.length === 0
      ? 0
      : Math.min((paginationModel.page + 1) * paginationModel.pageSize, rows.length)

  useEffect(() => {
    if (paginationModel.page > totalPages - 1) {
      setPaginationModel((currentState) => ({
        ...currentState,
        page: Math.max(0, totalPages - 1),
      }))
    }
  }, [paginationModel.page, totalPages])

  return (
    <Layout>
      <CentersPageRoot>
        <Box className="centers-page">
          <Box className="centers-page__header">
            <Box>
              <Typography component="h1" className="centers-page__title">
                Centers
              </Typography>
              <Typography component="p" className="centers-page__description">
                Barcha filiallar bo‘yicha student oqimi, o‘qituvchi bandligi va
                operatsion holatni bitta joydan kuzatish uchun tayyor dashboard.
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.addCenter}
              className="centers-page__cta"
              variant="contained"
            >
              + Add New Center
            </Button>
          </Box>

          <Box className="centers-page__stats">
            {CENTER_STATS.map((item) => (
              <Box key={item.label} className="centers-stat">
                <Typography component="span" className="centers-stat__label">
                  {item.label}
                </Typography>
                <Typography component="p" className="centers-stat__value">
                  {item.value}
                </Typography>
                <Typography component="p" className="centers-stat__meta">
                  {item.meta}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="centers-panel">
            <Box className="centers-panel__header">
              <Box>
                <Typography component="h2" className="centers-panel__title">
                  Branch Overview
                </Typography>
                <Typography component="p" className="centers-panel__subtitle">
                  Asosiy ko‘rsatkichlari bilan faol markazlar ro‘yxati.
                </Typography>
              </Box>
            </Box>

            <Box className="centers-table">
              <Box className="centers-table__filters">
                <TextField
                  className="centers-table__search"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search centers"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setPaginationModel((currentState) => ({
                      ...currentState,
                      page: 0,
                    }))
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box className="centers-table__search-icon">⌕</Box>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Box className="centers-table__actions">
                  <TextField
                    select
                    className="centers-table__select"
                    aria-label="Sort centers"
                    value={sortOption}
                    onChange={(event) => {
                      setSortOption(event.target.value as 'Name' | 'Students')
                      setPaginationModel((currentState) => ({
                        ...currentState,
                        page: 0,
                      }))
                    }}
                  >
                    <MenuItem value="Name">Name</MenuItem>
                    <MenuItem value="Students">Students</MenuItem>
                  </TextField>

                  <Button className="centers-table__ghost-button" variant="outlined">
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
                onPaginationModelChange={setPaginationModel}
                localeText={{
                  noRowsLabel: 'No centers matched the current search.',
                }}
                initialState={{
                  pagination: {
                    paginationModel: {
                      page: 0,
                      pageSize: CENTER_PAGE_SIZE,
                    },
                  },
                }}
                sx={{
                  border: 0,
                }}
              />

              <Box className="centers-table__footer">
                <Box className="centers-table__pagination">
                  <Button
                    className="centers-table__page-button"
                    variant="outlined"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setPaginationModel((currentState) => ({
                        ...currentState,
                        page: Math.max(0, currentState.page - 1),
                      }))
                    }
                  >
                    ‹
                  </Button>

                  {visiblePages.map((item) =>
                    typeof item === 'number' ? (
                      <Button
                        key={item}
                        className={`centers-table__page-number${
                          item === currentPage
                            ? ' centers-table__page-number--active'
                            : ''
                        }`}
                        variant="text"
                        onClick={() =>
                          setPaginationModel((currentState) => ({
                            ...currentState,
                            page: item - 1,
                          }))
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
                    variant="outlined"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setPaginationModel((currentState) => ({
                        ...currentState,
                        page: Math.min(totalPages - 1, currentState.page + 1),
                      }))
                    }
                  >
                    ›
                  </Button>
                </Box>

                <Box className="centers-table__footer-meta">
                  <span>
                    Showing {rangeStart} to {rangeEnd} of {rows.length} entries
                  </span>
                  <Button className="centers-table__show-button" variant="outlined">
                    Show {paginationModel.pageSize} ⌃
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CentersPageRoot>
    </Layout>
  )
}
