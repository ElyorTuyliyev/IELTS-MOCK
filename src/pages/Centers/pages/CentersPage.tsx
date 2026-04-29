import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Button, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { ROUTES_PATH } from '../../../routes'
import { selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { CENTER_PAGE_SIZE, CENTERS, CENTER_STATS } from '../api/centersData'
import { REMOVE_CENTER_MUTATION } from '../api/deleteCenterMutation'
import { GET_ALL_CENTERS_QUERY } from '../api/getAllCentersQuery'
import { getVisiblePages } from '../components/pagination'
import { CentersPageRoot } from './CentersPage.style'

type FindAllCentersQueryResponse = {
  findAllCenters: Array<{
    _id: string
    name: string
    address: string
    phone: string
    email: string
    logo?: string | null
    establishedAt?: string | null
    createdAt: string
    updatedAt: string
  }>
}

type DeleteCenterMutationResponse = {
  removeCenter: boolean | null
}

type DeleteCenterMutationVariables = {
  _id: string
}

type EditableCenter = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  logo: string
  establishedAt?: string
}

export function CentersPage() {
  const navigate = useNavigate()
  const role = useAppSelector(selectUserRole)
  const canCreateCenter = role === USER_ROLES.superAdmin
  const canDeleteCenter = role === USER_ROLES.superAdmin
  const canEditCenter = role === USER_ROLES.superAdmin
  const { data: centersData, refetch: refetchCenters } =
    useQuery<FindAllCentersQueryResponse>(GET_ALL_CENTERS_QUERY)
  const [deleteCenter, { loading: isDeletingCenter }] = useMutation<
    DeleteCenterMutationResponse,
    DeleteCenterMutationVariables
  >(REMOVE_CENTER_MUTATION)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name'>('Name')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: CENTER_PAGE_SIZE,
  })

  const filteredCenters = useMemo(() => {
    const serverCenters = centersData?.findAllCenters ?? []
    const sourceCenters =
      serverCenters.length > 0
        ? serverCenters.map((center) => ({
            id: center._id,
            name: center.name,
            email: center.email,
            phone: center.phone,
            address: center.address,
            manager: 'N/A',
            logo: center.logo ?? '',
            establishedAt: center.establishedAt ?? '',
          }))
        : CENTERS.map((center) => ({
            id: center.id,
            name: center.name,
            email: 'no-email@center.local',
            phone: '-',
            address: center.location,
            manager: 'N/A',
            logo: '',
            establishedAt: '',
          }))
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleCenters = sourceCenters.filter((center) => {
      return (
        normalizedSearch.length === 0 ||
        center.name.toLowerCase().includes(normalizedSearch) ||
        center.address.toLowerCase().includes(normalizedSearch) ||
        center.email.toLowerCase().includes(normalizedSearch) ||
        center.phone.toLowerCase().includes(normalizedSearch) ||
        center.manager.toLowerCase().includes(normalizedSearch)
      )
    })

    return [...visibleCenters].sort((left, right) => {
      return left.name.localeCompare(right.name)
    })
  }, [centersData, searchTerm, sortOption])

  const rows = useMemo(
    () =>
      filteredCenters.map((center) => ({
        ...center,
      })),
    [filteredCenters],
  )

  const handleDeleteCenter = async (id: string) => {
    if (!canDeleteCenter || !id) {
      return
    }

    // #region agent log
    fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '24497a',
      },
      body: JSON.stringify({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H12',
        location: 'CentersPage.tsx:handleDeleteCenter',
        message: 'Delete center submit snapshot',
        data: {
          centerId: id,
          canDeleteCenter,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    try {
      const result = await deleteCenter({
        variables: { _id: id },
      })

      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H13',
          location: 'CentersPage.tsx:handleDeleteCenter',
          message: 'Delete center mutation result snapshot',
          data: {
            hasDeleteCenterData: Boolean(result.data?.removeCenter),
            removeCenterResult: result.data?.removeCenter ?? null,
            deletedCenterId: id,
            hasApolloError: Boolean(result.error),
            apolloErrorMessage: result.error?.message ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion

      await refetchCenters()
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          hypothesisId: 'H14',
          location: 'CentersPage.tsx:handleDeleteCenter',
          message: 'Delete center mutation threw exception',
          data: {
            errorMessage: error instanceof Error ? error.message : 'unknown-error',
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
  }

  const handleOpenEditCenter = (row: EditableCenter) => {
    if (!canEditCenter || !row.id) {
      return
    }
    navigate(ROUTES_PATH.addCenter, {
      state: {
        mode: 'edit',
        center: row,
      },
    })
  }

  const columns = useMemo<GridColDef[]>(
    () => [
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
                border: '1px solid #dbe2f1',
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
        minWidth: 130,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={!canEditCenter}
              onClick={() =>
                handleOpenEditCenter({
                  id: String(params.row.id),
                  name: String(params.row.name ?? ''),
                  email: String(params.row.email ?? ''),
                  phone: String(params.row.phone ?? ''),
                  address: String(params.row.address ?? ''),
                  logo: String(params.row.logo ?? ''),
                  establishedAt: String(params.row.establishedAt ?? ''),
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              disabled={!canDeleteCenter || isDeletingCenter}
              onClick={() => handleDeleteCenter(String(params.row.id))}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    [
      canDeleteCenter,
      canEditCenter,
      handleDeleteCenter,
      handleOpenEditCenter,
      isDeletingCenter,
    ],
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

  useEffect(() => {
    const sendDebugLog = (payload: {
      hypothesisId: string
      location: string
      message: string
      data: Record<string, unknown>
    }) => {
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId: 'pre-fix',
          timestamp: Date.now(),
          ...payload,
        }),
      }).catch(() => {})
    }

    requestAnimationFrame(() => {
      const centerTable = document.querySelector('.centers-table') as HTMLElement | null
      const dataGridRoot = document.querySelector('.centers-table .MuiDataGrid-root') as HTMLElement | null
      const dataGridMain = document.querySelector('.centers-table .MuiDataGrid-main') as HTMLElement | null
      const renderedRows = document.querySelectorAll('.centers-table .MuiDataGrid-row').length
      const checkboxInputs = Array.from(
        document.querySelectorAll<HTMLInputElement>('.centers-table input[type="checkbox"]'),
      )
      const checkedCount = checkboxInputs.filter((item) => item.checked).length
      const headerCheckbox = document.querySelector(
        '.centers-table .MuiDataGrid-columnHeaderCheckbox input[type="checkbox"]',
      ) as HTMLInputElement | null
      const firstRowCheckbox = document.querySelector(
        '.centers-table .MuiDataGrid-cellCheckbox input[type="checkbox"]',
      ) as HTMLInputElement | null
      const firstRowCheckboxRoot = firstRowCheckbox?.closest('.MuiCheckbox-root') as HTMLElement | null

      // #region agent log
      sendDebugLog({
        hypothesisId: 'H1',
        location: 'CentersPage.tsx:checkbox/useEffect',
        message: 'Checkbox real checked state snapshot',
        data: {
          totalCheckboxInputs: checkboxInputs.length,
          checkedCheckboxInputs: checkedCount,
          headerChecked: headerCheckbox?.checked ?? null,
          firstRowChecked: firstRowCheckbox?.checked ?? null,
        },
      })
      // #endregion

      // #region agent log
      sendDebugLog({
        hypothesisId: 'H2',
        location: 'CentersPage.tsx:checkbox/useEffect',
        message: 'Checkbox visual class snapshot',
        data: {
          firstRowCheckboxRootClass: firstRowCheckboxRoot?.className ?? null,
          firstRowHasMuiCheckedClass: firstRowCheckboxRoot?.classList.contains('Mui-checked') ?? null,
          centerTableExists: Boolean(centerTable),
        },
      })
      // #endregion

      // #region agent log
      sendDebugLog({
        hypothesisId: 'H3',
        location: 'CentersPage.tsx:grid/useEffect',
        message: 'Grid data and pagination snapshot',
        data: {
          rowsLength: rows.length,
          columnsLength: columns.length,
          page: paginationModel.page,
          pageSize: paginationModel.pageSize,
          totalPages,
          rangeStart,
          rangeEnd,
        },
      })
      // #endregion

      // #region agent log
      sendDebugLog({
        hypothesisId: 'H4',
        location: 'CentersPage.tsx:grid/useEffect',
        message: 'Grid DOM render snapshot',
        data: {
          hasCenterTable: Boolean(centerTable),
          hasGridRoot: Boolean(dataGridRoot),
          hasGridMain: Boolean(dataGridMain),
          renderedRows,
          tableHeight: centerTable?.getBoundingClientRect().height ?? null,
          gridMainHeight: dataGridMain?.getBoundingClientRect().height ?? null,
        },
      })
      // #endregion

      // #region agent log
      sendDebugLog({
        hypothesisId: 'H10',
        location: 'CentersPage.tsx:query/useEffect',
        message: 'Centers query hydration snapshot',
        data: {
          serverCentersCount: centersData?.findAllCenters?.length ?? 0,
          rowsLength: rows.length,
        },
      })
      // #endregion
    })
  }, [
    centersData,
    columns.length,
    paginationModel.page,
    paginationModel.pageSize,
    rangeEnd,
    rangeStart,
    rows.length,
    totalPages,
  ])

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
              disabled={!canCreateCenter}
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
                      setSortOption(event.target.value as 'Name')
                      setPaginationModel((currentState) => ({
                        ...currentState,
                        page: 0,
                      }))
                    }}
                  >
                    <MenuItem value="Name">Name</MenuItem>
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
