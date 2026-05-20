import { memo } from 'react'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { Box, Typography } from '@mui/material'

import { Button } from '../../../../components/common/Button'
import type { CenterStatItem } from '../../hooks/useCentersStats'

const STAT_ICONS = {
  total: StorefrontOutlinedIcon,
  credits: ConfirmationNumberOutlinedIcon,
  active: HowToRegOutlinedIcon,
  managers: GroupsOutlinedIcon,
} as const

type CentersHeaderProps = {
  canCreateCenter: boolean
  centerCount: number
  stats: CenterStatItem[]
  onAddCenter: () => void
}

export const CentersHeader = memo(function CentersHeader({
  canCreateCenter,
  centerCount,
  stats,
  onAddCenter,
}: CentersHeaderProps) {
  const subtitle =
    centerCount === 0
      ? 'Create your first center to start managing exams, students, and branch operations.'
      : `Managing ${centerCount} center${centerCount === 1 ? '' : 's'} — view branches, credits, and contact details in one place.`

  return (
    <>
      <Box className="centers-page__hero">
        <Box className="centers-page__hero-main">
          <Box className="centers-page__hero-icon" aria-hidden="true">
            <BusinessOutlinedIcon />
          </Box>
          <Box>
            <Typography component="h1" className="centers-page__title">
              Centers
            </Typography>
            <Typography component="p" className="centers-page__subtitle">
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Button
          className="centers-page__cta"
          variant="primary"
          disabled={!canCreateCenter}
          onClick={onAddCenter}
        >
          Add center
        </Button>
      </Box>

      <Box className="centers-page__stats">
        {stats.map((item) => {
          const Icon = STAT_ICONS[item.key as keyof typeof STAT_ICONS] ?? StorefrontOutlinedIcon

          return (
            <Box
              key={item.key}
              className={`centers-page__stat centers-page__stat--${item.tone}`}
            >
              <span className="centers-page__stat-icon" aria-hidden="true">
                <Icon />
              </span>
              <Typography component="p" className="centers-page__stat-label">
                {item.label}
              </Typography>
              <Typography component="p" className="centers-page__stat-value">
                {item.value}
              </Typography>
              <Typography component="p" className="centers-page__stat-meta">
                {item.meta}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </>
  )
})
