import { useCallback, useMemo, useState } from 'react'
import type { GridPaginationModel } from '@mui/x-data-grid'

import type { StudentRow } from '../AllStudentsPage.constants'
import { createStudentColumnsWithActions } from '../AllStudentsPage.columns'
import type { FindAllUsersQueryResponse } from '@/types/allStudents'
import { formatCreationDate, parseCreationDateTimestamp } from '../utils'

function formatGender(value?: string | null) {
  const normalized = value?.trim()
  if (!normalized) return '-'
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
}

type SortOption = 'Name' | 'Creation date'

type UseStudentsDataParams = {
  usersData: FindAllUsersQueryResponse | undefined
  onDelete: (row: StudentRow) => void
  onEdit: (row: StudentRow) => void
  onView?: (row: StudentRow) => void
}

export function useStudentsData({ usersData, onDelete, onEdit, onView }: UseStudentsDataParams) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('Name')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  const studentRows = useMemo<StudentRow[]>(() => {
    const serverUsers = usersData?.findAllUsers ?? []
    return serverUsers
      .filter((user) => user.role === 'student')
      .map((user, index) => {
        const fullName = `${user.firstName} ${user.lastName}`.trim()
        return {
          userId: user._id,
          serial: String(index + 1).padStart(2, '0'),
          name: fullName || 'Student',
          phone: user.phone?.trim() || '-',
          email: user.email?.trim() || '-',
          gender: formatGender(user.gender),
          creationDate: formatCreationDate(user.createdAt),
          status: 'Active' as const,
        }
      })
  }, [usersData])

  // FIX: "Creation date" now sorts by actual date instead of serial string
  const filteredStudents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visible = studentRows.filter(
      (s) =>
        normalizedSearch.length === 0 ||
        s.name.toLowerCase().includes(normalizedSearch) ||
        s.phone.toLowerCase().includes(normalizedSearch) ||
        s.email.toLowerCase().includes(normalizedSearch) ||
        s.gender.toLowerCase().includes(normalizedSearch) ||
        s.status.toLowerCase().includes(normalizedSearch),
    )

    return [...visible].sort((left, right) => {
      if (sortOption === 'Creation date') {
        return (
          parseCreationDateTimestamp(left.creationDate) -
          parseCreationDateTimestamp(right.creationDate)
        )
      }
      return left.name.localeCompare(right.name)
    })
  }, [searchTerm, sortOption, studentRows])

  const rows = useMemo(
    () =>
      filteredStudents.map((student, index) => ({
        id: student.userId || `${student.serial}-${student.name}-${index}`,
        ...student,
      })),
    [filteredStudents],
  )

  const columns = useMemo(
    () => createStudentColumnsWithActions({ onDelete, onEdit, onView }),
    [onDelete, onEdit, onView],
  )

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setPaginationModel((cur) => ({ ...cur, page: 0 }))
  }, [])

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value as SortOption)
    setPaginationModel((cur) => ({ ...cur, page: 0 }))
  }, [])

  return {
    rows,
    columns,
    searchTerm,
    sortOption,
    paginationModel,
    setPaginationModel,
    handleSearchChange,
    handleSortChange,
  }
}
