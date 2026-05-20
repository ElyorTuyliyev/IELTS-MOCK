import { Box, IconButton, Tooltip } from '@mui/material'
import FormatColorFillOutlinedIcon from '@mui/icons-material/FormatColorFillOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import {
  EXAM_HIGHLIGHT_COLORS,
  EXAM_HIGHLIGHT_LABELS,
  type ExamHighlightColor,
} from '../constants/examHighlight'

type ExamHighlightToolbarProps = {
  activeColor: ExamHighlightColor
  canClear: boolean
  onSelectColor: (color: ExamHighlightColor) => void
  onClear: () => void
}

export function ExamHighlightToolbar({
  activeColor,
  canClear,
  onSelectColor,
  onClear,
}: ExamHighlightToolbarProps) {
  return (
    <Box className="student-exam-player__highlight-toolbar" role="toolbar" aria-label="Text highlights">
      <Tooltip title="Highlight selected text">
        <Box className="student-exam-player__highlight-toolbar-label" aria-hidden="true">
          <FormatColorFillOutlinedIcon fontSize="small" />
        </Box>
      </Tooltip>
      {EXAM_HIGHLIGHT_COLORS.map((color) => (
        <Tooltip key={color} title={EXAM_HIGHLIGHT_LABELS[color]}>
          <IconButton
            type="button"
            size="small"
            className={`student-exam-player__highlight-swatch student-exam-player__highlight-swatch--${color}${
              activeColor === color ? ' student-exam-player__highlight-swatch--active' : ''
            }`}
            aria-label={EXAM_HIGHLIGHT_LABELS[color]}
            aria-pressed={activeColor === color}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelectColor(color)}
          />
        </Tooltip>
      ))}
      <Tooltip title="Remove highlight from selection">
        <span>
          <IconButton
            type="button"
            size="small"
            className="student-exam-player__highlight-clear"
            aria-label="Clear highlight"
            disabled={!canClear}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClear}
          >
            <HighlightOffOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}
