import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { Button } from '../../../components/common/Button'
import { useToast } from '../../../components/common/Toast'
import { getGraphQLErrorMessage } from '../../../helpers/graphql'
import { PurchaseHistorySection } from '../../Billing/components/PurchaseHistorySection'
import {
  CREATE_EXAM_PLAN_MUTATION,
  FIND_ALL_EXAM_PLANS_QUERY,
  REMOVE_EXAM_PLAN_MUTATION,
  UPDATE_EXAM_PLAN_MUTATION,
  type ExamPlan,
} from '../../Billing/api/billingQueries'

type PlanFormState = {
  name: string
  examCount: string
  price: string
  paymentInstructions: string
  isActive: boolean
}

const emptyForm = (): PlanFormState => ({
  name: '',
  examCount: '',
  price: '',
  paymentInstructions: '',
  isActive: true,
})

export function ExamPlansPage() {
  const toast = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PlanFormState>(emptyForm)

  const { data, refetch } = useQuery<{ findAllExamPlans: ExamPlan[] }>(
    FIND_ALL_EXAM_PLANS_QUERY,
    { variables: { activeOnly: false } },
  )

  const [createPlan, { loading: creating }] = useMutation(CREATE_EXAM_PLAN_MUTATION)
  const [updatePlan, { loading: updating }] = useMutation(UPDATE_EXAM_PLAN_MUTATION)
  const [removePlan] = useMutation(REMOVE_EXAM_PLAN_MUTATION)

  const plans = data?.findAllExamPlans ?? []

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

  const handleDelete = async (id: string) => {
    try {
      await removePlan({ variables: { _id: id } })
      toast.success('Plan removed.')
      await refetch()
    } catch (error) {
      toast.error(getGraphQLErrorMessage(error, 'Something went wrong.'))
    }
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Exam Plans
          </Typography>
          <Button variant="primary" onClick={openCreate}>
            + New Plan
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {plans.map((plan) => (
            <Box
              key={plan._id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {plan.name} {!plan.isActive ? '(inactive)' : ''}
                </Typography>
                <Typography color="text.secondary">
                  {plan.examCount} exams · ${plan.price.toFixed(2)}
                </Typography>
                <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }} variant="body2">
                  {plan.paymentInstructions}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-start' }}>
                <Button variant="secondary" onClick={() => openEdit(plan)}>
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => handleDelete(plan._id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <PurchaseHistorySection pageParam="historyPage" />

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
          <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              label="Plan name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Exam count"
              type="number"
              value={form.examCount}
              onChange={(e) => setForm((f) => ({ ...f, examCount: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Price (USD)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Payment instructions"
              value={form.paymentInstructions}
              onChange={(e) => setForm((f) => ({ ...f, paymentInstructions: e.target.value }))}
              fullWidth
              multiline
              minRows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={creating || updating}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  )
}
