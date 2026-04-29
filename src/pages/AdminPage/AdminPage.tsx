import { Global } from '@emotion/react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
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
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { CREATE_ADMIN_MUTATION } from './api/createAdminMutation'
import { FIND_ALL_USERS_QUERY } from './api/findAllUsersQuery'
import { AdminPageRoot, adminModalGlobalStyles } from './AdminPage.style'

const adminStats = [
  { label: 'Organizations', value: '18', meta: 'Platform bo‘yicha faol tenantlar' },
  { label: 'System users', value: '1,264', meta: 'Barcha role va branchlar kesimida' },
  { label: 'Open incidents', value: '07', meta: 'Monitoring va support queue' },
]

const governanceItems = [
  {
    title: 'Role assignment audit',
    meta: '3 ta branchda yangi admin permission tasdiqlanishi kerak',
    value: 'Review',
  },
  {
    title: 'Platform configuration sync',
    meta: 'Global grading policy 2 ta centerga tarqatilmagan',
    value: 'Pending',
  },
  {
    title: 'Security log review',
    meta: 'Oxirgi 24 soatda 12 ta failed login urinishlari topildi',
    value: 'Today',
  },
]

const systemItems = [
  {
    title: 'Center onboarding pipeline',
    meta: 'Yangi filiallarni yaratish va owner biriktirish oqimi',
    value: 'Healthy',
  },
  {
    title: 'Question bank moderation',
    meta: 'Global content approval va rollback boshqaruvi',
    value: 'Stable',
  },
  {
    title: 'Billing and plan controls',
    meta: 'Subscription limitlar va access escalation boshqaruvi',
    value: 'Internal',
  },
]

type ManagedAdmin = {
  id: string
  fullName: string
  email: string
  scope: string
  password: string
  createdAt: string
}

type CreateAdminMutationResponse = {
  createAdmin: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    role: string | null
    centerId?: string | null
  } | null
}

type CreateAdminMutationVariables = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  centerName: string
  centerAddress: string
  centerPhone: string
  centerLogo?: string
  centerEstablishedAt?: string
}

type FindAllUsersQueryResponse = {
  findAllUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
    phone: string
    role?: string | null
    centerId?: string | null
    createdAt: string
  }>
}

const ADMIN_ROLES = new Set(['center', 'admin', 'super_admin', 'center_admin'])

const initialAdmins: ManagedAdmin[] = []

