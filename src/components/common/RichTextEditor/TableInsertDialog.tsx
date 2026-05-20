import { useCallback, useEffect, useId, useState } from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material'
import { c, tokens } from '../../../theme'
import { Button } from '../Button'

const MAX_DIM = 10
const DEFAULT_ROWS = 3
const DEFAULT_COLS = 3

/** Shared palette for grid lines and selection */
const palette = {
  line: c.border.default,
  lineStrong: c.border.strong,
  surface: c.surface.muted,
  selected: c.info.bgMuted,
  selectedBorder: c.info.light,
  selectedHover: c.info.border,
  accent: c.info.main,
  accentHover: c.info.dark,
}

export type TableInsertDialogProps = {
  open: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number) => void
}

export function TableInsertDialog({ open, onClose, onInsert }: TableInsertDialogProps) {
  const titleId = useId()
  const descId = useId()
  const [selectedRow, setSelectedRow] = useState(DEFAULT_ROWS)
  const [selectedCol, setSelectedCol] = useState(DEFAULT_COLS)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)

   
  useEffect(() => {
    if (!open) return
    // Reset picker defaults when dialog is opened again.
    setSelectedRow(DEFAULT_ROWS)
    setSelectedCol(DEFAULT_COLS)
    setHoveredRow(null)
    setHoveredCol(null)
  }, [open])
   

  const handleInsert = useCallback(() => {
    onInsert(selectedRow, selectedCol)
  }, [onInsert, selectedCol, selectedRow])

  const previewRow = hoveredRow ?? selectedRow
  const previewCol = hoveredCol ?? selectedCol

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: tokens.rgba.slate900_48,
            backdropFilter: 'blur(4px)',
          },
        },
        paper: {
          elevation: 0,
          sx: {
            borderRadius: '14px',
            maxWidth: 400,
            width: '100%',
            overflow: 'hidden',
            border: `1px solid ${tokens.rgba.slate900_08}`,
            boxShadow:
              `0 0 0 1px ${tokens.rgba.white_06} inset, ${tokens.shadows.dialogLg}`,
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2.75,
          pt: 2.25,
          pb: 2,
          position: 'relative',
          borderBottom: '1px solid',
          borderColor: tokens.rgba.slate900_06,
          bgcolor: c.surface.default,
        }}
      >
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: 'text.secondary',
            borderRadius: '10px',
            '&:hover': { bgcolor: tokens.rgba.slate900_06 },
          }}
        >
          <Typography component="span" sx={{ fontSize: '1.35rem', lineHeight: 1, fontWeight: 300 }}>
            ×
          </Typography>
        </IconButton>
        <Typography
          id={titleId}
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: '1.125rem',
            letterSpacing: '-0.02em',
            color: c.text.primary,
            pr: 5,
          }}
        >
          Insert Table
        </Typography>
        <Typography
          id={descId}
          variant="body2"
          sx={{ mt: 0.75, color: 'text.secondary', lineHeight: 1.5, maxWidth: '92%' }}
        >
          Select the number of columns and rows for your table.
        </Typography>
      </Box>

      <DialogContent
        sx={{
          pt: 2.25,
          pb: 2,
          px: 2.75,
          bgcolor: palette.surface,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <Typography
            component="span"
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
          >
            Size
          </Typography>
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 0.75,
              px: 1.75,
              py: 0.65,
              borderRadius: '999px',
              bgcolor: c.surface.default,
              border: `1px solid ${palette.line}`,
              boxShadow: tokens.shadows.sm,
            }}
          >
            <Typography component="span" sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.text.primary }}>
              {previewRow}
            </Typography>
            <Typography component="span" sx={{ fontWeight: 500, color: palette.lineStrong, fontSize: '0.95rem' }}>
              ×
            </Typography>
            <Typography component="span" sx={{ fontWeight: 800, fontSize: '1.05rem', color: c.text.primary }}>
              {previewCol}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            rows × cols
          </Typography>
        </Box>

        <Box
          component="div"
          role="grid"
          aria-label="Table size"
          onPointerLeave={() => {
            setHoveredRow(null)
            setHoveredCol(null)
          }}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MAX_DIM}, 1fr)`,
            gap: 0.375,
            width: 'fit-content',
            mx: 'auto',
            p: '10px',
            borderRadius: '12px',
            bgcolor: c.surface.default,
            border: `1px solid ${palette.line}`,
            boxShadow: tokens.shadows.md,
          }}
        >
          {Array.from({ length: MAX_DIM }, (_, ri) =>
            Array.from({ length: MAX_DIM }, (_, ci) => {
              const r = ri + 1
              const col = ci + 1
              const highlighted = r <= previewRow && col <= previewCol
              return (
                <Box
                  key={`${r}-${col}`}
                  component="button"
                  type="button"
                  aria-label={`${r} qator, ${col} ustun`}
                  onPointerEnter={() => {
                    setHoveredRow(r)
                    setHoveredCol(col)
                  }}
                  onClick={() => {
                    setSelectedRow(r)
                    setSelectedCol(col)
                  }}
                  sx={{
                    width: 20,
                    height: 20,
                    p: 0,
                    border: `1px solid ${highlighted ? palette.selectedBorder : palette.line}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    bgcolor: highlighted ? palette.selected : palette.surface,
                    boxShadow: highlighted ? `0 0 0 1px ${palette.accent} inset` : 'none',
                    transition: 'background-color 0.1s ease, border-color 0.1s ease, box-shadow 0.1s ease',
                    '&:hover': {
                      bgcolor: highlighted ? palette.selectedHover : palette.surface,
                      borderColor: highlighted ? palette.selectedBorder : palette.lineStrong,
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${palette.accent}`,
                      outlineOffset: 1,
                    },
                  }}
                />
              )
            }),
          ).flat()}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 2.75,
          py: 2,
          gap: 1,
          justifyContent: 'flex-end',
          bgcolor: c.surface.default,
          borderTop: '1px solid',
          borderColor: tokens.rgba.slate900_06,
        }}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.25,
            py: 0.85,
            borderColor: palette.lineStrong,
            color: c.text.subtle,
            '&:hover': { borderColor: c.text.disabled, bgcolor: tokens.rgba.slate900_04 },
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          disableElevation
          onClick={handleInsert}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            py: 0.85,
            bgcolor: palette.accent,
            boxShadow: 'none',
            '&:hover': { bgcolor: palette.accentHover, boxShadow: 'none' },
          }}
        >
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}
