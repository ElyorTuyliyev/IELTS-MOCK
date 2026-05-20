import { Global } from '@emotion/react'
import { useQuery } from '@apollo/client/react'

import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { Layout } from '../../../components/layout'
import {
  AllStudentsPageRoot,
  allStudentsModalGlobalStyles,
} from './AllStudentsPage.style'
import { FIND_ALL_USERS_QUERY } from '../api/findAllUsersQuery'
import type { FindAllUsersQueryResponse } from '@/types/allStudents'
import { useStudentsData } from '../hooks/useStudentsData'
import { useStudentForm } from '../hooks/useStudentForm'
import { StudentsHeader, StudentsTable, StudentFormModal } from '../components'

export function AllStudentsPage() {
  const {
    data: usersData,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useQuery<FindAllUsersQueryResponse>(FIND_ALL_USERS_QUERY)

  const form = useStudentForm({ usersData, refetchUsers })

  const table = useStudentsData({
    usersData,
    onDelete: form.handleDelete,
    onEdit: form.openEditModal,
  })

  return (
    <Layout>
      <Global styles={allStudentsModalGlobalStyles} />
      <AllStudentsPageRoot>
        <div className="students-page">
          <StudentsHeader onAddStudent={form.openCreateModal} />

          <StudentsTable
            rows={table.rows}
            columns={table.columns}
            loading={usersLoading}
            searchTerm={table.searchTerm}
            sortOption={table.sortOption}
            paginationModel={table.paginationModel}
            onSearchChange={table.handleSearchChange}
            onSortChange={table.handleSortChange}
            onPaginationChange={table.setPaginationModel}
          />

          <StudentFormModal
            open={form.isModalOpen}
            isEditing={Boolean(form.editingStudentId)}
            isBusy={form.isBusy}
            firstName={form.firstName}
            lastName={form.lastName}
            email={form.email}
            birthday={form.birthday}
            gender={form.gender}
            phone={form.phone}
            password={form.password}
            photoDataUrl={form.photoDataUrl}
            photoFileName={form.photoFileName}
            onFirstNameChange={form.setFirstName}
            onLastNameChange={form.setLastName}
            onEmailChange={form.setEmail}
            onBirthdayChange={form.setBirthday}
            onGenderChange={form.setGender}
            onPhoneChange={form.setPhone}
            onPasswordChange={form.setPassword}
            onPhotoFileChange={form.handlePhotoFileChange}
            onSave={form.handleSave}
            onClose={form.closeModal}
          />

          <ConfirmDialog
            open={Boolean(form.pendingDelete)}
            title="Delete student"
            description={
              form.pendingDelete
                ? `Are you sure you want to delete "${form.pendingDelete.name}"? This cannot be undone.`
                : undefined
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            confirmColor="error"
            loading={form.deleteLoading}
            onClose={form.handleCloseDeleteConfirm}
            onConfirm={form.handleConfirmDelete}
          />
        </div>
      </AllStudentsPageRoot>
    </Layout>
  )
}
