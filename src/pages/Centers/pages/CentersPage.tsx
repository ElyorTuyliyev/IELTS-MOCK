import { useQuery } from '@apollo/client/react'
import { Box } from '@mui/material'

import { Layout } from '../../../components/layout'
import { GET_ALL_CENTERS_QUERY } from '../api/getAllCentersQuery'
import type { FindAllCentersQueryResponse } from '@/types/centers'
import { useCentersData } from '../hooks/useCentersData'
import { useCenterForm } from '../hooks/useCenterForm'
import { CentersHeader, CentersTable, CreateCenterModal } from './components'
import { CentersPageRoot } from './CentersPage.style'

export function CentersPage() {
  const { data: centersData, refetch: refetchCenters } =
    useQuery<FindAllCentersQueryResponse>(GET_ALL_CENTERS_QUERY)

  const form = useCenterForm({ refetchCenters })

  const table = useCentersData({ centersData })

  return (
    <Layout>
      <CentersPageRoot>
        <Box className="centers-page">
          <CentersHeader
            canCreateCenter={form.canCreateCenter}
            onAddCenter={form.openModal}
          />

          <CentersTable
            rows={table.rows}
            searchTerm={table.searchTerm}
            paginationModel={table.paginationModel}
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            rangeStart={table.rangeStart}
            rangeEnd={table.rangeEnd}
            canDeleteCenter={form.canDeleteCenter}
            canEditCenter={form.canEditCenter}
            onSearchChange={table.handleSearchChange}
            onPaginationChange={table.setPaginationModel}
            onDelete={form.handleDeleteCenter}
            onEdit={form.handleEditCenter}
            onView={form.handleViewCenter}
          />

          <CreateCenterModal
            open={form.isModalOpen}
            isCreating={form.isCreatingCenter}
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
            onSave={form.handleCreateCenter}
            onClose={form.closeModal}
          />
        </Box>
      </CentersPageRoot>
    </Layout>
  )
}
