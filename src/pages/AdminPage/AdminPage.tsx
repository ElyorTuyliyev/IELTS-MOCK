import { useMemo, useState, type ReactNode } from 'react'
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
import { AdminPageRoot } from './AdminPage.style'

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

const initialAdmins: ManagedAdmin[] = [
  {
    id: 'admin-1',
    fullName: 'Aziza Karimova',
    email: 'admin@ieltsstudy.uz',
    scope: 'Global operations',
    password: '123456',
    createdAt: 'Apr 28, 2026',
  },
  {
    id: 'admin-2',
    fullName: 'Sardor Rakhimov',
    email: 'ops-admin@ieltsstudy.uz',
    scope: 'Exam and content control',
    password: '654321',
    createdAt: 'Apr 28, 2026',
  },
]

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
  const [scope, setScope] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  const adminCountLabel = useMemo(() => String(admins.length).padStart(2, '0'), [admins.length])

  const resetAdminForm = () => {
    setFullName('')
    setEmail('')
    setScope('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
  }

  const closeAddAdminModal = () => {
    setIsAddAdminOpen(false)
    resetAdminForm()
  }

  const handleAddAdmin = () => {
    const trimmedName = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const trimmedScope = scope.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedName || !normalizedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setFormError("Admin qo'shish uchun ism, email va password majburiy.")
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

    setAdmins((currentAdmins) => [
      {
        id: `admin-${Date.now()}`,
        fullName: trimmedName,
        email: normalizedEmail,
        scope: trimmedScope || 'General administration',
        password: trimmedPassword,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      },
      ...currentAdmins,
    ])
    closeAddAdminModal()
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
                <label className="admin-modal__label">Scope</label>
                <TextField
                  fullWidth
                  className="admin-modal__control"
                  placeholder="Global operations"
                  value={scope}
                  onChange={(event) => setScope(event.target.value)}
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
              >
                Add Admin
              </Button>
            </Box>
          </Dialog>
        </Box>
      </AdminPageRoot>
    </Layout>
  )
}
