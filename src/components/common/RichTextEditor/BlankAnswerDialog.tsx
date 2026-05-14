import { useEffect, useId, useMemo, useState } from 'react'
import { Box, Dialog, DialogActions, DialogContent, IconButton, TextField, Typography } from '@mui/material'
import { Button } from '../Button'
import { useToast } from '../Toast'

export type BlankAnswerDialogSubmit = { id: string; answer: string }

export type BlankAnswerDialogProps = {
  open: boolean
  defaultId: string
  onClose: () => void
  onInsert: (payload: BlankAnswerDialogSubmit) => void
}

function normalizeId(raw: string): string {
  const t = raw.trim()
  if (!t) return 'Q1'
  return t.toUpperCase().startsWith('Q') ? t.toUpperCase() : `Q${t}`
}

export function BlankAnswerDialog({ open, defaultId, onClose, onInsert }: BlankAnswerDialogProps) {
  const toast = useToast()
  const titleId = useId()
  const descId = useId()
  const [answer, setAnswer] = useState('')

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return
    setAnswer('')
  }, [open])
  /* eslint-enable react-hooks/set-state-in-effect */

  const normalizedId = useMemo(() => normalizeId(defaultId), [defaultId])

  const handleInsert = () => {
    if (!answer.trim()) {
      toast.error('Enter an answer.')
      return
    }
    onInsert({ id: normalizedId, answer: answer.trim() })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        paper: {
          sx: { borderRadius: 3, maxWidth: 520, width: '100%' },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 1, position: 'relative' }}>
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
          sx={{ position: 'absolute', right: 10, top: 10 }}
        >
          <Typography component="span" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>
            ×
          </Typography>
        </IconButton>
        <Typography id={titleId} component="h2" variant="h6" sx={{ fontWeight: 800, pr: 4 }}>
          Blank answer
        </Typography>
        <Typography id={descId} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Enter the answer for the blank (____). The answer is stored inside the HTML.
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 1, px: 3 }}>
        <TextField
          fullWidth
          label="Correct answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="e.g. Apple"
          sx={{ mb: 0.5 }}
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          ID is assigned automatically: <strong>{normalizedId}</strong>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleInsert}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}

