import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material'

import { Button } from '../../../components/common/Button'
import { c } from '../../../theme'

export type PlanFormState = {
  name: string
  examCount: string
  price: string
  paymentInstructions: string
  isActive: boolean
}

type ExamPlanFormDialogProps = {
  open: boolean
  editing: boolean
  form: PlanFormState
  loading?: boolean
  onClose: () => void
  onChange: (patch: Partial<PlanFormState>) => void
  onSave: () => void | Promise<void>
}

export function ExamPlanFormDialog({
  open,
  editing,
  form,
  loading = false,
  onClose,
  onChange,
  onSave,
}: ExamPlanFormDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{ pb: 1 }}>{editing ? 'Edit exam plan' : 'Create exam plan'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 0 }}>
        <TextField
          label="Plan name"
          value={form.name}
          onChange={(event) => onChange({ name: event.target.value })}
          fullWidth
          disabled={loading}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            label="Exam count"
            type="number"
            value={form.examCount}
            onChange={(event) => onChange({ examCount: event.target.value })}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Price (USD)"
            type="number"
            value={form.price}
            onChange={(event) => onChange({ price: event.target.value })}
            fullWidth
            disabled={loading}
          />
        </Box>
        <TextField
          label="Payment instructions"
          value={form.paymentInstructions}
          onChange={(event) => onChange({ paymentInstructions: event.target.value })}
          fullWidth
          multiline
          minRows={4}
          helperText="Shown to centers when they purchase this plan"
          disabled={loading}
        />
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: `1px solid ${c.border.default}`,
            background: c.surface.muted,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(event) => onChange({ isActive: event.target.checked })}
                disabled={loading}
              />
            }
            label="Plan is active and visible to centers"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave} disabled={loading} loading={loading}>
          {editing ? 'Update plan' : 'Create plan'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
