import { useMemo, useState } from 'react'
import type { GridColDef } from '@mui/x-data-grid'

import { Button } from '../../../components/common/Button'
import type { ManagedAdmin } from '@/types/admin'

const ADMIN_ROLES = new Set(['center', 'admin', 'super_admin', 'center_admin'])

export function mapUsersToAdmins(
  serverUsers: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string | null
    phone: string
    role?: string | null
    centerId?: string | null
    createdAt: string
  }>,
): ManagedAdmin[] {
  const adminUsers = serverUsers.filter((user) => ADMIN_ROLES.has(user.role ?? ''))
  return adminUsers.map((user) => ({
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
}

type UseAdminsTableParams = {
  admins: ManagedAdmin[]
}

export function useAdminsTable({ admins }: UseAdminsTableParams) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'Name' | 'Created'>('Name')

  const adminCountLabel = useMemo(() => String(admins.length).padStart(2, '0'), [admins.length])

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
        renderCell: () => (
          <Button className="admin-page__danger-button" variant="secondary" disabled>
            Delete
          </Button>
        ),
      },
    ],
    [],
  )

  return {
    searchTerm,
    sortOption,
    adminCountLabel,
    adminRows,
    adminColumns,
    setSearchTerm,
    setSortOption,
  }
}
