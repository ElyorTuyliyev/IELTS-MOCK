import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import type { PaymentRecord } from '../../Billing/api/billingQueries'
import { PAYMENT_METHODS } from './paymentUtils'

export type PaymentFormValues = {
  centerId: string
  amount: string
  method: string
  note: string
  examCreditsAdded: string
  paidAt: string
}

const EMPTY_FORM: PaymentFormValues = {
  centerId: '',
  amount: '',
  method: 'bank_transfer',
  note: '',
  examCreditsAdded: '',
  paidAt: new Date().toISOString().slice(0, 10),
}

type PaymentFormDialogProps = {
  open: boolean
  mode: 'create' | 'edit'
  payment?: PaymentRecord | null
  centers: Array<{ _id: string; name: string }>
  loading?: boolean
  onClose: () => void
  onSubmit: (values: PaymentFormValues) => void | Promise<void>
}

export function PaymentFormDialog({
  open,
  mode,
  payment,
  centers,
  loading = false,
  onClose,
  onSubmit,
}: PaymentFormDialogProps) {
  const [form, setForm] = useState<PaymentFormValues>(EMPTY_FORM)
  const isPlanLinked = Boolean(payment?.planPurchaseId)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && payment) {
      setForm({
        centerId: payment.centerId,
        amount: String(payment.amount),
        method: payment.method,
        note: payment.note ?? '',
        examCreditsAdded:
          payment.examCreditsAdded != null ? String(payment.examCreditsAdded) : '',
        paidAt: payment.paidAt.slice(0, 10),
      })
      return
    }
    setForm(EMPTY_FORM)
  }, [open, mode, payment])

  const title = mode === 'create' ? 'Record manual payment' : 'Edit payment'

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
        {isPlanLinked ? (
          <Typography variant="body2" color="text.secondary">
            This payment was created from an approved plan purchase. Center and exam credits
            cannot be changed.
          </Typography>
        ) : null}
        <TextField
          select
          label="Center"
          value={form.centerId}
          onChange={(event) => setForm((current) => ({ ...current, centerId: event.target.value }))}
          fullWidth
          disabled={loading || isPlanLinked}
        >
          {centers.map((center) => (
            <MenuItem key={center._id} value={center._id}>
              {center.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Exam credits to add"
          type="number"
          value={form.examCreditsAdded}
          onChange={(event) =>
            setForm((current) => ({ ...current, examCreditsAdded: event.target.value }))
          }
          fullWidth
          helperText={
            isPlanLinked
              ? 'Locked for plan-purchase records'
              : 'Optional — added to the center exam credit balance'
          }
          disabled={loading || isPlanLinked}
        />
        <TextField
          label="Payment amount (USD)"
          type="number"
          value={form.amount}
          onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
          fullWidth
          helperText="Amount paid by the center"
          disabled={loading}
        />
        <TextField
          select
          label="Payment method"
          value={form.method}
          onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))}
          fullWidth
          disabled={loading}
        >
          {PAYMENT_METHODS.map((method) => (
            <MenuItem key={method.value} value={method.value}>
              {method.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Paid at"
          type="date"
          value={form.paidAt}
          onChange={(event) => setForm((current) => ({ ...current, paidAt: event.target.value }))}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          disabled={loading}
        />
        <TextField
          label="Note"
          value={form.note}
          onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          fullWidth
          multiline
          minRows={2}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSubmit(form)} disabled={loading} loading={loading}>
          {mode === 'create' ? 'Save payment' : 'Update payment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
