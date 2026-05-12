import { useCallback, useEffect, useId, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'

import type { RadioOption } from './extensions/radioGroupExtension'

type Row = { id: string; text: string }

const MIN_OPTIONS = 2
const DEFAULT_COUNT = 3

function createRow(): Row {
  return { id: `row-${Math.random().toString(36).slice(2, 11)}`, text: '' }
}

function initialRows(): Row[] {
  return Array.from({ length: DEFAULT_COUNT }, () => createRow())
}

export type RadioOptionsDialogProps = {
  open: boolean
  defaultQuestionNumber?: number
  onClose: () => void
  /** `correctValue` — tanlangan variantning `value` si (editor ichida checked). */
  onInsert: (questionNumber: number, questionText: string, options: RadioOption[], correctValue: string) => void
}

export function RadioOptionsDialog({
  open,
  defaultQuestionNumber = 1,
  onClose,
  onInsert,
}: RadioOptionsDialogProps) {
  const titleId = useId()
  const descId = useId()
  const [questionText, setQuestionText] = useState('')
  const [questionNumber, setQuestionNumber] = useState<number>(Math.max(1, Math.floor(defaultQuestionNumber)))
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [correctId, setCorrectId] = useState<string>(() => initialRows()[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return
    const next = initialRows()
    // Reset form state each time modal opens.
    setQuestionText('')
    setQuestionNumber(Math.max(1, Math.floor(defaultQuestionNumber)))
    setRows(next)
    setCorrectId(next[0]?.id ?? '')
    setError(null)
  }, [open, defaultQuestionNumber])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (rows.length === 0) return
    if (!rows.some((row) => row.id === correctId)) {
      // Keep selected answer valid after option delete.
      setCorrectId(rows[0].id)
    }
  }, [rows, correctId])
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleAdd = useCallback(() => {
    setRows((current) => [...current, createRow()])
  }, [])

  const handleRemove = useCallback((id: string) => {
    setRows((current) => {
      if (current.length <= MIN_OPTIONS) return current
      return current.filter((row) => row.id !== id)
    })
  }, [])

  const handleText = useCallback((id: string, text: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, text } : row)))
  }, [])

  const handleInsert = useCallback(() => {
    const trimmedQuestion = questionText.trim()
    if (!trimmedQuestion) {
      setError('Savol matnini kiriting.')
      return
    }
    const trimmed = rows.map((row) => row.text.trim())
    if (trimmed.some((text) => text.length === 0)) {
      setError('Barcha variantlar uchun matn kiriting.')
      return
    }
    if (rows.length < MIN_OPTIONS) {
      setError(`Kamida ${MIN_OPTIONS} ta variant bo‘lishi kerak.`)
      return
    }
    const options: RadioOption[] = rows.map((row) => ({
      label: row.text.trim(),
      value: row.id,
    }))
    const safeQuestionNumber =
      Number.isFinite(questionNumber) && questionNumber > 0 ? Math.floor(questionNumber) : 1
    onInsert(safeQuestionNumber, trimmedQuestion, options, correctId)
    setError(null)
  }, [questionText, questionNumber, rows, correctId, onInsert])

  const textFieldSx = {
    flex: 1,
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#7c3aed',
      borderWidth: 2,
    },
  } as const

  const darkButtonSx = {
    bgcolor: '#111827',
    color: '#fff',
    textTransform: 'none' as const,
    fontWeight: 600,
    borderRadius: 2,
    py: 1.25,
    '&:hover': { bgcolor: '#0f172a' },
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: 520,
            width: '100%',
            boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
          },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 1, position: 'relative' }}>
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <Typography component="span" sx={{ fontSize: '1.1rem', lineHeight: 1 }}>
            ×
          </Typography>
        </IconButton>
        <Typography id={titleId} component="h2" variant="h6" sx={{ fontWeight: 700, pr: 4 }}>
          Create Radio Options
        </Typography>
        <Typography id={descId} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Define the options and select the correct one.
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 1, pb: 2, px: 3 }}>
        {error ? (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}
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
          size="small"
          fullWidth
          label="Question"
          placeholder="Savol matni"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <RadioGroup
          value={correctId}
          onChange={(_, value) => setCorrectId(value)}
          sx={{ gap: 2 }}
        >
          {rows.map((row) => (
            <Box
              key={row.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ minWidth: 52, fontWeight: 600, color: 'text.primary' }}
              >
                Option
              </Typography>
              <TextField
                size="small"
                placeholder="option"
                value={row.text}
                onChange={(e) => handleText(row.id, e.target.value)}
                sx={textFieldSx}
                slotProps={{ input: { 'aria-label': `Option text ${row.id}` } }}
              />
              <FormControlLabel
                value={row.id}
                control={
                  <Radio sx={{ p: 0.75 }} slotProps={{ input: { 'aria-label': 'To‘g‘ri variant' } }} />
                }
                label=""
                sx={{ m: 0, mr: 0.5 }}
              />
              <IconButton
                type="button"
                size="small"
                aria-label="Variantni o‘chirish"
                disabled={rows.length <= MIN_OPTIONS}
                onClick={() => handleRemove(row.id)}
                sx={{ color: rows.length <= MIN_OPTIONS ? 'action.disabled' : 'error.main' }}
              >
                <Typography component="span" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                  ×
                </Typography>
              </IconButton>
            </Box>
          ))}
        </RadioGroup>

        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={handleAdd}
          sx={{ ...darkButtonSx, mt: 2.5 }}
        >
          Add Option
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2.5 }}
        >
          Cancel
        </Button>
        <Button type="button" variant="contained" onClick={handleInsert} sx={{ ...darkButtonSx, px: 2.5 }}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}
