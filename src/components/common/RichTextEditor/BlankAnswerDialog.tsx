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

function parseDefaultQuestionNumber(defaultId: string): number {
  const match = defaultId.trim().match(/Q?(\d+)/i)
  const n = match ? Number(match[1]) : 1
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
}

export function BlankAnswerDialog({ open, defaultId, onClose, onInsert }: BlankAnswerDialogProps) {
  const toast = useToast()
  const titleId = useId()
  const descId = useId()
  const defaultQuestionNumber = useMemo(() => parseDefaultQuestionNumber(defaultId), [defaultId])
  const [answer, setAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(defaultQuestionNumber)

  useEffect(() => {
    if (!open) return
    setAnswer('')
    setQuestionNumber(defaultQuestionNumber)
  }, [open, defaultQuestionNumber])

  const handleInsert = () => {
    if (!answer.trim()) {
      toast.error('Enter an answer.')
      return
    }
    const safeNumber =
      Number.isFinite(questionNumber) && questionNumber > 0 ? Math.floor(questionNumber) : 1
    onInsert({ id: normalizeId(`Q${safeNumber}`), answer: answer.trim() })
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
          type="number"
          size="small"
          label="Q number"
          value={questionNumber}
          onChange={(e) => setQuestionNumber(Math.max(1, Number(e.target.value || 1)))}
          sx={{ mb: 1.25, maxWidth: 140 }}
          slotProps={{ htmlInput: { min: 1 } }}
        />
        <TextField
          fullWidth
          label="Correct answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="e.g. Apple"
          sx={{ mb: 0.5 }}
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
          Default Q is suggested from existing blanks; you can change it before inserting.
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

