import { useEffect, useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import { c } from '../../../theme'
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.75,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
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
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>Review plan purchase</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 0 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px solid ${c.border.default}`,
            background: c.surface.muted,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {purchase.planName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {centerName}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <SummaryRow label="Exam credits" value={String(purchase.examCount)} />
          <SummaryRow label="Amount" value={`$${purchase.amount.toFixed(2)}`} />
          <SummaryRow label="Submitted" value={formatPaymentDate(purchase.createdAt)} />
        </Box>

        {purchase.centerNote ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: `1px dashed ${c.border.soft}`,
              background: c.surface.default,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Center note
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {purchase.centerNote}
            </Typography>
          </Box>
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
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
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