function HeadActionIcon({
  children,
}: {
  children: ReactNode
}) {
  return <Box component="span" className="admin-page__button-icon">{children}</Box>
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AdminPage() {
  const [admins, setAdmins] = useState<ManagedAdmin[]>(initialAdmins)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name' | 'Created'>('Name')
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [centerName, setCenterName] = useState('')
  const [centerAddress, setCenterAddress] = useState('')
  const [centerPhone, setCenterPhone] = useState('')
  const [centerLogo, setCenterLogo] = useState('')
  const [centerEstablishedAt, setCenterEstablishedAt] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [createAdmin, { loading: isCreatingAdmin }] = useMutation<
    CreateAdminMutationResponse,
    CreateAdminMutationVariables
  >(CREATE_ADMIN_MUTATION)
  const { data: usersData, refetch: refetchUsers } = useQuery<FindAllUsersQueryResponse>(
    FIND_ALL_USERS_QUERY,
  )

  useEffect(() => {
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
        hypothesisId: 'H5',
        location: 'AdminPage.tsx:useEffect',
        message: 'Admin page initial dataset snapshot',
        data: {
          initialAdminsCount: admins.length,
          initialAdminEmails: admins.slice(0, 3).map((admin) => admin.email),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [])

  useEffect(() => {
    const serverUsers = usersData?.findAllUsers ?? []
    const adminUsers = serverUsers.filter((user) => ADMIN_ROLES.has(user.role ?? ''))
    const mappedAdmins: ManagedAdmin[] = adminUsers.map((user) => ({
      id: user._id,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email ?? `${user.phone}@no-email.local`,
      scope: user.centerId ?? 'General administration',
      password: '******',
      createdAt: new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    }))
    setAdmins(mappedAdmins)

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
        hypothesisId: 'H6',
        location: 'AdminPage.tsx:usersDataEffect',
        message: 'Hydrated admins from backend query',
        data: {
          serverUsersCount: serverUsers.length,
          adminUsersCount: adminUsers.length,
          mappedAdminsCount: mappedAdmins.length,
          firstRoles: serverUsers.slice(0, 5).map((user) => user.role ?? null),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion
  }, [usersData])

  const adminCountLabel = useMemo(() => String(admins.length).padStart(2, '0'), [admins.length])

  const resetAdminForm = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setCenterName('')
    setCenterAddress('')
    setCenterPhone('')
    setCenterLogo('')
    setCenterEstablishedAt('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
  }

  const closeAddAdminModal = () => {
    setIsAddAdminOpen(false)
    resetAdminForm()
  }

  const handleAddAdmin = async () => {
    const trimmedName = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPhone = phone.trim()
    const normalizedCenterName = centerName.trim()
    const normalizedCenterAddress = centerAddress.trim()
    const normalizedCenterPhone = centerPhone.trim()
    const normalizedCenterLogo = centerLogo.trim()
    const normalizedCenterEstablishedAt = centerEstablishedAt.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (
      !trimmedName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !trimmedPassword ||
      !trimmedConfirmPassword ||
      !normalizedCenterName ||
      !normalizedCenterAddress ||
      !normalizedCenterPhone
    ) {
      setFormError("Admin qo'shish uchun user va center ma'lumotlari to'liq kiritilishi kerak.")
      return
    }

    if (admins.some((admin) => admin.email.toLowerCase() === normalizedEmail)) {
      setFormError('Bu email bilan admin allaqachon mavjud.')
      return
    }

    if (trimmedPassword.length < 6) {
      setFormError("Password kamida 6 ta belgidan iborat bo'lishi kerak.")
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setFormError('Password va confirm password bir xil emas.')
      return
    }
    setFormError('')

    const [firstNameRaw, ...lastNameParts] = trimmedName.split(' ')
    const firstName = firstNameRaw?.trim() || trimmedName
    const lastName = lastNameParts.join(' ').trim() || '-'

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
        hypothesisId: 'H1',
        location: 'AdminPage.tsx:handleAddAdmin',
        message: 'Create admin submit payload snapshot',
        data: {
          fullNameLength: trimmedName.length,
          emailLength: normalizedEmail.length,
          phoneLength: normalizedPhone.length,
          centerNameLength: normalizedCenterName.length,
          centerAddressLength: normalizedCenterAddress.length,
          centerPhoneLength: normalizedCenterPhone.length,
          passwordLength: trimmedPassword.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
    // #endregion

    try {
      const result = await createAdmin({
        variables: {
          firstName,
          lastName,
          email: normalizedEmail,
          ...(normalizedPhone ? { phone: normalizedPhone } : {}),
          password: trimmedPassword,
          centerName: normalizedCenterName,
          centerAddress: normalizedCenterAddress,
          centerPhone: normalizedCenterPhone,
          ...(normalizedCenterLogo ? { centerLogo: normalizedCenterLogo } : {}),
          ...(normalizedCenterEstablishedAt
            ? { centerEstablishedAt: normalizedCenterEstablishedAt }
            : {}),
        },
      })

      const createdAdmin = result.data?.createAdmin ?? null
      const apolloErrorMessage = result.error?.message ?? null

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
          hypothesisId: 'H2',
          location: 'AdminPage.tsx:handleAddAdmin',
          message: 'Create admin mutation result snapshot',
          data: {
            hasCreateUserData: Boolean(createdAdmin),
            createdAdminId: createdAdmin?._id ?? null,
            linkedCenterId: createdAdmin?.centerId ?? null,
            hasApolloError: Boolean(result.error),
            apolloErrorMessage,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion

      if (!createdAdmin?._id) {
        setFormError(apolloErrorMessage ?? "Admin yaratishda xatolik bo'ldi.")
        return
      }

      await refetchUsers()

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
          hypothesisId: 'H3',
          location: 'AdminPage.tsx:handleAddAdmin',
          message: 'Admin created and inserted into local grid',
          data: {
            localAdminsCountAfterInsert: admins.length,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion

      closeAddAdminModal()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Admin yaratishda kutilmagan xatolik.")
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
          hypothesisId: 'H4',
          location: 'AdminPage.tsx:handleAddAdmin',
          message: 'Create admin mutation threw exception',
          data: {
            errorMessage: error instanceof Error ? error.message : 'unknown-error',
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
    }
  }

  const handleDeleteAdmin = (id: string) => {
    setAdmins((currentAdmins) => currentAdmins.filter((admin) => admin.id !== id))
  }

  const adminRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const filteredAdmins = admins.filter((admin) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        admin.fullName.toLowerCase().includes(normalizedSearch) ||
        admin.email.toLowerCase().includes(normalizedSearch) ||
        admin.scope.toLowerCase().includes(normalizedSearch)
      )
    })

    const sortedAdmins = [...filteredAdmins].sort((left, right) => {
      if (sortOption === 'Created') {
        return right.createdAt.localeCompare(left.createdAt)
      }

      return left.fullName.localeCompare(right.fullName)
    })

    return sortedAdmins.map((admin) => ({
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      scope: admin.scope,
      password: '•'.repeat(Math.max(admin.password.length, 6)),
      createdAt: admin.createdAt,
    }))
  }, [admins, searchTerm, sortOption])

  const adminColumns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'fullName',
        headerName: 'Admin name',
        flex: 1,
        minWidth: 180,
        sortable: false,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1.1,
        minWidth: 220,
        sortable: false,
      },
      {
        field: 'scope',
        headerName: 'Scope',
        flex: 1,
        minWidth: 180,
        sortable: false,
      },
      {
        field: 'password',
        headerName: 'Password',
        minWidth: 140,
        sortable: false,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        minWidth: 130,
        sortable: false,
      },
      {
        field: 'actions',
        headerName: 'Action',
        minWidth: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            className="admin-page__danger-button"
            variant="outlined"
            onClick={() => handleDeleteAdmin(String(params.row.id))}
          >
            Delete
          </Button>
        ),
      },
    ],
    [],
  )

  return (
    <Layout>
      <Global styles={adminModalGlobalStyles} />
      <AdminPageRoot>
        <Box className="admin-page">
          <Box className="admin-page__hero">
            <Box>
              <Typography component="p" className="admin-page__eyebrow">
                Super Admin
              </Typography>
              <Typography component="h1" className="admin-page__title">
                Admin Control Panel
              </Typography>
              <Typography component="p" className="admin-page__description">
                Bu sahifa platforma darajasidagi boshqaruv uchun. Tenantlar,
                markazlar, permissionlar va tizim konfiguratsiyalarini
                super-admin darajasida ko‘rish va keyin API bilan ulash uchun
                tayyorlangan.
              </Typography>
            </Box>

            <Box className="admin-page__badge">super_admin only</Box>
          </Box>

          <Box className="admin-page__stats">
            {adminStats.map((item) => (
              <Box key={item.label} className="admin-page__stat">
                <Typography component="span" className="admin-page__stat-label">
                  {item.label}
                </Typography>
                <Typography component="span" className="admin-page__stat-value">
                  {item.value}
                </Typography>
                <Typography component="p" className="admin-page__stat-meta">
                  {item.meta}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="admin-page__head">
            <Typography component="h2" className="admin-page__section-title">
              All Admins
            </Typography>

            <Box className="admin-page__head-actions">
              <Button className="admin-page__utility-button" variant="outlined">
                <HeadActionIcon>⌁</HeadActionIcon>
                Access rules
              </Button>
              <Button className="admin-page__utility-button" variant="outlined">
                <HeadActionIcon>⌗</HeadActionIcon>
                Login fields
              </Button>
              <Button
                className="admin-page__primary-button"
                variant="contained"
                onClick={() => setIsAddAdminOpen(true)}
              >
                <HeadActionIcon>+</HeadActionIcon>
                Add New Admins
              </Button>
            </Box>
          </Box>

          <Box className="admin-page__panel admin-page__panel--table">
            <Box className="admin-page__table-filters">
              <TextField
                className="admin-page__search"
                type="search"
                placeholder="Search..."
                aria-label="Search admins"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="admin-page__search-icon">⌕</Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box className="admin-page__table-actions">
                <TextField
                  select
                  className="admin-page__select"
                  aria-label="Sort admins"
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as 'Name' | 'Created')
                  }
                >
                  <MenuItem value="Name">Name</MenuItem>
                  <MenuItem value="Created">Created</MenuItem>
                </TextField>

                <Button className="admin-page__ghost-button" variant="outlined">
                  Display columns
                </Button>
              </Box>
            </Box>

            <Box className="admin-page__table-wrap">
              <DataGrid
                rows={adminRows}
                columns={adminColumns}
                autoHeight
                disableRowSelectionOnClick
                hideFooterSelectedRowCount
                hideFooter
                pageSizeOptions={[5, 10]}
                className="admin-page__table"
                localeText={{
                  noRowsLabel: 'No admins matched the current search.',
                }}
              />
            </Box>

            <Box className="admin-page__table-footer">
              <span>Showing {adminRows.length} admins</span>
              <Box className="admin-page__count-badge">{adminCountLabel}</Box>
            </Box>
          </Box>

          <Box className="admin-page__grid">
            <Box className="admin-page__panel">
              <Typography component="h2" className="admin-page__panel-title">
                Governance Queue
              </Typography>
              <Typography component="p" className="admin-page__panel-text">
                Permission, audit va global policy bilan bog‘liq ustuvor vazifalar.
              </Typography>

              <Box className="admin-page__list">
                {governanceItems.map((item) => (
                  <Box key={item.title} className="admin-page__list-item">
                    <Box>
                      <Typography component="p" className="admin-page__list-label">
                        {item.title}
                      </Typography>
                      <Typography component="p" className="admin-page__list-meta">
                        {item.meta}
                      </Typography>
                    </Box>
                    <Typography component="span" className="admin-page__list-value">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box className="admin-page__panel">
              <Typography component="h2" className="admin-page__panel-title">
                System Domains
              </Typography>
              <Typography component="p" className="admin-page__panel-text">
                Keyin alohida modullarga bo‘linadigan global boshqaruv bloklari.
              </Typography>

              <Box className="admin-page__list">
                {systemItems.map((item) => (
                  <Box key={item.title} className="admin-page__list-item">
                    <Box>
                      <Typography component="p" className="admin-page__list-label">
                        {item.title}
                      </Typography>
                      <Typography component="p" className="admin-page__list-meta">
                        {item.meta}
                      </Typography>
                    </Box>
                    <Typography component="span" className="admin-page__list-value">
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Dialog
            open={isAddAdminOpen}
            onClose={closeAddAdminModal}
            maxWidth="sm"
            fullWidth
            className="admin-modal"
            slotProps={{
              paper: {
                className: 'admin-modal__paper',
              },
              backdrop: {
                className: 'admin-modal__backdrop',
              },
            }}
          >
            <Box className="admin-modal__header">
              <Typography component="h2" className="admin-modal__title">
                Add Admin
              </Typography>

              <IconButton
                className="admin-modal__close"
                aria-label="Close add admin modal"
                onClick={closeAddAdminModal}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent className="admin-modal__body">
              {formError ? <Alert severity="error">{formError}</Alert> : null}

              <Box className="admin-modal__intro">
                <Box className="admin-modal__intro-card">
                  <Typography component="p" className="admin-modal__eyebrow">
                    Access creation
                  </Typography>
                  <Typography component="h3" className="admin-modal__intro-title">
                    Create a new platform admin
                  </Typography>
                  <Typography component="p" className="admin-modal__intro-text">
                    Fill in identity, responsibility scope, and secure password.
                    This admin will appear in the control table immediately.
                  </Typography>

                  <Box className="admin-modal__rules">
                    <Box className="admin-modal__rule-chip">Unique email</Box>
                    <Box className="admin-modal__rule-chip">Min 6 chars</Box>
                    <Box className="admin-modal__rule-chip">Super-admin managed</Box>
                  </Box>
                </Box>

                <Box className="admin-modal__preview">
                  <Box className="admin-modal__preview-avatar">
                    {(fullName.trim()[0] ?? 'A').toUpperCase()}
                  </Box>
                  <Typography component="p" className="admin-modal__preview-name">
                    {fullName.trim() || 'New Admin'}
                  </Typography>
                  <Typography component="p" className="admin-modal__preview-email">
                    {email.trim() || 'admin@company.com'}
                  </Typography>
                  <Box className="admin-modal__preview-badge">
                    {centerName.trim() || 'Center will be created'}
                  </Box>
                </Box>
              </Box>

              <Box className="admin-modal__grid">
                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Full name</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Email</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Phone</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="998901234567"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field admin-modal__field--full">
                  <label className="admin-modal__label">Center name</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="Center name"
                    value={centerName}
                    onChange={(event) => setCenterName(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field admin-modal__field--full">
                  <label className="admin-modal__label">Center address</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="Center address"
                    value={centerAddress}
                    onChange={(event) => setCenterAddress(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Center phone</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="998901234567"
                    value={centerPhone}
                    onChange={(event) => setCenterPhone(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Center establishedAt</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="2026-01-01T00:00:00.000Z"
                    value={centerEstablishedAt}
                    onChange={(event) => setCenterEstablishedAt(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field admin-modal__field--full">
                  <label className="admin-modal__label">Center logo (optional)</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="https://example.com/logo.png"
                    value={centerLogo}
                    onChange={(event) => setCenterLogo(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Password</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Confirm password</label>
                  <TextField
                    fullWidth
                    className="admin-modal__control"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </Box>
              </Box>
            </DialogContent>

            <Box className="admin-modal__footer">
              <Button
                className="admin-modal__cancel"
                variant="outlined"
                onClick={closeAddAdminModal}
              >
                Cancel
              </Button>
              <Button
                className="admin-modal__save"
                variant="contained"
                onClick={handleAddAdmin}
                disabled={isCreatingAdmin}
              >
                {isCreatingAdmin ? 'Creating...' : 'Add Admin'}
              </Button>
            </Box>
          </Dialog>
        </Box>
      </AdminPageRoot>
    </Layout>
  )
}
