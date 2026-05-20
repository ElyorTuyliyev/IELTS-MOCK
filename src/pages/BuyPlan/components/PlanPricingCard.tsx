import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Typography } from '@mui/material'

import { Button } from '../../../components/common/Button'
import { formatUsd } from '../../../helpers/formatCurrency'
import type { ExamPlan } from '../../Billing/api/billingQueries'

const PLAN_FEATURES = [
  'Instant credit after admin approval',
  'Use credits to schedule center exams',
  'Secure manual payment flow',
] as const

type PlanPricingCardProps = {
  plan: ExamPlan
  gradient: string
  featured?: boolean
  onSelect: () => void
}

export function PlanPricingCard({ plan, gradient, featured, onSelect }: PlanPricingCardProps) {
  const perExam = plan.examCount > 0 ? plan.price / plan.examCount : plan.price

  return (
    <Box
      className={`buy-plan-pricing-card${featured ? ' buy-plan-pricing-card--featured' : ''}`}
    >
      <Box className="buy-plan-pricing-card__visual" sx={{ background: gradient }}>
        {featured ? <span className="buy-plan-pricing-card__badge">Best value</span> : null}
        <Typography component="h3" className="buy-plan-pricing-card__name">
          {plan.name}
        </Typography>
        <Typography className="buy-plan-pricing-card__exams">
          {plan.examCount} mock exam{plan.examCount === 1 ? '' : 's'} included
        </Typography>
      </Box>
      <Box className="buy-plan-pricing-card__body">
        <Box className="buy-plan-pricing-card__price-row">
          <Typography component="p" className="buy-plan-pricing-card__price">
            $ {formatUsd(plan.price)}
          </Typography>
        </Box>
        <Typography className="buy-plan-pricing-card__per-exam">
          ≈ ${formatUsd(perExam)} per exam
        </Typography>
        <ul className="buy-plan-pricing-card__features">
          {PLAN_FEATURES.map((label) => (
            <li key={label} className="buy-plan-pricing-card__feature">
              <span className="buy-plan-pricing-card__feature-icon" aria-hidden="true">
                <CheckRoundedIcon />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <Button
          variant={featured ? 'primary' : 'secondary'}
          className={[
            'buy-plan-pricing-card__action',
            featured ? 'buy-plan-pricing-card__action--featured' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={onSelect}
        >
          Choose {plan.name}
        </Button>
      </Box>
    </Box>
  )
}
