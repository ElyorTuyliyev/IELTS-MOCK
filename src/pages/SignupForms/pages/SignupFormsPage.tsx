import { useCallback, useEffect, useMemo } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Typography } from '@mui/material'
import { c } from '../../../theme'
import { Button } from '../../../components/common/Button'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'

import { Layout } from '../../../components/layout'
import { useToast } from '../../../components/common/Toast'
import {
  formatIsoDateTime,
  formatSignupLeadStatus,
  getGraphQLErrorMessage,
} from '../../../helpers'
import { FIND_STUDENT_SIGNUP_LEADS_QUERY } from '../api/findStudentSignupLeadsQuery'
import {
  ACCEPT_STUDENT_SIGNUP_LEAD_MUTATION,
  REJECT_STUDENT_SIGNUP_LEAD_MUTATION,
} from '../api/studentSignupLeadActionsMutation'
import { AllStudentsPageRoot } from '../../AllStudents/pages/AllStudentsPage.style'

type LeadRow = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  status: string
  createdAt: string
}

type FindLeadsResponse = {
  findStudentSignupLeads: Array<{
    _id: string
    firstName: string
    lastName: string
    phone: string
    email: string
    status: string
    createdAt: string
    updatedAt: string
  }>
}

export function SignupFormsPage() {
  const toast = useToast()
  const { data, loading, error } = useQuery<FindLeadsResponse>(FIND_STUDENT_SIGNUP_LEADS_QUERY)

  const [acceptLead, { loading: accepting }] = useMutation(ACCEPT_STUDENT_SIGNUP_LEAD_MUTATION, {
    refetchQueries: [{ query: FIND_STUDENT_SIGNUP_LEADS_QUERY }],
  })
  const [rejectLead, { loading: rejecting }] = useMutation(REJECT_STUDENT_SIGNUP_LEAD_MUTATION, {
    refetchQueries: [{ query: FIND_STUDENT_SIGNUP_LEADS_QUERY }],
  })

  const busy = accepting || rejecting

  useEffect(() => {
    if (error?.message) {
      toast.error(error.message)
    }
  }, [error, toast])

  const handleAccept = useCallback(
    async (id: string) => {
      const res = await acceptLead({ variables: { _id: id } })
      if (res.error) {
        toast.error(getGraphQLErrorMessage(res.error, 'Accept failed.'))
      } else {
        toast.success('Signup lead accepted.')
      }
    },
    [acceptLead, toast],
  )

  const handleReject = useCallback(
    async (id: string) => {
      const res = await rejectLead({ variables: { _id: id } })
      if (res.error) {
        toast.error(getGraphQLErrorMessage(res.error, 'Reject failed.'))
      } else {
        toast.success('Signup lead rejected.')
      }
    },
    [rejectLead, toast],
  )

  const rows: LeadRow[] = useMemo(() => {
    const list = data?.findStudentSignupLeads ?? []
    return list.map((row) => ({
      id: row._id,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      email: row.email,
      status: row.status ?? 'pending',
      createdAt: row.createdAt,
    }))
  }, [data])

  const columns: GridColDef<LeadRow>[] = useMemo(
    () => [
      { field: 'firstName', headerName: 'First name', flex: 1, minWidth: 120 },
      { field: 'lastName', headerName: 'Last name', flex: 1, minWidth: 120 },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 140 },
      { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.6,
        minWidth: 110,
        valueGetter: (_value, row) => formatSignupLeadStatus(row.status),
      },
      {
        field: 'createdAt',
        headerName: 'Submitted',
        flex: 1.1,
        minWidth: 180,
        valueGetter: (_value, row) => formatIsoDateTime(row.createdAt),
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
              <Typography variant="body2" sx={{ color: c.text.disabled, alignSelf: 'center' }}>
                —
              </Typography>
            )
          }
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
              <Button
                type="button"
                size="sm"
                variant="primary"
                disabled={busy}
                onClick={() => void handleAccept(row.id)}
                sx={{
                  textTransform: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  background: c.gradient.primary,
                }}
              >
                Accept
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
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
            <Typography component="h1" className="students-page__title">
              Signup forms
            </Typography>
          </Box>

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
