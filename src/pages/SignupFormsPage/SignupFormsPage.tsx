import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Alert, Box, Button, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'

import { Layout } from '../../components/layout'
import { FIND_STUDENT_SIGNUP_LEADS_QUERY } from './api/findStudentSignupLeadsQuery'
import {
  ACCEPT_STUDENT_SIGNUP_LEAD_MUTATION,
  REJECT_STUDENT_SIGNUP_LEAD_MUTATION,
} from './api/studentSignupLeadActionsMutation'
import { AllStudentsPageRoot } from '../AllStudentsPage/AllStudentsPage.style'

type LeadRow = {
  id: string
  firstName: string
  lastName: string
  phone: string
  status: string
  createdAt: string
}

type FindLeadsResponse = {
  findStudentSignupLeads: Array<{
    _id: string
    firstName: string
    lastName: string
    phone: string
    status: string
    createdAt: string
    updatedAt: string
  }>
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function formatStatus(status: string) {
  if (status === 'pending') return 'Pending'
  if (status === 'accepted') return 'Accepted'
  if (status === 'rejected') return 'Rejected'
  return status
}

export function SignupFormsPage() {
  const [actionError, setActionError] = useState<string | null>(null)
  const { data, loading, error } = useQuery<FindLeadsResponse>(FIND_STUDENT_SIGNUP_LEADS_QUERY)

  const [acceptLead, { loading: accepting }] = useMutation(ACCEPT_STUDENT_SIGNUP_LEAD_MUTATION, {
    refetchQueries: [{ query: FIND_STUDENT_SIGNUP_LEADS_QUERY }],
  })
  const [rejectLead, { loading: rejecting }] = useMutation(REJECT_STUDENT_SIGNUP_LEAD_MUTATION, {
    refetchQueries: [{ query: FIND_STUDENT_SIGNUP_LEADS_QUERY }],
  })

  const busy = accepting || rejecting

  const handleAccept = useCallback(
    async (id: string) => {
      setActionError(null)
      const res = await acceptLead({ variables: { _id: id } })
      if (res.error) {
        const gqlErrors =
          'graphQLErrors' in res.error && Array.isArray(res.error.graphQLErrors)
            ? res.error.graphQLErrors
            : []
        const gqlMsg = gqlErrors[0] && 'message' in gqlErrors[0] ? String(gqlErrors[0].message) : null
        setActionError(gqlMsg ?? res.error.message ?? 'Accept failed.')
      }
    },
    [acceptLead],
  )

  const handleReject = useCallback(
    async (id: string) => {
      setActionError(null)
      const res = await rejectLead({ variables: { _id: id } })
      if (res.error) {
        const gqlErrors =
          'graphQLErrors' in res.error && Array.isArray(res.error.graphQLErrors)
            ? res.error.graphQLErrors
            : []
        const gqlMsg = gqlErrors[0] && 'message' in gqlErrors[0] ? String(gqlErrors[0].message) : null
        setActionError(gqlMsg ?? res.error.message ?? 'Reject failed.')
      }
    },
    [rejectLead],
  )

  const rows: LeadRow[] = useMemo(() => {
    const list = data?.findStudentSignupLeads ?? []
    return list.map((row) => ({
      id: row._id,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      status: row.status ?? 'pending',
      createdAt: row.createdAt,
    }))
  }, [data])

  const columns: GridColDef<LeadRow>[] = useMemo(
    () => [
      { field: 'firstName', headerName: 'First name', flex: 1, minWidth: 120 },
      { field: 'lastName', headerName: 'Last name', flex: 1, minWidth: 120 },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 140 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.6,
        minWidth: 110,
        valueGetter: (_value, row) => formatStatus(row.status),
      },
      {
        field: 'createdAt',
        headerName: 'Submitted',
        flex: 1.1,
        minWidth: 180,
        valueGetter: (_value, row) => formatDate(row.createdAt),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        minWidth: 200,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams<LeadRow>) => {
          const row = params.row
          if (row.status !== 'pending') {
            return (
              <Typography variant="body2" sx={{ color: '#94a3b8', alignSelf: 'center' }}>
                —
              </Typography>
            )
          }
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
              <Button
                type="button"
                size="small"
                variant="contained"
                disabled={busy}
                onClick={() => void handleAccept(row.id)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                }}
              >
                Accept
              </Button>
              <Button
                type="button"
                size="small"
                variant="outlined"
                color="error"
                disabled={busy}
                onClick={() => void handleReject(row.id)}
                sx={{ textTransform: 'none', borderRadius: '10px', fontWeight: 700 }}
              >
                Reject
              </Button>
            </Box>
          )
        },
      },
    ],
    [busy, handleAccept, handleReject],
  )

  return (
    <Layout>
      <AllStudentsPageRoot>
        <Box className="students-page">
          <Box className="students-page__head">
            <Box>
              <Typography component="h1" className="students-page__title">
                Signup forms
              </Typography>
              <Typography sx={{ color: '#64748b', mt: 0.5, maxWidth: 640 }}>
                Short applications from your invite link. <strong>Accept</strong> adds a student account (email{' '}
                <code style={{ margin: '0 4px' }}>lead+&lt;id&gt;@invite.ieltsmock.local</code> and a random
                password) and removes the row from this list. <strong>Reject</strong> keeps the row here with
                status Rejected.
              </Typography>
            </Box>
          </Box>

          {error ? <Alert severity="error">{error.message}</Alert> : null}
          {actionError ? (
            <Alert severity="warning" onClose={() => setActionError(null)}>
              {actionError}
            </Alert>
          ) : null}

          {!error ? (
            <Box className="students-table" sx={{ height: 560, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50]}
                initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              />
            </Box>
          ) : null}
        </Box>
      </AllStudentsPageRoot>
    </Layout>
  )
}
