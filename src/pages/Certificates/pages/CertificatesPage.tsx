import { useMemo, useState } from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { c } from '../../../theme'
import { CertificatesTable } from '../components/CertificatesTable'
import {
  CERTIFICATE_TEMPLATES,
  MOCK_CERTIFICATES,
  type CertificateRecord,
  type CertificateStatus,
} from '../certificates.data'
import { CertificatesPageRoot } from './CertificatesPage.style'

type TabKey = 'issued' | 'templates'

const STATUS_FILTERS: Array<{ value: 'all' | CertificateStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'issued', label: 'Issued' },
  { value: 'pending', label: 'Pending' },
  { value: 'draft', label: 'Draft' },
]

function StatusChip({ status }: { status: CertificateStatus }) {
  return (
    <span className={`certificates-page__status certificates-page__status--${status}`}>
      {status}
    </span>
  )
}

export function CertificatesPage() {
  const toast = useToast()
  const [tab, setTab] = useState<TabKey>('issued')
  const [statusFilter, setStatusFilter] = useState<'all' | CertificateStatus>('all')
  const [search, setSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 8,
  })

  const stats = useMemo(() => {
    const issued = MOCK_CERTIFICATES.filter((row) => row.status === 'issued').length
    const pending = MOCK_CERTIFICATES.filter((row) => row.status === 'pending').length
    return {
      templates: CERTIFICATE_TEMPLATES.length,
      issued,
      pending,
    }
  }, [])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return MOCK_CERTIFICATES.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!query) return true
      return (
        row.studentName.toLowerCase().includes(query) ||
        row.examName.toLowerCase().includes(query) ||
        row.templateName.toLowerCase().includes(query) ||
        row.verificationCode.toLowerCase().includes(query)
      )
    })
  }, [search, statusFilter])

  const columns = useMemo<GridColDef<CertificateRecord>[]>(
    () => [
      { field: 'studentName', headerName: 'Student', flex: 1.1, minWidth: 148 },
      { field: 'examName', headerName: 'Exam', flex: 1.25, minWidth: 172 },
      {
        field: 'bandScore',
        headerName: 'Band',
        width: 88,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ value }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
            <span className="certificates-table__band">{String(value)}</span>
          </Box>
        ),
      },
      { field: 'templateName', headerName: 'Template', flex: 1, minWidth: 152 },
      {
        field: 'status',
        headerName: 'Status',
        width: 118,
        sortable: false,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <StatusChip status={row.status} />
          </Box>
        ),
      },
      {
        field: 'verificationCode',
        headerName: 'Verification',
        flex: 0.9,
        minWidth: 148,
        sortable: false,
        renderCell: ({ value }) => (
          <span className="certificates-table__code" title={String(value)}>
            {String(value)}
          </span>
        ),
      },
      {
        field: 'id',
        headerName: 'Actions',
        width: 212,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Box
            className="certificates-table__actions"
            sx={{ height: '100%' }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info(`Preview: ${row.studentName}`)}
            >
              Preview
            </Button>
            <Box className="certificates-table__actions-slot" aria-hidden={row.status === 'issued'}>
              {row.status !== 'issued' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast.success(`Certificate issued for ${row.studentName}`)}
                >
                  Issue
                </Button>
              ) : null}
            </Box>
          </Box>
        ),
      },
    ],
    [toast],
  )

  return (
    <Layout>
      <CertificatesPageRoot>
        <Box className="certificates-page" sx={{ p: { xs: 2, md: 3 } }}>
          <Box className="certificates-page__header">
            <Box>
              <Typography component="h1" className="certificates-page__title">
                Certificates
              </Typography>
              <Typography component="p" className="certificates-page__subtitle">
                Manage templates, issue history, and verification codes.
              </Typography>
            </Box>
            <Box className="certificates-page__actions">
              <Button variant="secondary" onClick={() => toast.info('Template editor coming soon')}>
                Add template
              </Button>
              <Button variant="primary" onClick={() => toast.info('Issue certificate flow coming soon')}>
                Issue certificate
              </Button>
            </Box>
          </Box>

          <Box className="certificates-page__stats">
            <Box className="certificates-page__stat">
              <Typography component="p" className="certificates-page__stat-label">
                Templates
              </Typography>
              <Typography component="p" className="certificates-page__stat-value">
                {stats.templates}
              </Typography>
            </Box>
            <Box className="certificates-page__stat">
              <Typography component="p" className="certificates-page__stat-label">
                Total issued
              </Typography>
              <Typography component="p" className="certificates-page__stat-value">
                {stats.issued}
              </Typography>
            </Box>
            <Box className="certificates-page__stat">
              <Typography component="p" className="certificates-page__stat-label">
                Pending review
              </Typography>
              <Typography component="p" className="certificates-page__stat-value">
                {stats.pending}
              </Typography>
            </Box>
          </Box>

          <Box className="certificates-page__panel">
            <Tabs
              value={tab}
              onChange={(_, value: TabKey) => setTab(value)}
              sx={{ px: 2, borderBottom: `1px solid ${c.border.default}` }}
            >
              <Tab label="Issued & pending" value="issued" />
              <Tab label="Templates" value="templates" />
            </Tabs>

            {tab === 'issued' ? (
              <CertificatesTable
                rows={filteredRows}
                columns={columns}
                search={search}
                statusFilter={statusFilter}
                statusFilters={STATUS_FILTERS}
                paginationModel={paginationModel}
                onSearchChange={setSearch}
                onStatusFilterChange={setStatusFilter}
                onPaginationChange={setPaginationModel}
              />
            ) : (
              <Box className="certificates-page__templates">
                {CERTIFICATE_TEMPLATES.map((template) => (
                  <Box key={template.id} className="certificates-page__template-card">
                    <Typography component="p" className="certificates-page__template-name">
                      {template.name}
                    </Typography>
                    <Typography component="p" className="certificates-page__template-meta">
                      Used {template.usageCount} times
                    </Typography>
                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast.info(`Edit template: ${template.name}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        onClick={() => toast.info(`Preview: ${template.name}`)}
                      >
                        Preview
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CertificatesPageRoot>
    </Layout>
  )
}
