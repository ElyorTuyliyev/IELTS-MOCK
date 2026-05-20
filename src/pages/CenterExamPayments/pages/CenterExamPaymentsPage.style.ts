import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const CenterExamPaymentsPageRoot = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  '& .center-payments-page__title': {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
  '& .center-payments-page__subtitle': {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  '& .center-payments-page__settings-card, & .center-payments-page__table-card': {
    padding: theme.spacing(3),
    borderRadius: 16,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    display: 'grid',
    gap: theme.spacing(2),
  },
  '& .center-payments-page__card-title': {
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  '& .center-payments-page__card-sub': {
    color: theme.palette.text.secondary,
    marginTop: -theme.spacing(1),
  },
}))
