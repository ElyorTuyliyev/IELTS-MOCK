import { useCallback, useMemo, useState } from 'react'
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { c } from '../../../theme'
import { CertificatePreviewDialog } from '../components/CertificatePreviewDialog'
import { CertificatesTable } from '../components/CertificatesTable'
import {
  CERTIFICATE_TEMPLATES,
  type CertificateRecord,
  type CertificateStatus,
} from '../certificates.data'
import { useCertificates } from '../hooks/useCertificates'
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
  const { certificates, loading, error, issueCertificate, issuing } = useCertificates()
  const [tab, setTab] = useState<TabKey>('issued')
  const [statusFilter, setStatusFilter] = useState<'all' | CertificateStatus>('all')
  const [search, setSearch] = useState('')
  const [previewRecord, setPreviewRecord] = useState<CertificateRecord | null>(null)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 8,
  })

  const openPreview = useCallback((record: CertificateRecord) => {
    setPreviewRecord(record)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewRecord(null)
  }, [])

  const templatesWithUsage = useMemo(() => {
    const counts = new Map<string, number>()
    for (const cert of certificates) {
      counts.set(cert.templateName, (counts.get(cert.templateName) ?? 0) + 1)
    }
    return CERTIFICATE_TEMPLATES.map((tpl) => ({
      ...tpl,
      usageCount: counts.get(tpl.name) ?? 0,
    }))
  }, [certificates])

  const stats = useMemo(() => {
    const issued = certificates.filter((row) => row.status === 'issued').length
    const pending = certificates.filter((row) => row.status === 'pending').length
    const templateNames = new Set(certificates.map((c) => c.templateName))
    return {
      templates: templateNames.size || CERTIFICATE_TEMPLATES.length,
      issued,
      pending,
    }
  }, [certificates])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return certificates.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (!query) return true
      return (
        row.studentName.toLowerCase().includes(query) ||
        row.examName.toLowerCase().includes(query) ||
        row.templateName.toLowerCase().includes(query) ||
        row.verificationCode.toLowerCase().includes(query)
      )
    })
  }, [certificates, search, statusFilter])

  const previewSample = certificates[0] ?? null

  const handleIssue = useCallback(
    async (row: CertificateRecord) => {
      try {
        await issueCertificate(row.id)
        toast.success(`Certificate issued for ${row.studentName}`)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to issue certificate'
        toast.error(message)
      }
    },
    [issueCertificate, toast],
  )

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
          <Box className="certificates-table__actions" sx={{ height: '100%' }}>
            <Button variant="secondary" size="sm" onClick={() => openPreview(row)}>
              Preview
            </Button>
            <Box className="certificates-table__actions-slot" aria-hidden={row.status === 'issued'}>
              {row.status !== 'issued' ? (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={issuing}
                  onClick={() => void handleIssue(row)}
                >
                  Issue
                </Button>
              ) : null}
            </Box>
          </Box>
        ),
      },
    ],
    [handleIssue, issuing, openPreview],
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
              <Button variant="primary" onClick={() => toast.info('Select a student row to issue')}>
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

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={36} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <Typography color="error">
                  {error.message || 'Failed to load certificates'}
                </Typography>
              </Box>
            ) : tab === 'issued' ? (
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
                {templatesWithUsage.map((template) => (
                  <Box key={template.id} className="certificates-page__template-card">
                    <Box className="certificates-page__template-thumb" aria-hidden>
                      <Box className="certificates-page__template-thumb-top">
                        <span className="certificates-page__template-thumb-logo">IELTS</span>
                        <span className="certificates-page__template-thumb-type">ACADEMIC</span>
                      </Box>
                      <span className="certificates-page__template-thumb-title">Test Report Form</span>
                      <Box className="certificates-page__template-thumb-bars">
                        <span className="certificates-page__template-thumb-bar" />
                        <span className="certificates-page__template-thumb-bar" />
                        <span className="certificates-page__template-thumb-bar" />
                        <span className="certificates-page__template-thumb-bar" />
                      </Box>
                    </Box>
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
                        disabled={!previewSample}
                        onClick={() => previewSample && openPreview(previewSample)}
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

        <CertificatePreviewDialog
          open={previewRecord !== null}
          record={previewRecord}
          onClose={closePreview}
        />
      </CertificatesPageRoot>
    </Layout>
  )
}
