import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { Box, Typography } from '@mui/material'

import { Button } from '../../../components/common/Button'
import type { ExamPlan } from '../../Billing/api/billingQueries'

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
      {featured ? <span className="buy-plan-pricing-card__badge">Best value</span> : null}
      <Box className="buy-plan-pricing-card__visual" sx={{ background: gradient }}>
        <Typography component="h3" className="buy-plan-pricing-card__name">
          {plan.name}
        </Typography>
        <Typography className="buy-plan-pricing-card__exams">
          {plan.examCount} mock exam{plan.examCount === 1 ? '' : 's'} included
        </Typography>
      </Box>
      <Box className="buy-plan-pricing-card__body">
        <Box className="buy-plan-pricing-card__price-row">
          <span className="buy-plan-pricing-card__currency">$</span>
          <Typography component="p" className="buy-plan-pricing-card__price">
            {plan.price.toFixed(2)}
          </Typography>
        </Box>
        <Typography className="buy-plan-pricing-card__per-exam">
          ≈ ${perExam.toFixed(2)} per exam
        </Typography>
        <ul className="buy-plan-pricing-card__features">
          <li className="buy-plan-pricing-card__feature">
            <CheckCircleOutlineOutlinedIcon />
            Instant credit after admin approval
          </li>
          <li className="buy-plan-pricing-card__feature">
            <CheckCircleOutlineOutlinedIcon />
            Use credits to schedule center exams
          </li>
          <li className="buy-plan-pricing-card__feature">
            <CheckCircleOutlineOutlinedIcon />
            Secure manual payment flow
          </li>
        </ul>
        <Button
          variant={featured ? 'primary' : 'secondary'}
          className="buy-plan-pricing-card__action"
          onClick={onSelect}
        >
          Choose {plan.name}
        </Button>
      </Box>
    </Box>
  )
}
