import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { CertificatesTable } from '../../Certificates/components/CertificatesTable'
import { CertificatePreviewDialog } from '../../Certificates/components/CertificatePreviewDialog'
import type { CertificateRecord } from '../../Certificates/certificates.data'
import { CertificatesPageRoot } from '../../Certificates/pages/CertificatesPage.style'
import { formatCertificateDate } from '../../Certificates/utils/certificateUtils'
import { useMyCertificates } from '../hooks/useMyCertificates'
import { StudentCertificatesPageRoot } from './StudentCertificatesPage.style'

function formatSkillSummary(record: CertificateRecord): string {
  const skills = record.skillScores
  if (!skills) return '—'
  return `L ${skills.listening} · R ${skills.reading} · W ${skills.writing} · S ${skills.speaking}`
}

export function StudentCertificatesPage() {
  const toast = useToast()
  const { certificates, loading, error } = useMyCertificates()
  const [previewRecord, setPreviewRecord] = useState<CertificateRecord | null>(null)
  const [search, setSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })

  useEffect(() => {
    if (error) {
      toast.error(getGraphQLErrorMessage(error, 'Failed to load your certificates.'))
    }
  }, [error, toast])

  const openPreview = useCallback((record: CertificateRecord) => {
    setPreviewRecord(record)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewRecord(null)
  }, [])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return certificates
    return certificates.filter((row) => {
      const skills = formatSkillSummary(row).toLowerCase()
      return (
        row.examName.toLowerCase().includes(query) ||
        row.bandScore.toLowerCase().includes(query) ||
        row.verificationCode.toLowerCase().includes(query) ||
        (row.testType ?? '').toLowerCase().includes(query) ||
        skills.includes(query)
      )
    })
  }, [certificates, search])

  const columns = useMemo<GridColDef<CertificateRecord>[]>(
    () => [
      { field: 'examName', headerName: 'Mock test', flex: 1.35, minWidth: 180 },
      {
        field: 'bandScore',
        headerName: 'Overall',
        width: 96,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: ({ value }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <span className="certificates-table__band">{String(value)}</span>
          </Box>
        ),
      },
      {
        field: 'skillScores',
        headerName: 'Scores (L · R · W · S)',
        flex: 1.2,
        minWidth: 200,
        sortable: false,
        valueGetter: (_value, row) => formatSkillSummary(row),
      },
      {
        field: 'testDate',
        headerName: 'Test date',
        width: 120,
        sortable: false,
        valueGetter: (_value, row) => formatCertificateDate(row.testDate),
      },
      {
        field: 'issuedDate',
        headerName: 'Issued',
        width: 120,
        sortable: false,
        valueGetter: (_value, row) =>
          formatCertificateDate(row.issuedDate ?? row.testDate),
      },
      {
        field: 'verificationCode',
        headerName: 'Verification',
        flex: 0.95,
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
        width: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: ({ row }) => (
          <Box className="certificates-table__actions" sx={{ height: '100%' }}>
            <Button variant="secondary" size="sm" onClick={() => openPreview(row)}>
              View
            </Button>
          </Box>
        ),
      },
    ],
    [openPreview],
  )

  return (
    <Layout>
      <StudentCertificatesPageRoot>
        <CertificatesPageRoot>
          <Box className="certificates-page student-certificates-page" sx={{ p: { xs: 2, md: 3 } }}>
            <Box className="certificates-page__header">
              <Box>
                <Typography component="h1" className="certificates-page__title">
                  My certificates
                </Typography>
                <Typography component="p" className="certificates-page__subtitle">
                  Your issued mock test certificates and band scores. Only your own results are
                  listed here.
                </Typography>
              </Box>
            </Box>

            {loading ? (
              <Typography color="text.secondary">Loading certificates…</Typography>
            ) : certificates.length === 0 ? (
              <Box className="student-certificates-page__empty">
                No certificates yet. Your certificate appears here after you finish the mock test and
                your center grades writing and speaking. If you were graded recently, refresh this
                page.
              </Box>
            ) : (
              <Box className="certificates-page__panel">
                <CertificatesTable
                  rows={filteredRows}
                  columns={columns}
                  search={search}
                  statusFilter="all"
                  statusFilters={[{ value: 'all', label: 'All' }]}
                  paginationModel={paginationModel}
                  onSearchChange={setSearch}
                  onStatusFilterChange={() => undefined}
                  onPaginationChange={setPaginationModel}
                  showStatusFilters={false}
                  searchPlaceholder="Search mock test, band, verification code…"
                  emptyLabel="No certificates matched your search."
                />
              </Box>
            )}
          </Box>
        </CertificatesPageRoot>
      </StudentCertificatesPageRoot>

      <CertificatePreviewDialog
        open={previewRecord != null}
        record={previewRecord}
        onClose={closePreview}
      />
    </Layout>
  )
}
