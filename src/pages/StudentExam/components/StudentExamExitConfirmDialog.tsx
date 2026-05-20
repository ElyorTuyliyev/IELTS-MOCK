import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

export type StudentExamExitConfirmDialogProps = {
  open: boolean
  onStay: () => void
  onLeave: () => void
}

export function StudentExamExitConfirmDialog({
  open,
  onStay,
  onLeave,
}: StudentExamExitConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onStay} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Leave this exam?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Are you finished? If you leave now, your progress may be lost unless you have already
          submitted the test. Do you want to exit?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="secondary" onClick={onStay}>
          Stay on exam
        </Button>
        <Button variant="primary" onClick={onLeave}>
          Yes, exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
