import { useCallback, useId, useState } from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { IconButton, Popover, Tooltip, Typography } from '@mui/material'

import {
  formatBandScore,
  getCategoryDescriptor,
} from '@/config/ielts'
import type { IeltsModuleDescriptorConfig } from '@/types/ieltsEvaluation'

type CriteriaTooltipProps = {
  config: IeltsModuleDescriptorConfig
  categoryKey: string
  categoryLabel: string
  selectedScore: number | null
}

export function CriteriaTooltip({
  config,
  categoryKey,
  categoryLabel,
  selectedScore,
}: CriteriaTooltipProps) {
  const buttonId = useId()
  const popoverId = useId()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const descriptorText = getCategoryDescriptor(config, categoryKey, selectedScore)
  const title =
    selectedScore == null
      ? `${categoryLabel} — band descriptor`
      : `${categoryLabel} — Band ${formatBandScore(selectedScore)}`

  const openPopover = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const closePopover = useCallback(() => {
    setAnchorEl(null)
  }, [])

  return (
    <>
      <Tooltip
        title={
          <Typography component="span" sx={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {descriptorText}
          </Typography>
        }
        placement="top"
        enterTouchDelay={0}
        slotProps={{
          tooltip: {
            sx: { maxWidth: 360 },
          },
        }}
      >
        <IconButton
          id={buttonId}
          size="small"
          aria-label={`View ${categoryLabel} band descriptor`}
          aria-describedby={anchorEl ? popoverId : undefined}
          onClick={openPopover}
          sx={{ color: 'text.secondary' }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        id={popoverId}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', maxWidth: 380 },
          },
        }}
      >
        <div className="ielts-eval__descriptor-popover">
          <div className="ielts-eval__descriptor-title">{title}</div>
          {descriptorText}
        </div>
      </Popover>
    </>
  )
}
