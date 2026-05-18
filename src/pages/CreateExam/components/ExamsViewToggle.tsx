import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined'
import { Box, IconButton } from '@mui/material'

export type ExamsViewMode = 'card' | 'table'

type ExamsViewToggleProps = {
  value: ExamsViewMode
  onChange: (mode: ExamsViewMode) => void
}

export function ExamsViewToggle({ value, onChange }: ExamsViewToggleProps) {
  return (
    <Box className="content__view-toggle" role="group" aria-label="Exam display view">
      <IconButton
        type="button"
        className={`content__view-toggle-btn${value === 'card' ? ' content__view-toggle-btn--active' : ''}`}
        aria-label="Card view"
        aria-pressed={value === 'card'}
        onClick={() => onChange('card')}
      >
        <ViewModuleOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton
        type="button"
        className={`content__view-toggle-btn${value === 'table' ? ' content__view-toggle-btn--active' : ''}`}
        aria-label="Table view"
        aria-pressed={value === 'table'}
        onClick={() => onChange('table')}
      >
        <TableRowsOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
