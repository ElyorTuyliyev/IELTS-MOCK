import { useCallback, useEffect, useId, useState } from 'react'
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import { c, tokens } from '../../../theme'
import { Button } from '../Button'
import { useToast } from '../Toast'
import type { CheckboxOption } from './extensions/checkboxGroupExtension'

type Row = { id: string; text: string; checked: boolean }

const MIN_OPTIONS = 2
const DEFAULT_COUNT = 3

function createRow(): Row {
  return {
    id: `cb-row-${Math.random().toString(36).slice(2, 11)}`,
    text: '',
    checked: false,
  }
}

function initialRows(): Row[] {
  return Array.from({ length: DEFAULT_COUNT }, () => createRow())
}

export type CheckboxOptionsDialogProps = {
  open: boolean
  defaultQuestionNumber?: number
  onClose: () => void
  onInsert: (
    questionNumber: number,
    questionText: string,
    options: CheckboxOption[],
    checkedValues: string[],
  ) => void
}

export function CheckboxOptionsDialog({
  open,
  defaultQuestionNumber = 1,
  onClose,
  onInsert,
}: CheckboxOptionsDialogProps) {
  const toast = useToast()
  const titleId = useId()
  const descId = useId()
  const [questionNumber, setQuestionNumber] = useState<number>(Math.max(1, Math.floor(defaultQuestionNumber)))
  const [questionText, setQuestionText] = useState('')
  const [rows, setRows] = useState<Row[]>(initialRows)

   
  useEffect(() => {
    if (!open) return
    setQuestionNumber(Math.max(1, Math.floor(defaultQuestionNumber)))
    setQuestionText('')
    setRows(initialRows())
  }, [open, defaultQuestionNumber])
   

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

  const handleToggleChecked = useCallback((id: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, checked: !row.checked } : row)),
    )
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
    const options: CheckboxOption[] = rows.map((row) => ({
      label: row.text.trim(),
      value: row.id,
    }))
    const checkedValues = rows.filter((row) => row.checked).map((row) => row.id)
    const safeQuestionNumber =
      Number.isFinite(questionNumber) && questionNumber > 0 ? Math.floor(questionNumber) : 1
    onInsert(safeQuestionNumber, trimmedQuestion, options, checkedValues)
  }, [questionNumber, questionText, rows, onInsert, toast])

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
          Create Multi Select Options
        </Typography>
        <Typography id={descId} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Define the options and select the correct ones.
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                placeholder="Option"
                value={row.text}
                onChange={(e) => handleText(row.id, e.target.value)}
                sx={textFieldSx}
                slotProps={{ input: { 'aria-label': `Option text ${row.id}` } }}
              />
              <Checkbox
                checked={row.checked}
                onChange={() => handleToggleChecked(row.id)}
                sx={{ p: 0.75 }}
                slotProps={{
                  input: { 'aria-label': 'Correct option (multiple allowed)' },
                }}
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
        </Box>

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
