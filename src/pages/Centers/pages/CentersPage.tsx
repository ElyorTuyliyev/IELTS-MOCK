import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { ROUTES_PATH } from '../../../routes'
import { selectUserRole } from '../../../store'
import { useAppSelector } from '../../../store/hooks'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { CENTER_PAGE_SIZE, CENTERS, CENTER_STATS } from '../api/centersData'
import { CREATE_CENTER_MUTATION } from '../../AddCenter/api/createCenterMutation'
import { REMOVE_CENTER_MUTATION } from '../api/deleteCenterMutation'
import { GET_ALL_CENTERS_QUERY } from '../api/getAllCentersQuery'
import { getVisiblePages } from '../components/pagination'
import { CentersPageRoot } from './CentersPage.style'

type FindAllCentersQueryResponse = {
  findAllCenters: Array<{
    _id: string
    name: string
    manager?: string | null
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

type CreateCenterMutationResponse = {
  createCenter: {
    _id: string
    name: string
  } | null
}

type CreateCenterMutationVariables = {
  name: string
  manager: string
  address: string
  phone: string
  email: string
  password: string
  logo: string
  establishedAt: string
}

type EditableCenter = {
  id: string
  name: string
  manager: string
  email: string
  phone: string
  address: string
  logo: string
  establishedAt?: string
}

const centersActionIconSx = {
  width: 40,
  height: 40,
  padding: 0,
  borderRadius: '10px',
  border: '1px solid #d8def0',
  backgroundColor: '#ffffff',
  color: '#64748b',
  '&:hover': {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  '&.Mui-disabled': {
    borderColor: '#e8ecf5',
    color: '#c4c9d4',
  },
} as const

const centersActionDeleteIconSx = {
  ...centersActionIconSx,
  '&:hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    color: '#dc2626',
  },
} as const

export function CentersPage() {
  const navigate = useNavigate()
  const role = useAppSelector(selectUserRole)
  const canCreateCenter = role === USER_ROLES.superAdmin
  const canDeleteCenter = role === USER_ROLES.superAdmin
  const canEditCenter = role === USER_ROLES.superAdmin
  const { data: centersData, refetch: refetchCenters } =
    useQuery<FindAllCentersQueryResponse>(GET_ALL_CENTERS_QUERY)
  const [createCenter, { loading: isCreatingCenter }] = useMutation<
    CreateCenterMutationResponse,
    CreateCenterMutationVariables
  >(CREATE_CENTER_MUTATION)
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
  const [isCreateCenterModalOpen, setIsCreateCenterModalOpen] = useState(false)
  const [centerName, setCenterName] = useState('')
  const [email, setEmail] = useState('')
  const [logoDataUrl, setLogoDataUrl] = useState('')
  const [logoFileName, setLogoFileName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [managerName, setManagerName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [createCenterError, setCreateCenterError] = useState('')

  const resetCreateCenterModal = () => {
    setCenterName('')
    setEmail('')
    setLogoDataUrl('')
    setLogoFileName('')
    setPhone('')
    setAddress('')
    setManagerName('')
    setPassword('')
    setConfirmPassword('')
    setCreateCenterError('')
  }

  const handleCloseCreateCenterModal = () => {
    setIsCreateCenterModalOpen(false)
    resetCreateCenterModal()
  }

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    if (!selectedFile) {
      setLogoDataUrl('')
      setLogoFileName('')
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      setCreateCenterError('Logo uchun rasm fayl tanlang (png, jpg, webp...).')
      setLogoDataUrl('')
      setLogoFileName('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setLogoDataUrl(result)
      setLogoFileName(selectedFile.name)
      setCreateCenterError('')
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCreateCenter = async () => {
    const normalizedName = centerName.trim()
    const normalizedManager = managerName.trim()
    const normalizedAddress = address.trim()
    const normalizedPhone = phone.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!normalizedName || !normalizedManager || !normalizedAddress || !normalizedPhone || !normalizedEmail) {
      setCreateCenterError('Center Name, Manager Name, Address, Phone Number va Gmail majburiy.')
      return
    }

    if (!logoDataUrl) {
      setCreateCenterError('Logo majburiy.')
      return
    }

    if (!trimmedPassword) {
      setCreateCenterError('Password majburiy.')
      return
    }

    if (trimmedPassword.length < 6) {
      setCreateCenterError("Password kamida 6 ta belgidan iborat bo'lishi kerak.")
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setCreateCenterError('Password va Confirm Password bir xil emas.')
      return
    }

    setCreateCenterError('')

    try {
      const result = await createCenter({
        variables: {
          name: normalizedName,
          manager: normalizedManager,
          address: normalizedAddress,
          phone: normalizedPhone,
          email: normalizedEmail,
          password: trimmedPassword,
          logo: logoDataUrl,
          establishedAt: new Date().toISOString(),
        },
      })

      if (!result.data?.createCenter?._id) {
        setCreateCenterError(result.error?.message ?? "Center yaratishda xatolik bo'ldi.")
        return
      }

      await refetchCenters()
      handleCloseCreateCenterModal()
    } catch (error) {
      setCreateCenterError(error instanceof Error ? error.message : "Center yaratishda xatolik bo'ldi.")
    }
  }

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
            manager: center.manager?.trim() ? center.manager : 'N/A',
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
        hypothesisId: 'H-update-nav',
        location: 'CentersPage.tsx:handleOpenEditCenter',
        message: 'Edit center navigation payload snapshot',
        data: {
          centerId: row.id,
          hasManager: Boolean(row.manager?.trim()),
          canEditCenter,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
    navigate(ROUTES_PATH.addCenter, {
      state: {
        mode: 'edit',
        center: row,
      },
    })
  }

  const handleOpenViewCenter = (row: EditableCenter) => {
    if (!row.id) {
      return
    }
    navigate(ROUTES_PATH.addCenter, {
      state: {
        mode: 'view',
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
                gap: '6px',
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
                    disabled={!canDeleteCenter || isDeletingCenter}
                    onClick={() => handleDeleteCenter(row.id)}
                    aria-label="Delete center"
                    sx={centersActionDeleteIconSx}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: 20, height: 20 }}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                    </Box>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Edit">
                <span>
                  <IconButton
                    size="small"
                    disabled={!canEditCenter}
                    onClick={() => handleOpenEditCenter(row)}
                    aria-label="Edit center"
                    sx={centersActionIconSx}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: 20, height: 20 }}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </Box>
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="View">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenViewCenter(row)}
                    aria-label="View center"
                    sx={centersActionIconSx}
                  >
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{ width: 20, height: 20 }}
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </Box>
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )
        },
      },
    ],
    [
      canDeleteCenter,
      canEditCenter,
      handleDeleteCenter,
      handleOpenEditCenter,
      handleOpenViewCenter,
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
      runId?: string
    }) => {
      const { runId = 'pre-fix', ...rest } = payload
      fetch('http://127.0.0.1:7673/ingest/f17e7d22-6b3c-499a-a010-5ead1efa8471', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '24497a',
        },
        body: JSON.stringify({
          sessionId: '24497a',
          runId,
          timestamp: Date.now(),
          ...rest,
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

      const firstActionCell = document.querySelector(
        '.centers-table .MuiDataGrid-row [data-field="actions"]',
      ) as HTMLElement | null
      // #region agent log
      sendDebugLog({
        hypothesisId: 'H-action',
        runId: 'layout-verify',
        location: 'CentersPage.tsx:layout/useEffect',
        message: 'Action column vs grid horizontal overflow',
        data: {
          actionUi: 'icon-buttons',
          gridMainClientWidth: dataGridMain?.clientWidth ?? null,
          gridMainScrollWidth: dataGridMain?.scrollWidth ?? null,
          gridNeedsHorizontalScroll:
            dataGridMain != null ? dataGridMain.scrollWidth > dataGridMain.clientWidth + 1 : null,
          actionCellClientWidth: firstActionCell?.clientWidth ?? null,
          actionCellScrollWidth: firstActionCell?.scrollWidth ?? null,
          actionCellContentOverflow:
            firstActionCell != null
              ? firstActionCell.scrollWidth > firstActionCell.clientWidth + 1
              : null,
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
              className="centers-page__cta"
              variant="contained"
              disabled={!canCreateCenter}
              onClick={() => setIsCreateCenterModalOpen(true)}
            >
              + Add New Center
            </Button>
          </Box>

          <Dialog
            open={isCreateCenterModalOpen}
            onClose={handleCloseCreateCenterModal}
            maxWidth="sm"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '20px',
                  overflow: 'hidden',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '22px 24px' }}>
              <Typography sx={{ fontSize: '36px', fontWeight: 700 }}>Add Center</Typography>
              <IconButton onClick={handleCloseCreateCenterModal} aria-label="Close center modal">
                <span style={{ fontSize: 28, lineHeight: 1 }}>×</span>
              </IconButton>
            </Box>
            <DialogContent sx={{ borderTop: '1px solid #eceff6', p: '20px 24px 24px' }}>
              {createCenterError ? <Alert severity="error" sx={{ mb: 2 }}>{createCenterError}</Alert> : null}
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <TextField label="Center Name" value={centerName} onChange={(e) => setCenterName(e.target.value)} />
                <TextField label="Gmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <TextField label="Manager Name" value={managerName} onChange={(e) => setManagerName(e.target.value)} />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Box sx={{ mt: 0.5 }}>
                  <Typography sx={{ mb: 1, fontWeight: 600, color: '#0f172a' }}>Logo</Typography>
                  <Box
                    component="label"
                    htmlFor="center-logo-upload"
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      textAlign: 'center',
                      gap: 1.5,
                      minHeight: 190,
                      px: 2,
                      border: '1px dashed #d9dcef',
                      borderRadius: '18px',
                      backgroundColor: '#f7f8fc',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      id="center-logo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleLogoFileChange}
                    />
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '14px',
                        background: '#e9ebff',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#5b6bff',
                        fontSize: 28,
                      }}
                    >
                      🖼
                    </Box>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                      Click or Drop your logo here, or{' '}
                      <Box component="span" sx={{ color: '#7c3aed' }}>
                        Browse
                      </Box>
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#5b6477' }}>
                      Recommended image size: 1080 × 780 pixels
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: '#5b6477', mt: -1 }}>
                      Accepted image formats: JPG, PNG.
                    </Typography>
                  </Box>
                  {logoFileName ? (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected: {logoFileName}
                    </Typography>
                  ) : null}
                  {logoDataUrl ? (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Logo preview
                      </Typography>
                      <Box
                        component="img"
                        src={logoDataUrl}
                        alt="Selected center logo preview"
                        sx={{
                          width: 110,
                          height: 110,
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '1px solid #dbe2f1',
                        }}
                      />
                    </Box>
                  ) : null}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                  <Button variant="outlined" onClick={handleCloseCreateCenterModal} sx={{ minWidth: 120, borderRadius: '12px' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateCenter}
                    disabled={isCreatingCenter}
                    sx={{ minWidth: 140, borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)' }}
                  >
                    {isCreatingCenter ? 'Saving...' : 'Save'}
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>

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
