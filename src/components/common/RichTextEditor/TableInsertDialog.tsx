import { useCallback, useEffect, useId, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material'

const MAX_DIM = 10
const DEFAULT_ROWS = 3
const DEFAULT_COLS = 3

/** Panjara chiziqlari va tanlov uchun bir xil palitra */
const palette = {
  line: '#e2e8f0',
  lineStrong: '#cbd5e1',
  surface: '#f8fafc',
  selected: '#dbeafe',
  selectedBorder: '#3b82f6',
  selectedHover: '#bfdbfe',
  accent: '#2563eb',
  accentHover: '#1d4ed8',
}

export type TableInsertDialogProps = {
  open: boolean
  onClose: () => void
  onInsert: (rows: number, cols: number) => void
}

export function TableInsertDialog({ open, onClose, onInsert }: TableInsertDialogProps) {
  const titleId = useId()
  const descId = useId()
  const [hoverRow, setHoverRow] = useState(DEFAULT_ROWS)
  const [hoverCol, setHoverCol] = useState(DEFAULT_COLS)

  useEffect(() => {
    if (!open) return
    setHoverRow(DEFAULT_ROWS)
    setHoverCol(DEFAULT_COLS)
  }, [open])

  const handleInsert = useCallback(() => {
    onInsert(hoverRow, hoverCol)
  }, [hoverRow, hoverCol, onInsert])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.48)',
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
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.06) inset, 0 25px 50px -12px rgba(15, 23, 42, 0.22)',
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
          borderColor: 'rgba(15, 23, 42, 0.06)',
          bgcolor: '#fff',
        }}
      >
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: 'text.secondary',
            borderRadius: '10px',
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.06)' },
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
            color: '#0f172a',
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
              bgcolor: '#fff',
              border: `1px solid ${palette.line}`,
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <Typography component="span" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              {hoverRow}
            </Typography>
            <Typography component="span" sx={{ fontWeight: 500, color: palette.lineStrong, fontSize: '0.95rem' }}>
              ×
            </Typography>
            <Typography component="span" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              {hoverCol}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            rows × cols
          </Typography>
        </Box>

        <Box
          component="div"
          role="grid"
          aria-label="Jadval o‘lchami"
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MAX_DIM}, 1fr)`,
            gap: '3px',
            width: 'fit-content',
            mx: 'auto',
            p: '10px',
            borderRadius: '12px',
            bgcolor: '#fff',
            border: `1px solid ${palette.line}`,
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
          }}
        >
          {Array.from({ length: MAX_DIM }, (_, ri) =>
            Array.from({ length: MAX_DIM }, (_, ci) => {
              const r = ri + 1
              const c = ci + 1
              const selected = r <= hoverRow && c <= hoverCol
              return (
                <Box
                  key={`${r}-${c}`}
                  component="button"
                  type="button"
                  aria-label={`${r} qator, ${c} ustun`}
                  onMouseEnter={() => {
                    setHoverRow(r)
                    setHoverCol(c)
                  }}
                  onClick={() => {
                    setHoverRow(r)
                    setHoverCol(c)
                  }}
                  sx={{
                    width: 20,
                    height: 20,
                    p: 0,
                    border: `1px solid ${selected ? palette.selectedBorder : palette.line}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    bgcolor: selected ? palette.selected : '#fff',
                    boxShadow: selected ? `0 0 0 1px ${palette.selectedBorder} inset` : 'none',
                    transition: 'background-color 0.1s ease, border-color 0.1s ease, box-shadow 0.1s ease',
                    '&:hover': {
                      bgcolor: selected ? palette.selectedHover : palette.surface,
                      borderColor: selected ? palette.selectedBorder : palette.lineStrong,
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
          bgcolor: '#fff',
          borderTop: '1px solid',
          borderColor: 'rgba(15, 23, 42, 0.06)',
        }}
      >
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.25,
            py: 0.85,
            borderColor: palette.lineStrong,
            color: '#334155',
            '&:hover': { borderColor: '#94a3b8', bgcolor: 'rgba(15, 23, 42, 0.03)' },
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="contained"
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
