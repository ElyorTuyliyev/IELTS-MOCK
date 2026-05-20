import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { buildPaymentRequestUrl, uploadPaymentProofWithToken } from '../../../helpers/paymentRequest'
import { formatPriceInSom } from '../../../utils/priceFormat'
import {
  PAYMENT_REQUEST_BY_TOKEN_QUERY,
  SUBMIT_PAYMENT_REQUEST_BY_TOKEN_MUTATION,
} from '../../../features/examPayments/api/examPaymentsQueries'

export function PaymentRequestPage() {
  const { token = '' } = useParams()
  const toast = useToast()
  const [studentNote, setStudentNote] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const proofInputRef = useRef<HTMLInputElement>(null)

  const { data, loading, error } = useQuery<{
    paymentRequestByToken: {
      paymentId: string
      examTitle: string
      studentName: string
      amount: number
      instructions: string
      usesGlobalPaymentInstructions: boolean
      status: string
      studentNote?: string
      proofImageUrl?: string
    }
  }>(PAYMENT_REQUEST_BY_TOKEN_QUERY, {
    variables: { token },
    skip: !token,
  })

  const [submitPayment] = useMutation(SUBMIT_PAYMENT_REQUEST_BY_TOKEN_MUTATION)

  const request = data?.paymentRequestByToken
  const isPending = request?.status === 'pending_approval'
  const alreadySubmitted = submitted || Boolean(request?.proofImageUrl?.trim())

  useEffect(() => {
    if (request?.studentNote) {
      setStudentNote(request.studentNote)
    }
  }, [request?.studentNote])

  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview)
    }
  }, [proofPreview])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setProofFile(file)
    setProofPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!token.trim()) {
      toast.error('Invalid payment link.')
      return
    }
    if (!request?.instructions?.trim()) {
      toast.error('Payment instructions are not available. Contact your center.')
      return
    }

    setSubmitting(true)
    try {
      let proofImageUrl: string | undefined
      if (proofFile) {
        proofImageUrl = await uploadPaymentProofWithToken(proofFile, token)
      }

      const result = await submitPayment({
        variables: {
          input: {
            token,
            studentNote: studentNote.trim() || undefined,
            proofImageUrl,
          },
        },
      })

      if (result.error) {
        toast.error(result.error.message ?? 'Failed to submit payment.')
        return
      }

      setSubmitted(true)
      toast.success('Payment details submitted. Your center admin will review them.')
    } catch (err) {
      toast.error(getGraphQLErrorMessage(err, 'Failed to submit payment.'))
    } finally {
      setSubmitting(false)
    }
  }, [proofFile, request?.instructions, studentNote, submitPayment, toast, token])

  if (!token.trim()) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Invalid payment link.</Alert>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error || !request) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">
          {getGraphQLErrorMessage(error, 'This payment link is invalid or has expired.')}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Complete payment
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {request.studentName} — {request.examTitle}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Amount due: {formatPriceInSom(request.amount)}
      </Typography>

      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Payment instructions
          {request.usesGlobalPaymentInstructions ? ' (global)' : ' (custom for this exam)'}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {request.instructions?.trim() || 'No instructions provided.'}
        </Typography>
      </Box>

      {!isPending ? (
        <Alert severity="info">
          This payment request is no longer pending. Contact your center if you need help.
        </Alert>
      ) : alreadySubmitted ? (
        <Alert severity="success">
          Payment details were submitted. Your center admin will review and confirm your registration.
        </Alert>
      ) : (
        <>
          <Divider sx={{ my: 2 }} />
          <TextField
            label="Payment note for admin (optional)"
            value={studentNote}
            onChange={(e) => setStudentNote(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            placeholder="Transaction ID, payer name, or other details"
            sx={{ mb: 2 }}
          />

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
            onClick={() => proofInputRef.current?.click()}
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

          <Box sx={{ mt: 3 }}>
            <Button
              variant="primary"
              disabled={submitting}
              onClick={() => void handleSubmit()}
            >
              {submitting ? 'Submitting...' : 'Submit payment details'}
            </Button>
          </Box>
        </>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
        Link: {buildPaymentRequestUrl(`/pay/${token}`) ?? ''}
      </Typography>
    </Container>
  )
}
