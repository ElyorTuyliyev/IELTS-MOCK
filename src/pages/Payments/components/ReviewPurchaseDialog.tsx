import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import type { PendingPlanPurchase } from '../../Billing/api/billingQueries'
import { formatPaymentDate, resolveCenterName } from './paymentUtils'

type ReviewPurchaseDialogProps = {
  open: boolean
  purchase: PendingPlanPurchase | null
  centers: Array<{ _id: string; name: string }>
  loading?: boolean
  onClose: () => void
  onConfirm: (approve: boolean, adminNote: string) => void | Promise<void>
}

export function ReviewPurchaseDialog({
  open,
  purchase,
  centers,
  loading = false,
  onClose,
  onConfirm,
}: ReviewPurchaseDialogProps) {
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    if (open) {
      setAdminNote('')
    }
  }, [open, purchase?._id])

  if (!purchase) {
    return null
  }

  const centerName = resolveCenterName(centers, purchase.centerId)

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Review plan purchase</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
        <Typography>
          <strong>{purchase.planName}</strong> · {centerName}
        </Typography>
        <Typography color="text.secondary">
          {purchase.examCount} exam credits · ${purchase.amount.toFixed(2)} · submitted{' '}
          {formatPaymentDate(purchase.createdAt)}
        </Typography>
        {purchase.centerNote ? (
          <Typography variant="body2">
            Center note: {purchase.centerNote}
          </Typography>
        ) : null}
        <TextField
          label="Admin note (optional)"
          value={adminNote}
          onChange={(event) => setAdminNote(event.target.value)}
          fullWidth
          multiline
          minRows={2}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => onConfirm(false, adminNote)}
          disabled={loading}
        >
          Reject
        </Button>
        <Button
          variant="primary"
          onClick={() => onConfirm(true, adminNote)}
          disabled={loading}
          loading={loading}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  )
}
