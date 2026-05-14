import { Global } from '@emotion/react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

import { Button } from '../../../components/common/Button'
import { Select } from '../../../components/common/Select'
import { Layout } from '../../../components/layout'
import { PasswordTextField } from '../../../components/common/PasswordTextField'
import { PhoneInput, normalizeUzPhoneDigits } from '../../../components/common/PhoneInput'
import { SearchField } from '../../../components/common/SearchField'
import { useToast } from '../../../components/common/Toast'
import { agentLog } from '../../../utils/agentLog'
import { isValidEmail, normalizeEmail } from '../../../utils/emailValidation'
import { validatePasswordField } from '../../../utils/passwordValidation'
import { CREATE_ADMIN_MUTATION } from '../api/createAdminMutation'
import { FIND_ALL_USERS_QUERY } from '../api/findAllUsersQuery'
import { AdminPageRoot, adminModalGlobalStyles } from './AdminPage.style'

const adminStats = [
  { label: 'Organizations', value: '18', meta: 'Active tenants across the platform' },
  { label: 'System users', value: '1,264', meta: 'Across all roles and branches' },
  { label: 'Open incidents', value: '07', meta: 'Monitoring and support queue' },
]

const governanceItems = [
  {
    title: 'Role assignment audit',
    meta: 'New admin permissions need approval in 3 branches',
    value: 'Review',
  },
  {
    title: 'Platform configuration sync',
    meta: 'Global grading policy not distributed to 2 centers',
    value: 'Pending',
  },
  {
    title: 'Security log review',
    meta: '12 failed login attempts detected in the last 24 hours',
    value: 'Today',
  },
]

const systemItems = [
  {
    title: 'Center onboarding pipeline',
    meta: 'Flow for creating new branches and assigning owners',
    value: 'Healthy',
  },
  {
    title: 'Question bank moderation',
    meta: 'Global content approval and rollback management',
    value: 'Stable',
  },
  {
    title: 'Billing and plan controls',
    meta: 'Subscription limits and access escalation management',
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
  const toast = useToast()
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
  const [createAdmin, { loading: isCreatingAdmin }] = useMutation<
    CreateAdminMutationResponse,
    CreateAdminMutationVariables
  >(CREATE_ADMIN_MUTATION)
  const { data: usersData, refetch: refetchUsers } = useQuery<FindAllUsersQueryResponse>(
    FIND_ALL_USERS_QUERY,
  )

  useEffect(() => {
    agentLog({
      sessionId: '24497a',
      runId: 'pre-fix',
      hypothesisId: 'H5',
      location: 'AdminPage.tsx:useEffect',
      message: 'Admin page initial dataset snapshot',
      data: {
        initialAdminsCount: admins.length,
        initialAdminEmails: admins.slice(0, 3).map((admin) => admin.email),
      },
    })
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

    agentLog({
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
    })
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
  }

  const closeAddAdminModal = () => {
    setIsAddAdminOpen(false)
    resetAdminForm()
  }

  const handleAddAdmin = async () => {
    const trimmedName = fullName.trim()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPhone = normalizeUzPhoneDigits(phone)
    const normalizedCenterName = centerName.trim()
    const normalizedCenterAddress = centerAddress.trim()
    const normalizedCenterPhone = normalizeUzPhoneDigits(centerPhone)
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
      toast.error('User and center details must be fully filled in to add an admin.')
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      toast.error('Enter a valid email address.')
      return
    }

    if (admins.some((admin) => admin.email.toLowerCase() === normalizedEmail)) {
      toast.error('An admin with this email already exists.')
      return
    }

    const passwordValidation = validatePasswordField(trimmedPassword)
    if (passwordValidation !== true) {
      toast.error(passwordValidation)
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error('Password and confirm password do not match.')
      return
    }

    const [firstNameRaw, ...lastNameParts] = trimmedName.split(' ')
    const firstName = firstNameRaw?.trim() || trimmedName
    const lastName = lastNameParts.join(' ').trim() || '-'

    agentLog({
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
    })

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

      agentLog({
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
      })

      if (!createdAdmin?._id) {
        toast.error(apolloErrorMessage ?? 'Failed to create admin.')
        return
      }

      await refetchUsers()

      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H3',
        location: 'AdminPage.tsx:handleAddAdmin',
        message: 'Admin created and inserted into local grid',
        data: {
          localAdminsCountAfterInsert: admins.length,
        },
      })

      closeAddAdminModal()
      toast.success('Admin created successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error while creating admin.')
      agentLog({
        sessionId: '24497a',
        runId: 'pre-fix',
        hypothesisId: 'H4',
        location: 'AdminPage.tsx:handleAddAdmin',
        message: 'Create admin mutation threw exception',
        data: {
          errorMessage: error instanceof Error ? error.message : 'unknown-error',
        },
      })
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
      password: '•'.repeat(Math.max(admin.password.length, 8)),
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
            variant="secondary"
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
                This page is for platform-level administration. It is prepared
                to view tenants, centers, permissions, and system configuration
                at super-admin level and connect them to the API later.
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
              <Button className="admin-page__utility-button" variant="secondary">
                <HeadActionIcon>⌁</HeadActionIcon>
                Access rules
              </Button>
              <Button className="admin-page__utility-button" variant="secondary">
                <HeadActionIcon>⌗</HeadActionIcon>
                Login fields
              </Button>
              <Button
                className="admin-page__primary-button"
                variant="primary"
                onClick={() => setIsAddAdminOpen(true)}
              >
                <HeadActionIcon>+</HeadActionIcon>
                Add New Admins
              </Button>
            </Box>
          </Box>

          <Box className="admin-page__panel admin-page__panel--table">
            <Box className="admin-page__table-filters">
              <SearchField
                className="admin-page__search"
                aria-label="Search admins"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <Box className="admin-page__table-actions">
                <Select
                  className="admin-page__select"
                  aria-label="Sort admins"
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as 'Name' | 'Created')
                  }
                  options={[
                    { value: 'Name', label: 'Name' },
                    { value: 'Created', label: 'Created' },
                  ]}
                />

                <Button className="admin-page__ghost-button" variant="secondary">
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
                Priority tasks related to permissions, audit, and global policy.
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
                Global administration blocks that will later be split into separate modules.
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
                  <PhoneInput
                    fullWidth
                    className="admin-modal__control"
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
                  <PhoneInput
                    fullWidth
                    className="admin-modal__control"
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
                  <PasswordTextField
                    fullWidth
                    className="admin-modal__control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Box>

                <Box className="admin-modal__field">
                  <label className="admin-modal__label">Confirm password</label>
                  <PasswordTextField
                    fullWidth
                    className="admin-modal__control"
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
                variant="secondary"
                onClick={closeAddAdminModal}
              >
                Cancel
              </Button>
              <Button
                className="admin-modal__save"
                variant="primary"
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
