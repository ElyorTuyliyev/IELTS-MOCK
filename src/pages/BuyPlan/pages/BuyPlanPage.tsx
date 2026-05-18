import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import { Box, CircularProgress, TextField, Typography } from '@mui/material'

import { c } from '@/theme'
import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { CurrentOrLastPlanCard } from '../../Billing/components/CurrentOrLastPlanCard'
import { PurchaseHistorySection } from '../../Billing/components/PurchaseHistorySection'
import {
  FIND_ALL_EXAM_PLANS_QUERY,
  SUBMIT_PLAN_PURCHASE_MUTATION,
  type ExamPlan,
} from '../../Billing/api/billingQueries'
import { PlanPricingCard } from '../components/PlanPricingCard'
import { BuyPlanPageRoot } from './BuyPlanPage.style'

function pickFeaturedPlanIndex(plans: ExamPlan[]) {
  if (plans.length <= 1) return plans.length === 1 ? 0 : -1

  let bestIdx = 0
  let bestRatio = plans[0].examCount / Math.max(plans[0].price, 1)

  for (let i = 1; i < plans.length; i++) {
    const ratio = plans[i].examCount / Math.max(plans[i].price, 1)
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestIdx = i
    }
  }

  return bestIdx
}

export function BuyPlanPage() {
  const toast = useToast()
  const [selectedPlan, setSelectedPlan] = useState<ExamPlan | null>(null)
  const [centerNote, setCenterNote] = useState('')

  const { data, loading, refetch: refetchPlans } = useQuery<{ findAllExamPlans: ExamPlan[] }>(
    FIND_ALL_EXAM_PLANS_QUERY,
    { variables: { activeOnly: true } },
  )

  const [submitPurchase, { loading: submitting }] = useMutation(SUBMIT_PLAN_PURCHASE_MUTATION, {
    refetchQueries: ['PurchaseHistory', 'MeCenterPlanSummary'],
  })

  const plans = data?.findAllExamPlans ?? []
  const featuredIndex = useMemo(() => pickFeaturedPlanIndex(plans), [plans])
  const gradientPalette = useMemo(() => [...c.gradient.examCard], [])

  const handleSubmitPaid = async () => {
    if (!selectedPlan) return
    try {
      await submitPurchase({
        variables: {
          input: {
            planId: selectedPlan._id,
            centerNote: centerNote.trim() || undefined,
          },
        },
      })
      toast.success('Payment request submitted. An admin will review it shortly.')
      setSelectedPlan(null)
      setCenterNote('')
      await refetchPlans()
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, 'Could not submit purchase request.'))
    }
  }

  return (
    <Layout>
      <BuyPlanPageRoot>
        <Box className="buy-plan-page">
          <Box className="buy-plan-page__hero">
            <Box className="buy-plan-page__hero-icon" aria-hidden>
              <CreditCardOutlinedIcon />
            </Box>
            <Box>
              <Typography component="h1" className="buy-plan-page__title">
                Buy exam plan
              </Typography>
              <Typography className="buy-plan-page__subtitle">
                Choose a credit package for your center, complete payment using the instructions,
                then submit your request for admin approval.
              </Typography>
            </Box>
          </Box>

          <CurrentOrLastPlanCard />

          {!selectedPlan ? (
            <>
              <Box className="buy-plan-page__section-head">
                <Typography component="h2" className="buy-plan-page__section-title">
                  Available packages
                </Typography>
                <Typography className="buy-plan-page__section-subtitle">
                  Compare plans and select the package that fits your center.
                </Typography>
              </Box>

              {loading ? (
                <Box className="buy-plan-page__loading">
                  <CircularProgress size={32} />
                  <Typography>Loading plans…</Typography>
                </Box>
              ) : plans.length === 0 ? (
                <Box className="buy-plan-page__empty">
                  <Typography className="buy-plan-page__empty-title">
                    No plans available yet
                  </Typography>
                  <Typography>
                    Check back later — your administrator may add packages soon.
                  </Typography>
                </Box>
              ) : (
                <Box className="buy-plan-page__plans-grid">
                  {plans.map((plan, index) => (
                    <PlanPricingCard
                      key={plan._id}
                      plan={plan}
                      gradient={gradientPalette[index % gradientPalette.length]}
                      featured={index === featuredIndex}
                      onSelect={() => setSelectedPlan(plan)}
                    />
                  ))}
                </Box>
              )}
            </>
          ) : (
            <Box className="buy-plan-page__checkout">
              <Box className="buy-plan-page__checkout-header">
                <Typography className="buy-plan-page__checkout-kicker">Checkout</Typography>
                <Typography component="h2" className="buy-plan-page__checkout-title">
                  {selectedPlan.name}
                </Typography>
                <Typography className="buy-plan-page__checkout-summary">
                  ${selectedPlan.price.toFixed(2)} · {selectedPlan.examCount} exam credits
                </Typography>
              </Box>

              <Box className="buy-plan-page__checkout-body">
                <Box className="buy-plan-page__steps">
                  <span className="buy-plan-page__step buy-plan-page__step--active">
                    <span className="buy-plan-page__step-num">1</span>
                    Plan selected
                  </span>
                  <span className="buy-plan-page__step buy-plan-page__step--active">
                    <span className="buy-plan-page__step-num">2</span>
                    Complete payment
                  </span>
                  <span className="buy-plan-page__step">
                    <span className="buy-plan-page__step-num">3</span>
                    Submit for approval
                  </span>
                </Box>

                <Box className="buy-plan-page__instructions">
                  <Typography className="buy-plan-page__instructions-title">
                    Payment instructions
                  </Typography>
                  <Typography className="buy-plan-page__instructions-text">
                    {selectedPlan.paymentInstructions}
                  </Typography>
                </Box>

                <TextField
                  className="buy-plan-page__note-field"
                  label="Payment reference / note (optional)"
                  value={centerNote}
                  onChange={(e) => setCenterNote(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="e.g. bank transfer reference, date paid"
                />

                <Box className="buy-plan-page__checkout-actions">
                  <Button variant="primary" onClick={handleSubmitPaid} disabled={submitting} loading={submitting}>
                    I have completed payment
                  </Button>
                  <Button variant="secondary" onClick={() => setSelectedPlan(null)}>
                    Back to plans
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <Box className="buy-plan-page__history">
            <hr className="buy-plan-page__history-divider" />
            <PurchaseHistorySection pageParam="historyPage" showAdminHint={false} />
          </Box>
        </Box>
      </BuyPlanPageRoot>
    </Layout>
  )
}
