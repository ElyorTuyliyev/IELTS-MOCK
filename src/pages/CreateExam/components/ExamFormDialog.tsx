import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import {
  Box,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { DateInput } from '../../../components/common/DateInput'
import { Select } from '../../../components/common/Select'
import { useToast } from '../../../components/common/Toast'
import { ROUTES_PATH } from '../../../routes/paths'
import { useAppSelector } from '../../../store/hooks'
import { selectUserRole } from '../../../store'
import { USER_ROLES } from '../../../store/slices/authSlice'
import { formatPriceValue, parsePriceValue } from '../../../utils/priceFormat'
import { CENTER_PAYMENT_SETTINGS_QUERY } from '../../../features/examPayments/api/examPaymentsQueries'
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
  showPrice: boolean
  isUpcomingVisibleToStudents: boolean
  useGlobalPaymentInstructions: boolean
  customPaymentInstructions: string
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
  showPrice: true,
  isUpcomingVisibleToStudents: false,
  useGlobalPaymentInstructions: true,
  customPaymentInstructions: '',
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
  const userRole = useAppSelector(selectUserRole)
  const [form, setForm] = useState<ExamFormValues>(EMPTY_FORM)

  const { data: centerSettings } = useQuery<{
    centerPaymentSettings: { globalPaymentInstructions?: string | null }
  }>(CENTER_PAYMENT_SETTINGS_QUERY, {
    skip: !open || userRole !== USER_ROLES.center,
  })

  const globalPaymentInstructions =
    centerSettings?.centerPaymentSettings?.globalPaymentInstructions?.trim() ?? ''

  const isPaidExam = useMemo(() => {
    const price = parsePriceValue(form.price)
    return Number.isFinite(price) && price > 0
  }, [form.price])

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY_FORM,
        ...initialValues,
        price: initialValues?.price ? formatPriceValue(initialValues.price) : '',
        useGlobalPaymentInstructions:
          initialValues?.useGlobalPaymentInstructions ?? true,
        customPaymentInstructions: initialValues?.customPaymentInstructions ?? '',
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

    if (numPrice > 0) {
      if (form.useGlobalPaymentInstructions && !globalPaymentInstructions) {
        toast.error(
          'Global payment instructions are missing. Add them on the Payments page or use custom instructions for this exam.',
        )
        return
      }
      if (!form.useGlobalPaymentInstructions && !form.customPaymentInstructions.trim()) {
        toast.error('Custom payment instructions are required for paid exams.')
        return
      }
    }

    onSave(form)
  }, [form, globalPaymentInstructions, onSave, toast])

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

        <FormControlLabel
          control={
            <Checkbox
              checked={form.showPrice}
              onChange={(event) => updateField('showPrice', event.target.checked)}
            />
          }
          label="Display exam price to students"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={form.isUpcomingVisibleToStudents}
              onChange={(event) =>
                updateField('isUpcomingVisibleToStudents', event.target.checked)
              }
            />
          }
          label="Show this upcoming exam to all students for registration"
        />

        {isPaidExam ? (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography className="exam-form__title-sub">Payment instructions</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.useGlobalPaymentInstructions}
                  onChange={(event) =>
                    updateField('useGlobalPaymentInstructions', event.target.checked)
                  }
                />
              }
              label="Use global payment instructions"
            />
            {form.useGlobalPaymentInstructions ? (
              <Box>
                {globalPaymentInstructions ? (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                    {globalPaymentInstructions}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
                    Global payment instructions are not set. They are required for paid exams
                    using global settings.
                  </Typography>
                )}
                <Link component={RouterLink} to={ROUTES_PATH.centerPayments} variant="body2">
                  Edit global payment instructions
                </Link>
              </Box>
            ) : (
              <TextField
                label="Custom payment instructions"
                required
                value={form.customPaymentInstructions}
                onChange={(e) => updateField('customPaymentInstructions', e.target.value)}
                multiline
                minRows={4}
                fullWidth
                className="exam-form__field"
              />
            )}
          </>
        ) : null}

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
