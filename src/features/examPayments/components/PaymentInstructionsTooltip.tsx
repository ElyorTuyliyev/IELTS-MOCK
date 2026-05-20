import type { ReactElement } from 'react'
import { useQuery } from '@apollo/client/react'
import { Box, Link, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES_PATH } from '../../../routes/paths'
import { EXAM_PAYMENT_INSTRUCTIONS_QUERY } from '../api/examPaymentsQueries'

type PaymentInstructionsTooltipProps = {
  examId: string
  children: ReactElement
}

export function PaymentInstructionsTooltip({ examId, children }: PaymentInstructionsTooltipProps) {
  const { data, loading } = useQuery<{
    examPaymentInstructions: {
      instructions: string
      usesGlobalPaymentInstructions: boolean
      requiresPayment: boolean
    }
  }>(EXAM_PAYMENT_INSTRUCTIONS_QUERY, {
    variables: { examId },
    skip: !examId,
  })

  const instructions = data?.examPaymentInstructions?.instructions?.trim() ?? ''
  const usesGlobal = Boolean(data?.examPaymentInstructions?.usesGlobalPaymentInstructions)
  const requiresPayment = Boolean(data?.examPaymentInstructions?.requiresPayment)

  if (!requiresPayment) {
    return children
  }

  const title = (
    <Box sx={{ maxWidth: 320, p: 0.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
        Payment instructions
      </Typography>
      {loading ? (
        <Typography variant="body2">Loading...</Typography>
      ) : instructions ? (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {instructions}
        </Typography>
      ) : (
        <Typography variant="body2" color="warning.main">
          No payment instructions configured.
        </Typography>
      )}
      {usesGlobal ? (
        <Link
          component={RouterLink}
          to={ROUTES_PATH.centerPayments}
          variant="caption"
          sx={{ display: 'inline-block', mt: 1 }}
        >
          Edit global payment instructions
        </Link>
      ) : null}
    </Box>
  )

  return (
    <Tooltip title={title} arrow placement="top">
      {children}
    </Tooltip>
  )
}
