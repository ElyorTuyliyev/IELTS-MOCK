import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client/react'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { Box, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog'
import { SearchField } from '../../../components/common/SearchField'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { c } from '../../../theme'
import { ROUTES_PATH } from '../../../routes/paths'
import { PurchaseHistorySection } from '../../Billing/components/PurchaseHistorySection'
import {
  CREATE_EXAM_PLAN_MUTATION,
  FIND_ALL_EXAM_PLANS_QUERY,
  REMOVE_EXAM_PLAN_MUTATION,
  UPDATE_EXAM_PLAN_MUTATION,
  type ExamPlan,
} from '../../Billing/api/billingQueries'
import { PlanCatalogItem } from '../components/PlanCatalogItem'
import {
  ExamPlanFormDialog,
  type PlanFormState,
} from '../components/ExamPlanFormDialog'
import { ExamPlansPageRoot } from './ExamPlansPage.style'

type TabKey = 'plans' | 'history'
type PlanFilter = 'all' | 'active' | 'inactive'

const emptyForm = (): PlanFormState => ({
  name: '',
  examCount: '',
  price: '',
  paymentInstructions: '',
  isActive: true,
})

function filterPlans(plans: ExamPlan[], query: string, filter: PlanFilter) {
  const q = query.trim().toLowerCase()
  return plans.filter((plan) => {
    if (filter === 'active' && !plan.isActive) return false
    if (filter === 'inactive' && plan.isActive) return false
    if (!q) return true
    return (
      plan.name.toLowerCase().includes(q) ||
      plan.paymentInstructions.toLowerCase().includes(q)
    )
  })
}

