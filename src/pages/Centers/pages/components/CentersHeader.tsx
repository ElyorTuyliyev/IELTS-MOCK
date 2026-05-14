import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../../components/common/Button'

import { CENTER_STATS } from '../../api/centersData'

type CentersHeaderProps = {
  canCreateCenter: boolean
  onAddCenter: () => void
}

export const CentersHeader = memo(function CentersHeader({
  canCreateCenter,
  onAddCenter,
}: CentersHeaderProps) {
  return (
    <>
      <Box className="centers-page__header">
        <Box>
          <Typography component="h1" className="centers-page__title">
            Centers
          </Typography>
          <Typography component="p" className="centers-page__description">
            Track student flow, teacher workload, and operational status across
            all branches from a single dashboard.
          </Typography>
        </Box>

        <Button
          className="centers-page__cta"
          variant="primary"
          disabled={!canCreateCenter}
          onClick={onAddCenter}
        >
          + Add New Center
        </Button>
      </Box>

      <Box className="centers-page__stats">
        {CENTER_STATS.map((item) => (
          <Box key={item.label} className="centers-stat">
            <Typography component="span" className="centers-stat__label">
              {item.label}
            </Typography>
            <Typography component="p" className="centers-stat__value">
              {item.value}
            </Typography>
            <Typography component="p" className="centers-stat__meta">
              {item.meta}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )
})
