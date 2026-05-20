import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { Button } from '../../../components/common/Button'
import { formatUsd } from '../../../helpers/formatCurrency'
import type { ExamPlan } from '../../Billing/api/billingQueries'

const PLAN_FEATURES = [
  'Instant credit after admin approval',
  'Use credits to schedule center exams',
  'Secure manual payment flow',
] as const

type PlanCatalogItemProps = {
  plan: ExamPlan
  gradient: string
  featured?: boolean
  onEdit: () => void
  onDelete: () => void
}

export function PlanCatalogItem({
  plan,
  gradient,
  featured = false,
  onEdit,
  onDelete,
}: PlanCatalogItemProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const perExam = plan.examCount > 0 ? plan.price / plan.examCount : plan.price

  const cardClass = [
    'buy-plan-pricing-card',
    featured && plan.isActive ? 'buy-plan-pricing-card--featured' : '',
    !plan.isActive ? 'buy-plan-pricing-card--hidden' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const showBestValue = featured && plan.isActive

  return (
    <Box className={cardClass}>
      <Box className="buy-plan-pricing-card__visual" sx={{ background: gradient }}>
        <Box className="buy-plan-pricing-card__admin-menu">
          <IconButton
            className="buy-plan-pricing-card__menu-btn"
            size="small"
            aria-label={`More actions for ${plan.name}`}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            <MoreHorizOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        {showBestValue ? (
          <span className="buy-plan-pricing-card__badge">Best value</span>
        ) : null}
        {!plan.isActive ? (
          <span className="buy-plan-pricing-card__badge buy-plan-pricing-card__badge--hidden">
            Hidden
          </span>
        ) : null}

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
          variant={showBestValue ? 'primary' : 'secondary'}
          className={[
            'buy-plan-pricing-card__action',
            'buy-plan-pricing-card__action--preview',
            showBestValue ? 'buy-plan-pricing-card__action--featured' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled
          aria-label={`Center preview: Choose ${plan.name}`}
        >
          Choose {plan.name}
        </Button>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
              minWidth: 168,
              mt: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onEdit()
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            onDelete()
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
