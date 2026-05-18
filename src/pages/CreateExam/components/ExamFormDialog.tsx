import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { Button } from '../../../components/common/Button'
import { DateInput } from '../../../components/common/DateInput'
import { Select } from '../../../components/common/Select'
import { useToast } from '../../../components/common/Toast'
import { formatPriceValue, parsePriceValue } from '../../../utils/priceFormat'
import { ExamFormDialogRoot } from './ExamFormDialog.style'

type ExamFormMode = { mode: 'create' } | { mode: 'edit'; examId: string }

type ExamFormValues = {
  title: string
  examiner: string
  examType: 'IELTS' | 'CEFR'
  examDate: string
  startTime: string
  endTime: string
  price: string
}

type ExamFormDialogProps = {
  open: boolean
  formMode: ExamFormMode | null
  initialValues?: Partial<ExamFormValues>
  busy: boolean
  onClose: () => void
  onSave: (values: ExamFormValues) => void
}

const EMPTY_FORM: ExamFormValues = {
  title: '',
  examiner: '',
  examType: 'IELTS',
  examDate: '',
  startTime: '',
  endTime: '',
  price: '',
}

export function ExamFormDialog({
  open,
  formMode,
  initialValues,
  busy,
  onClose,
  onSave,
}: ExamFormDialogProps) {
  const toast = useToast()
  const [form, setForm] = useState<ExamFormValues>(EMPTY_FORM)

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initialValues,
        price: initialValues?.price ? formatPriceValue(initialValues.price) : '',
      })
    }
  }, [open, initialValues])

  const updateField = useCallback(
    <K extends keyof ExamFormValues>(key: K, value: ExamFormValues[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const handleSubmit = useCallback(() => {
    if (!form.title.trim()) {
      toast.error('Exam title is required.')
      return
    }
    if (!form.examiner.trim()) {
      toast.error('Teacher / Examiner is required.')
      return
    }
    if (!form.examDate) {
      toast.error('Exam date is required.')
      return
    }
    if (!form.startTime || !form.endTime) {
      toast.error('Start time and end time are required.')
      return
    }
    if (!form.price) {
      toast.error('Price is required.')
      return
    }
    const numPrice = parsePriceValue(form.price)
    if (!Number.isFinite(numPrice) || numPrice < 0) {
      toast.error('Price must be a valid positive number.')
      return
    }
    onSave(form)
  }, [form, onSave, toast])

  const isEdit = formMode?.mode === 'edit'

  return (
    <ExamFormDialogRoot
      open={open}
      onClose={(_e, reason) => {
        if (busy && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return
        onClose()
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="exam-form__title">
        <Box className="exam-form__title-icon">{isEdit ? '✏️' : '📝'}</Box>
        <Box>
          <Typography className="exam-form__title-text">
            {isEdit ? 'Edit Exam' : 'Add New Exam'}
          </Typography>
          <Typography className="exam-form__title-sub">
            {isEdit ? 'Update exam details below.' : 'Fill in the details to create a new exam.'}
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent className="exam-form__content">
        <TextField
          label="Exam Title"
          placeholder="e.g. IELTS Academic Mock — Jan 2025"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          fullWidth
          className="exam-form__field"
        />

        <TextField
          label="Teacher / Examiner"
          placeholder="e.g. John Smith"
          value={form.examiner}
          onChange={(e) => updateField('examiner', e.target.value)}
          fullWidth
          className="exam-form__field"
        />

        <Select
          label="Exam Type"
          value={form.examType}
          onChange={(e) => updateField('examType', e.target.value as 'IELTS' | 'CEFR')}
          fullWidth
          className="exam-form__field"
          options={[
            { value: 'IELTS', label: 'IELTS' },
            { value: 'CEFR', label: 'CEFR' },
          ]}
        />

        <DateInput
          label="Exam Date"
          value={form.examDate}
          onChange={(e) => updateField('examDate', e.target.value)}
          fullWidth
          className="exam-form__field"
        />

        <Box className="exam-form__row">
          <TextField
            label="Start Time"
            type="time"
            value={form.startTime}
            onChange={(e) => updateField('startTime', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            className="exam-form__field"
          />
          <TextField
            label="End Time"
            type="time"
            value={form.endTime}
            onChange={(e) => updateField('endTime', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
            className="exam-form__field"
          />
        </Box>

        <TextField
          label="Price (UZS)"
          placeholder="e.g. 350 000"
          value={form.price}
          onChange={(e) => updateField('price', formatPriceValue(e.target.value))}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          fullWidth
          className="exam-form__field"
        />

      </DialogContent>

      <Divider />

      <DialogActions className="exam-form__actions">
        <Button
          variant="secondary"
          className="exam-form__cancel-btn"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="exam-form__save-btn"
          onClick={handleSubmit}
          disabled={busy}
        >
          {busy ? 'Saving...' : isEdit ? 'Update Exam' : 'Save Exam'}
        </Button>
      </DialogActions>
    </ExamFormDialogRoot>
  )
}
