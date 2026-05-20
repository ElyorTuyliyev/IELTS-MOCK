import { Box } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'

import { Button } from '../../../components/common/Button'
import { MenuActionCell } from '../../../components/common/MenuAction'
import type { PaymentRecord, PendingPlanPurchase } from '../../Billing/api/billingQueries'
import { BillingStatusChip } from '../../Billing/components/BillingStatusChip'
import { PaymentRowActionsMenu } from '../components/PaymentRowActionsMenu'
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
      minWidth: 150,
      valueFormatter: (value) => formatPaymentDate(String(value)),
    },
    { field: 'centerName', headerName: 'Center', flex: 1.1, minWidth: 150 },
    { field: 'planName', headerName: 'Plan', flex: 1, minWidth: 130 },
    {
      field: 'examCount',
      headerName: 'Credits',
      width: 96,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          <span className="payments-table__credits">{String(value)}</span>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span className="payments-table__amount">${Number(value).toFixed(2)}</span>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 168,
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
      minWidth: 160,
      sortable: false,
      renderCell: ({ value }) => (
        <span className="payments-table__note" title={value ? String(value) : undefined}>
          {value ? String(value) : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box className="payments-table__actions" sx={{ height: '100%' }}>
          <Button variant="primary" size="sm" onClick={() => onReview(row)}>
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
      minWidth: 150,
      valueFormatter: (value) => formatPaymentDate(String(value)),
    },
    { field: 'centerName', headerName: 'Center', flex: 1.1, minWidth: 140 },
    {
      field: 'examCreditsAdded',
      headerName: 'Credits',
      width: 96,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
          {value != null ? (
            <span className="payments-table__credits">{String(value)}</span>
          ) : (
            <span className="payments-table__note">—</span>
          )}
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      renderCell: ({ value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <span className="payments-table__amount">${Number(value).toFixed(2)}</span>
        </Box>
      ),
    },
    { field: 'method', headerName: 'Method', width: 120 },
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
    {
      field: 'source',
      headerName: 'Source',
      width: 130,
      sortable: false,
      renderCell: ({ value }) => (
        <span
          className={
            value === 'Plan approval'
              ? 'payments-table__source payments-table__source--plan'
              : 'payments-table__source'
          }
        >
          {String(value)}
        </span>
      ),
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: ({ value }) => (
        <span className="payments-table__note" title={value ? String(value) : undefined}>
          {value ? String(value) : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 64,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <MenuActionCell>
          <PaymentRowActionsMenu row={row} onEdit={onEdit} onDelete={onDelete} />
        </MenuActionCell>
      ),
    },
  ]
}
