import { useCallback, useEffect, useId, useState } from 'react'
import {
  Box,
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

import { c, tokens } from '../../../theme'
import { Button } from '../Button'
import { useToast } from '../Toast'
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
  /** `correctValue` — selected option `value` (checked in the editor). */
  onInsert: (questionNumber: number, questionText: string, options: RadioOption[], correctValue: string) => void
}

export function RadioOptionsDialog({
  open,
  defaultQuestionNumber = 1,
  onClose,
  onInsert,
}: RadioOptionsDialogProps) {
  const toast = useToast()
  const titleId = useId()
  const descId = useId()
  const [questionText, setQuestionText] = useState('')
  const [questionNumber, setQuestionNumber] = useState<number>(Math.max(1, Math.floor(defaultQuestionNumber)))
  const [rows, setRows] = useState<Row[]>(initialRows)
  const [correctId, setCorrectId] = useState<string>(() => initialRows()[0]?.id ?? '')

   
  useEffect(() => {
    if (!open) return
    const next = initialRows()
    setQuestionText('')
    setQuestionNumber(Math.max(1, Math.floor(defaultQuestionNumber)))
    setRows(next)
    setCorrectId(next[0]?.id ?? '')
  }, [open, defaultQuestionNumber])
   

   
  useEffect(() => {
    if (rows.length === 0) return
    if (!rows.some((row) => row.id === correctId)) {
      // Keep selected answer valid after option delete.
      setCorrectId(rows[0].id)
    }
  }, [rows, correctId])
   

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
      toast.error('Enter the question text.')
      return
    }
    const trimmed = rows.map((row) => row.text.trim())
    if (trimmed.some((text) => text.length === 0)) {
      toast.error('Enter text for every option.')
      return
    }
    if (rows.length < MIN_OPTIONS) {
      toast.error(`At least ${MIN_OPTIONS} options are required.`)
      return
    }
    const options: RadioOption[] = rows.map((row) => ({
      label: row.text.trim(),
      value: row.id,
    }))
    const safeQuestionNumber =
      Number.isFinite(questionNumber) && questionNumber > 0 ? Math.floor(questionNumber) : 1
    onInsert(safeQuestionNumber, trimmedQuestion, options, correctId)
  }, [questionText, questionNumber, rows, correctId, onInsert, toast])

  const textFieldSx = {
    flex: 1,
    '& .MuiOutlinedInput-root': { borderRadius: 2 },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: c.primary.main,
      borderWidth: 2,
    },
  } as const

  const darkButtonSx = {
    bgcolor: c.slate[900],
    color: c.white,
    textTransform: 'none' as const,
    fontWeight: 600,
    borderRadius: 2,
    py: 1.25,
    '&:hover': { bgcolor: c.text.primary },
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
            boxShadow: tokens.shadows.dialog,
          },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 2.5, pb: 1, position: 'relative' }}>
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
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
          placeholder="Question text"
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
                  <Radio sx={{ p: 0.75 }} slotProps={{ input: { 'aria-label': 'Correct option' } }} />
                }
                label=""
                sx={{ m: 0, mr: 0.5 }}
              />
              <IconButton
                type="button"
                size="small"
                aria-label="Remove option"
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
          variant="primary"
          onClick={handleAdd}
          sx={{ ...darkButtonSx, mt: 2.5 }}
        >
          Add Option
        </Button>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1, justifyContent: 'flex-end' }}>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2.5 }}
        >
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={handleInsert} sx={{ ...darkButtonSx, px: 2.5 }}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}
