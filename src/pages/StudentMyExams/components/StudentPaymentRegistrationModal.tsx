import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
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
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { isSafeAuthToken } from '../../../helpers/authToken'
import { uploadFileWithAuth } from '../../../helpers/uploadFile'
import { useAppSelector } from '../../../store/hooks'
import { selectAuthToken } from '../../../store'
import { formatPriceInSom } from '../../../utils/priceFormat'
import {
  EXAM_PAYMENT_INSTRUCTIONS_QUERY,
  SUBMIT_EXAM_REGISTRATION_PAYMENT_MUTATION,
} from '../../../features/examPayments/api/examPaymentsQueries'

type StudentPaymentRegistrationModalProps = {
  open: boolean
  examId: string
  examTitle: string
  onClose: () => void
  onSubmitted: () => void | Promise<void>
}

export function StudentPaymentRegistrationModal({
  open,
  examId,
  examTitle,
  onClose,
  onSubmitted,
}: StudentPaymentRegistrationModalProps) {
  const toast = useToast()
  const token = useAppSelector(selectAuthToken)
  const [studentNote, setStudentNote] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const proofInputRef = useRef<HTMLInputElement>(null)

  const { data, loading } = useQuery<{
    examPaymentInstructions: {
      instructions: string
      usesGlobalPaymentInstructions: boolean
      requiresPayment: boolean
      amount: number
    }
  }>(EXAM_PAYMENT_INSTRUCTIONS_QUERY, {
    variables: { examId },
    skip: !open || !examId,
  })

  const [submitPayment] = useMutation(SUBMIT_EXAM_REGISTRATION_PAYMENT_MUTATION)

  useEffect(() => {
    if (!open) {
      setStudentNote('')
      setProofFile(null)
      setProofPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      if (proofInputRef.current) {
        proofInputRef.current.value = ''
      }
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview)
    }
  }, [proofPreview])

  const instructions = data?.examPaymentInstructions
  const usesGlobal = Boolean(instructions?.usesGlobalPaymentInstructions)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setProofFile(file)
    setProofPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }, [])

  const handleChooseProofFile = useCallback(() => {
    proofInputRef.current?.click()
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!instructions?.instructions?.trim()) {
      toast.error('Payment instructions are not available. Contact your center.')
      return
    }

    if (proofFile && !isSafeAuthToken(token)) {
      toast.error('Please sign in again to upload your payment screenshot.')
      return
    }

    setSubmitting(true)
    try {
      let proofImageUrl: string | undefined
      if (proofFile && isSafeAuthToken(token)) {
        proofImageUrl = await uploadFileWithAuth(proofFile, token)
        if (!proofImageUrl?.trim()) {
          throw new Error('Payment screenshot upload failed. Please try again.')
        }
      }

      const result = await submitPayment({
        variables: {
          input: {
            examId,
            studentNote: studentNote.trim() || undefined,
            proofImageUrl,
          },
        },
      })

      if (result.error) {
        toast.error(result.error.message ?? 'Failed to submit payment.')
        return
      }

      toast.success('Payment submitted. Your center admin will review your registration.')
      await onSubmitted()
      onClose()
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err, 'Failed to submit payment.'))
    } finally {
      setSubmitting(false)
    }
  }, [
    examId,
    instructions?.instructions,
    onClose,
    onSubmitted,
    proofFile,
    studentNote,
    submitPayment,
    toast,
    token,
  ])

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Register for {examTitle}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Amount due: {formatPriceInSom(instructions?.amount ?? 0)}
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Payment instructions
            {usesGlobal ? ' (global)' : ' (custom for this exam)'}
          </Typography>
          {loading ? (
            <Typography variant="body2">Loading instructions...</Typography>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {instructions?.instructions?.trim() || 'No instructions provided.'}
            </Typography>
          )}
        </Box>

        <Divider />

        <TextField
          label="Payment note for admin (optional)"
          value={studentNote}
          onChange={(e) => setStudentNote(e.target.value)}
          multiline
          minRows={2}
          fullWidth
          placeholder="Transaction ID, payer name, or other details"
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Upload payment screenshot (optional)
          </Typography>
          <input
            ref={proofInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="secondary"
            disabled={submitting}
            onClick={handleChooseProofFile}
          >
            {proofFile ? 'Change file' : 'Choose file'}
          </Button>
          {proofPreview ? (
            <Box
              component="img"
              src={proofPreview}
              alt="Payment proof preview"
              sx={{ display: 'block', mt: 1, maxWidth: '100%', borderRadius: 2 }}
            />
          ) : null}
          {proofFile && !proofPreview ? (
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
              Selected: {proofFile.name}
            </Typography>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" disabled={submitting} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" disabled={submitting || loading} onClick={() => void handleSubmit()}>
          {submitting ? 'Submitting...' : 'I have made a payment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
