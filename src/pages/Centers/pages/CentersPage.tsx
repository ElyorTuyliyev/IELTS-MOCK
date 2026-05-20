import { useQuery } from '@apollo/client/react'
import { Box } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { getCenterViewPath } from '../../../routes/paths'

import { Layout } from '../../../components/layout'
import { GET_ALL_CENTERS_QUERY } from '../api/getAllCentersQuery'
import type { EditableCenter, FindAllCentersQueryResponse } from '@/types/centers'
import { useCentersData } from '../hooks/useCentersData'
import { useCentersStats } from '../hooks/useCentersStats'
import { useCenterForm } from '../hooks/useCenterForm'
import { CenterFormModal, CentersHeader, CentersTable } from './components'
import { CentersPageRoot } from './CentersPage.style'

export function CentersPage() {
  const navigate = useNavigate()
  const { data: centersData, loading, refetch: refetchCenters } =
    useQuery<FindAllCentersQueryResponse>(GET_ALL_CENTERS_QUERY)

  const form = useCenterForm({ refetchCenters })
  const table = useCentersData({ centersData })

  const allCenters = useMemo(() => {
    const serverCenters = centersData?.findAllCenters ?? []
    return serverCenters.map((center) => ({
      id: center._id,
      name: center.name,
      email: center.email,
      phone: center.phone,
      address: center.address,
      manager: center.manager?.trim() ? center.manager : 'N/A',
      logo: center.logo ?? '',
      establishedAt: center.establishedAt ?? '',
      availableExamCredits: center.availableExamCredits ?? 0,
    }))
  }, [centersData])

  const stats = useCentersStats(allCenters)

  const handleRowClick = useCallback(
    (row: EditableCenter) => {
      if (!row.id) return
      navigate(getCenterViewPath(row.id))
    },
    [navigate],
  )

  return (
    <Layout>
      <CentersPageRoot>
        <Box className="centers-page">
          <CentersHeader
            canCreateCenter={form.canCreateCenter}
            centerCount={allCenters.length}
            stats={stats}
            onAddCenter={form.handleAddCenter}
          />

          <CentersTable
            rows={table.rows}
            searchTerm={table.searchTerm}
            loading={loading}
            paginationModel={table.paginationModel}
            canDeleteCenter={form.canDeleteCenter}
            canEditCenter={form.canEditCenter}
            onSearchChange={table.handleSearchChange}
            onPaginationChange={table.setPaginationModel}
            onDelete={form.handleDeleteCenter}
            onEdit={form.handleEditCenter}
            onRowClick={handleRowClick}
          />

          <CenterFormModal
            open={form.isModalOpen}
            mode={form.modalMode ?? 'create'}
            isSaving={form.isSaving}
            centerName={form.centerName}
            email={form.email}
            phone={form.phone}
            address={form.address}
            managerName={form.managerName}
            password={form.password}
            confirmPassword={form.confirmPassword}
            logoDataUrl={form.logoDataUrl}
            logoFileName={form.logoFileName}
            onCenterNameChange={form.setCenterName}
            onEmailChange={form.setEmail}
            onPhoneChange={form.setPhone}
            onAddressChange={form.setAddress}
            onManagerNameChange={form.setManagerName}
            onPasswordChange={form.setPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            onLogoFileChange={form.handleLogoFileChange}
            onSave={form.handleSaveCenter}
            onClose={form.closeModal}
          />
        </Box>
      </CentersPageRoot>
    </Layout>
  )
}
