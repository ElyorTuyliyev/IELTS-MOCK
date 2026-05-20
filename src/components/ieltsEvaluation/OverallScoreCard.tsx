import { Typography } from '@mui/material'

import { formatBandScore } from '@/config/ielts'

type OverallScoreCardProps = {
  overallBand: number | null
  label?: string
}

export function OverallScoreCard({
  overallBand,
  label = 'Overall band score',
}: OverallScoreCardProps) {
  return (
    <div className="ielts-eval__overall-card" role="status" aria-live="polite">
      <Typography className="ielts-eval__overall-label">{label}</Typography>
      <span className="ielts-eval__overall-value">
        {overallBand == null ? '—' : formatBandScore(overallBand)}
      </span>
    </div>
  )
}
