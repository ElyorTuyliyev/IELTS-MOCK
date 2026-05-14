import { Global } from '@emotion/react'
import { useEffect, useMemo, type ReactNode } from 'react'
import { useQuery } from '@apollo/client/react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { Button } from '../../../components/common/Button'
import { Select } from '../../../components/common/Select'
import { Layout } from '../../../components/layout'
import { SearchField } from '../../../components/common/SearchField'
import { agentLog } from '../../../utils/agentLog'
import { FIND_ALL_USERS_QUERY } from '../api/findAllUsersQuery'
import { AddAdminModal } from '../components'
import { useAdminForm } from '../hooks/useAdminForm'
import { mapUsersToAdmins, useAdminsTable } from '../hooks/useAdminsTable'
import type { FindAllUsersQueryResponse } from '@/types/admin'
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

function HeadActionIcon({ children }: { children: ReactNode }) {
  return <Box component="span" className="admin-page__button-icon">{children}</Box>
}

export function AdminPage() {
  const { data: usersData, refetch: refetchUsers } = useQuery<FindAllUsersQueryResponse>(
    FIND_ALL_USERS_QUERY,
  )

  const admins = useMemo(
    () => mapUsersToAdmins(usersData?.findAllUsers ?? []),
    [usersData?.findAllUsers],
  )

  const form = useAdminForm({ admins, refetchUsers })
  const table = useAdminsTable({ admins })

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
  }, [admins])

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
                onClick={form.openAddAdminModal}
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
                value={table.searchTerm}
                onChange={(event) => table.setSearchTerm(event.target.value)}
              />

              <Box className="admin-page__table-actions">
                <Select
                  className="admin-page__select"
                  aria-label="Sort admins"
                  value={table.sortOption}
                  onChange={(event) =>
                    table.setSortOption(event.target.value as 'Name' | 'Created')
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
                rows={table.adminRows}
                columns={table.adminColumns}
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
              <span>Showing {table.adminRows.length} admins</span>
              <Box className="admin-page__count-badge">{table.adminCountLabel}</Box>
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

          <AddAdminModal
            open={form.isAddAdminOpen}
            isCreating={form.isCreatingAdmin}
            fullName={form.fullName}
            email={form.email}
            phone={form.phone}
            centerName={form.centerName}
            centerAddress={form.centerAddress}
            centerPhone={form.centerPhone}
            centerLogo={form.centerLogo}
            centerEstablishedAt={form.centerEstablishedAt}
            password={form.password}
            confirmPassword={form.confirmPassword}
            onFullNameChange={form.setFullName}
            onEmailChange={form.setEmail}
            onPhoneChange={form.setPhone}
            onCenterNameChange={form.setCenterName}
            onCenterAddressChange={form.setCenterAddress}
            onCenterPhoneChange={form.setCenterPhone}
            onCenterLogoChange={form.setCenterLogo}
            onCenterEstablishedAtChange={form.setCenterEstablishedAt}
            onPasswordChange={form.setPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            onSave={form.handleAddAdmin}
            onClose={form.closeAddAdminModal}
          />
        </Box>
      </AdminPageRoot>
    </Layout>
  )
}