export function ExamPlansPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<TabKey>('plans')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PlanFormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<ExamPlan | null>(null)

  const { data, loading, refetch } = useQuery<{ findAllExamPlans: ExamPlan[] }>(
    FIND_ALL_EXAM_PLANS_QUERY,
    { variables: { activeOnly: false } },
  )

  const [createPlan, { loading: creating }] = useMutation(CREATE_EXAM_PLAN_MUTATION)
  const [updatePlan, { loading: updating }] = useMutation(UPDATE_EXAM_PLAN_MUTATION)
  const [removePlan, { loading: removing }] = useMutation(REMOVE_EXAM_PLAN_MUTATION)

  const plans = data?.findAllExamPlans ?? []
  const gradientPalette = useMemo(() => [...c.gradient.examCard], [])

  const stats = useMemo(() => {
    const active = plans.filter((plan) => plan.isActive).length
    const totalCredits = plans.reduce((sum, plan) => sum + plan.examCount, 0)
    return {
      total: plans.length,
      active,
      inactive: plans.length - active,
      totalCredits,
    }
  }, [plans])

  const filteredPlans = useMemo(
    () => filterPlans(plans, search, planFilter),
    [plans, search, planFilter],
  )

  const featuredPlanId = useMemo(() => {
    const activePlans = plans.filter((plan) => plan.isActive)
    if (activePlans.length === 0) return null

    let best = activePlans[0]
    let bestRatio = best.examCount / Math.max(best.price, 1)

    for (const plan of activePlans) {
      const ratio = plan.examCount / Math.max(plan.price, 1)
      if (ratio > bestRatio) {
        bestRatio = ratio
        best = plan
      }
    }

    return best._id
  }, [plans])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm())
    setDialogOpen(true)
  }

  const openEdit = (plan: ExamPlan) => {
    setEditingId(plan._id)
    setForm({
      name: plan.name,
      examCount: String(plan.examCount),
      price: String(plan.price),
      paymentInstructions: plan.paymentInstructions,
      isActive: plan.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    const examCount = Number(form.examCount)
    const price = Number(form.price)
    if (!form.name.trim() || !Number.isFinite(examCount) || examCount < 1 || !Number.isFinite(price)) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      if (editingId) {
        await updatePlan({
          variables: {
            input: {
              _id: editingId,
              name: form.name.trim(),
              examCount,
              price,
              paymentInstructions: form.paymentInstructions.trim(),
              isActive: form.isActive,
            },
          },
        })
        toast.success('Plan updated.')
      } else {
        await createPlan({
          variables: {
            input: {
              name: form.name.trim(),
              examCount,
              price,
              paymentInstructions: form.paymentInstructions.trim(),
              isActive: form.isActive,
            },
          },
        })
        toast.success('Plan created.')
      }
      setDialogOpen(false)
      await refetch()
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, 'Something went wrong.'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await removePlan({ variables: { _id: deleteTarget._id } })
      toast.success('Plan removed.')
      setDeleteTarget(null)
      await refetch()
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, 'Something went wrong.'))
    }
  }

  const saving = creating || updating
  const isPlansTab = tab === 'plans'

  return (
    <Layout>
      <ExamPlansPageRoot>
        <Box className="exam-plans-page" sx={{ p: { xs: 2, md: 3 } }}>
          <Box className="exam-plans-page__hero">
            <Box className="exam-plans-page__hero-main">
              <Box className="exam-plans-page__hero-icon" aria-hidden="true">
                <Inventory2OutlinedIcon />
              </Box>
              <Box>
                <Typography component="h1" className="exam-plans-page__title">
                  Exam Plans
                </Typography>
                <Typography component="p" className="exam-plans-page__subtitle">
                  Create pricing packages, set payment instructions, and review purchase history
                  from centers.
                </Typography>
              </Box>
            </Box>
            <Box className="exam-plans-page__actions">
              <Button variant="secondary" onClick={() => navigate(ROUTES_PATH.payments)}>
                Billing overview
              </Button>
              <Button variant="primary" onClick={openCreate}>
                New plan
              </Button>
            </Box>
          </Box>

          <Box className="exam-plans-page__stats">
            <Box className="exam-plans-page__stat exam-plans-page__stat--total">
              <span className="exam-plans-page__stat-icon" aria-hidden="true">
                <AssignmentOutlinedIcon />
              </span>
              <Typography component="p" className="exam-plans-page__stat-label">
                Total plans
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-value">
                {stats.total}
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-meta">
                All catalog entries
              </Typography>
            </Box>
            <Box className="exam-plans-page__stat exam-plans-page__stat--active">
              <span className="exam-plans-page__stat-icon" aria-hidden="true">
                <CheckCircleOutlineOutlinedIcon />
              </span>
              <Typography component="p" className="exam-plans-page__stat-label">
                Active
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-value">
                {stats.active}
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-meta">
                Visible to centers
              </Typography>
            </Box>
            <Box className="exam-plans-page__stat exam-plans-page__stat--inactive">
              <span className="exam-plans-page__stat-icon" aria-hidden="true">
                <Inventory2OutlinedIcon />
              </span>
              <Typography component="p" className="exam-plans-page__stat-label">
                Inactive
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-value">
                {stats.inactive}
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-meta">
                Hidden from buy flow
              </Typography>
            </Box>
            <Box className="exam-plans-page__stat exam-plans-page__stat--credits">
              <span className="exam-plans-page__stat-icon" aria-hidden="true">
                <ConfirmationNumberOutlinedIcon />
              </span>
              <Typography component="p" className="exam-plans-page__stat-label">
                Credits offered
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-value">
                {stats.totalCredits}
              </Typography>
              <Typography component="p" className="exam-plans-page__stat-meta">
                Combined exam credits across plans
              </Typography>
            </Box>
          </Box>

          <Box className="exam-plans-page__panel">
            <Box className="exam-plans-page__panel-bar">
              <Box className="exam-plans-page__tabs" role="tablist" aria-label="Exam plans views">
                <Box className="exam-plans-page__tabs-track">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isPlansTab}
                    className={
                      isPlansTab
                        ? 'exam-plans-page__tab exam-plans-page__tab--active'
                        : 'exam-plans-page__tab'
                    }
                    onClick={() => setTab('plans')}
                  >
                    <span className="exam-plans-page__tab-icon" aria-hidden="true">
                      <Inventory2OutlinedIcon />
                    </span>
                    <span className="exam-plans-page__tab-label">Plan catalog</span>
                    <span className="exam-plans-page__tab-badge">{plans.length}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isPlansTab}
                    className={
                      !isPlansTab
                        ? 'exam-plans-page__tab exam-plans-page__tab--active'
                        : 'exam-plans-page__tab'
                    }
                    onClick={() => setTab('history')}
                  >
                    <span className="exam-plans-page__tab-icon" aria-hidden="true">
                      <HistoryOutlinedIcon />
                    </span>
                    <span className="exam-plans-page__tab-label">Purchase history</span>
                  </button>
                </Box>
              </Box>

              <Box className="exam-plans-page__panel-head">
                <Typography component="h2" className="exam-plans-page__panel-title">
                  {isPlansTab ? 'Plan catalog' : 'Purchase history'}
                </Typography>
                <Typography component="p" className="exam-plans-page__panel-desc">
                  {isPlansTab
                    ? 'Compare plans and preview exactly what centers see on the buy page.'
                    : 'All plan requests and payment records across centers. Pending items can be reviewed here or from Billing overview.'}
                </Typography>
              </Box>
            </Box>

            {isPlansTab ? (
              <>
                <Box className="exam-plans-page__toolbar">
                  <SearchField
                    className="exam-plans-page__search"
                    aria-label="Search plans"
                    placeholder="Search plan name or instructions…"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <Box
                    className="exam-plans-page__filter-chips"
                    role="group"
                    aria-label="Filter plans"
                  >
                    <Box className="exam-plans-page__filter-track">
                      {(
                        [
                          { value: 'all', label: 'All' },
                          { value: 'active', label: 'Active' },
                          { value: 'inactive', label: 'Inactive' },
                        ] as const
                      ).map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          className={
                            planFilter === item.value
                              ? 'exam-plans-page__filter-chip exam-plans-page__filter-chip--active'
                              : 'exam-plans-page__filter-chip'
                          }
                          onClick={() => setPlanFilter(item.value)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {!loading && filteredPlans.length > 0 ? (
                  <Typography className="exam-plans-page__catalog-meta">
                    Showing {filteredPlans.length} of {plans.length} plan
                    {plans.length === 1 ? '' : 's'}
                  </Typography>
                ) : null}

                <Box className="exam-plans-page__catalog-list">
                  {loading ? (
                    <Box className="exam-plans-page__empty">
                      <Typography className="exam-plans-page__empty-title">Loading plans…</Typography>
                    </Box>
                  ) : filteredPlans.length === 0 ? (
                    <Box className="exam-plans-page__empty">
                      <Typography className="exam-plans-page__empty-title">
                        {plans.length === 0 ? 'No exam plans yet' : 'No plans match your filters'}
                      </Typography>
                      <Typography className="exam-plans-page__empty-desc">
                        {plans.length === 0
                          ? 'Create your first plan so centers can purchase exam credits.'
                          : 'Try a different search or filter.'}
                      </Typography>
                      {plans.length === 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Button variant="primary" onClick={openCreate}>
                            Create first plan
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                  ) : (
                    filteredPlans.map((plan, index) => (
                      <PlanCatalogItem
                        key={plan._id}
                        plan={plan}
                        gradient={gradientPalette[index % gradientPalette.length]}
                        featured={plan._id === featuredPlanId}
                        onEdit={() => openEdit(plan)}
                        onDelete={() => setDeleteTarget(plan)}
                      />
                    ))
                  )}
                </Box>
              </>
            ) : (
              <>
                <Box className="exam-plans-page__history">
                  <PurchaseHistorySection
                    pageParam="historyPage"
                    showTitle={false}
                    embedded
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </ExamPlansPageRoot>

      <ExamPlanFormDialog
        open={dialogOpen}
        editing={Boolean(editingId)}
        form={form}
        loading={saving}
        onClose={() => setDialogOpen(false)}
        onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete exam plan?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be removed permanently. Centers will no longer see this plan.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
        loading={removing}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  )
}
