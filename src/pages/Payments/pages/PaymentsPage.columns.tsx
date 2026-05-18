import { Box } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import { Button } from '../../../components/common/Button'
import type { PaymentRecord, PendingPlanPurchase } from '../../Billing/api/billingQueries'
import { BillingStatusChip } from '../../Billing/components/BillingStatusChip'
import { formatPaymentDate } from '../components/paymentUtils'

export type PendingRow = PendingPlanPurchase & { centerName: string }
export type PaymentRow = PaymentRecord & { centerName: string; source: string }

type PendingColumnHandlers = {
  onReview: (row: PendingRow) => void
}

type PaymentColumnHandlers = {
  onEdit: (row: PaymentRow) => void
  onDelete: (row: PaymentRow) => void
}

export function createPendingColumns({
  onReview,
}: PendingColumnHandlers): GridColDef<PendingRow>[] {
  return [
    {
      field: 'createdAt',
      headerName: 'Submitted',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value) => formatPaymentDate(String(value)),
    },
    { field: 'centerName', headerName: 'Center', flex: 1, minWidth: 160 },
    { field: 'planName', headerName: 'Plan', flex: 1, minWidth: 140 },
    {
      field: 'examCount',
      headerName: 'Credits',
      width: 100,
      type: 'number',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <BillingStatusChip status={row.status} recordType="plan_purchase" />
        </Box>
      ),
    },
    {
      field: 'centerNote',
      headerName: 'Center note',
      flex: 1,
      minWidth: 180,
      valueFormatter: (value) => (value ? String(value) : '—'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Button variant="primary" onClick={() => onReview(row)}>
            Review
          </Button>
        </Box>
      ),
    },
  ]
}

export function createPaymentColumns({
  onEdit,
  onDelete,
}: PaymentColumnHandlers): GridColDef<PaymentRow>[] {
  return [
    {
      field: 'paidAt',
      headerName: 'Paid at',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value) => formatPaymentDate(String(value)),
    },
    { field: 'centerName', headerName: 'Center', flex: 1, minWidth: 150 },
    {
      field: 'examCreditsAdded',
      headerName: 'Credits',
      width: 90,
      valueFormatter: (value) => (value != null ? String(value) : '—'),
    },
    {
      field: 'amount',
      headerName: 'Amount (USD)',
      width: 120,
      valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
    },
    { field: 'method', headerName: 'Method', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <BillingStatusChip recordType="payment" />
        </Box>
      ),
    },
    { field: 'source', headerName: 'Source', width: 130 },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1,
      minWidth: 160,
      valueFormatter: (value) => (value ? String(value) : '—'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Button variant="secondary" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => onDelete(row)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ]
}
