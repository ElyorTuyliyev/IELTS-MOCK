import { Box } from '@mui/material'
import type { ExamHighlightColor } from '../constants/examHighlight'
import type { ExamHighlightToolbarPosition } from '../utils/examTextHighlight'
import { ExamHighlightToolbar } from './ExamHighlightToolbar'

type ExamHighlightFloatingToolbarProps = {
  open: boolean
  position: ExamHighlightToolbarPosition | null
  activeColor: ExamHighlightColor
  onSelectColor: (color: ExamHighlightColor) => void
  onClear: () => void
}

export function ExamHighlightFloatingToolbar({
  open,
  position,
  activeColor,
  onSelectColor,
  onClear,
}: ExamHighlightFloatingToolbarProps) {
  if (!open || !position) return null

  return (
    <Box
      className="student-exam-player__highlight-float"
      style={{
        top: position.top,
        left: position.left,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <ExamHighlightToolbar
        activeColor={activeColor}
        canClear
        onSelectColor={onSelectColor}
        onClear={onClear}
      />
    </Box>
  )
}
