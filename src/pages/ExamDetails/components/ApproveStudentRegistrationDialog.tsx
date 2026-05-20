import { useEffect, useState } from 'react'
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from '@mui/material'

import { Button } from '../../../components/common/Button'

type ApproveStudentRegistrationDialogProps = {
  open: boolean
  studentName: string
  showPaymentOption: boolean
  loading?: boolean
  onClose: () => void
  onConfirm: (alsoApprovePayment: boolean) => void | Promise<void>
}

export function ApproveStudentRegistrationDialog({
  open,
  studentName,
  showPaymentOption,
  loading = false,
  onClose,
  onConfirm,
}: ApproveStudentRegistrationDialogProps) {
  const [alsoApprovePayment, setAlsoApprovePayment] = useState(true)

  useEffect(() => {
    if (open) {
      setAlsoApprovePayment(true)
    }
  }, [open])

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>Approve registration</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Approve <strong>{studentName}</strong> for this exam?
        </Typography>
        {showPaymentOption ? (
          <FormControlLabel
            control={
              <Checkbox
                checked={alsoApprovePayment}
                onChange={(e) => setAlsoApprovePayment(e.target.checked)}
              />
            }
            label="Also mark payment as completed"
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={loading}
          onClick={() => void onConfirm(alsoApprovePayment)}
        >
          Approve registration
        </Button>
      </DialogActions>
    </Dialog>
  )
}
