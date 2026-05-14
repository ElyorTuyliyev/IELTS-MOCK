import { useCallback, useMemo, useState } from 'react'
import type { GridPaginationModel } from '@mui/x-data-grid'

import { CENTER_PAGE_SIZE, CENTERS } from '../api/centersData'
import type { EditableCenter, FindAllCentersQueryResponse } from '../types'

type UseCentersDataParams = {
  centersData: FindAllCentersQueryResponse | undefined
}

export function useCentersData({ centersData }: UseCentersDataParams) {
  const [searchTerm, setSearchTerm] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: CENTER_PAGE_SIZE,
  })

  // FIX: removed `sortOption` dep — only one sort exists and it's always by name
  const filteredCenters = useMemo<EditableCenter[]>(() => {
    const serverCenters = centersData?.findAllCenters ?? []
    const sourceCenters =
      serverCenters.length > 0
        ? serverCenters.map((c) => ({
            id: c._id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            manager: c.manager?.trim() ? c.manager : 'N/A',
            logo: c.logo ?? '',
            establishedAt: c.establishedAt ?? '',
          }))
        : CENTERS.map((c) => ({
            id: c.id,
            name: c.name,
            email: 'no-email@center.local',
            phone: '-',
            address: c.location,
            manager: 'N/A',
            logo: '',
            establishedAt: '',
          }))

    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visible = sourceCenters.filter(
      (c) =>
        normalizedSearch.length === 0 ||
        c.name.toLowerCase().includes(normalizedSearch) ||
        c.address.toLowerCase().includes(normalizedSearch) ||
        c.email.toLowerCase().includes(normalizedSearch) ||
        c.phone.toLowerCase().includes(normalizedSearch) ||
        c.manager.toLowerCase().includes(normalizedSearch),
    )

    return [...visible].sort((a, b) => a.name.localeCompare(b.name))
  }, [centersData, searchTerm])

  // FIX: removed no-op shallow copy — filteredCenters already has `id` field
  const rows = filteredCenters

  const totalPages = Math.max(1, Math.ceil(rows.length / paginationModel.pageSize))
  const currentPage = paginationModel.page + 1
  const rangeStart = rows.length === 0 ? 0 : paginationModel.page * paginationModel.pageSize + 1
  const rangeEnd =
    rows.length === 0
      ? 0
      : Math.min((paginationModel.page + 1) * paginationModel.pageSize, rows.length)

  // FIX: page correction moved here with guard to avoid re-trigger loop
  const safePaginationModel = useMemo(() => {
    if (paginationModel.page > totalPages - 1) {
      return { ...paginationModel, page: Math.max(0, totalPages - 1) }
    }
    return paginationModel
  }, [paginationModel, totalPages])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setPaginationModel((cur) => ({ ...cur, page: 0 }))
  }, [])

  return {
    rows,
    searchTerm,
    paginationModel: safePaginationModel,
    setPaginationModel,
    totalPages,
    currentPage,
    rangeStart,
    rangeEnd,
    handleSearchChange,
  }
}
