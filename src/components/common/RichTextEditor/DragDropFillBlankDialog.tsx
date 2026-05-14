import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
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
import {
  DRAG_DROP_GAP_TOKEN,
  type DragDropFillBlankPayload,
  type DragDropGap,
} from './extensions/dragDropFillBlankExtension'

const palette = {
  border: c.border.default,
  borderStrong: c.border.strong,
  surface: c.surface.default,
  surfaceMuted: c.surface.muted,
  text: c.text.primary,
  muted: c.text.secondary,
  exampleBg: c.info.bg,
  exampleBorder: c.info.border,
  exampleText: c.info.darker,
  primaryDark: c.slate[900],
  primaryHover: c.text.primary,
}

function countGaps(text: string): number {
  if (!text) return 0
  const parts = text.split(DRAG_DROP_GAP_TOKEN)
  return Math.max(0, parts.length - 1)
}

function syncGapAnswers(question: string, prev: string[]): string[] {
  const n = countGaps(question)
  const next = prev.slice(0, n)
  while (next.length < n) next.push('')
  return next
}

export type DragDropFillBlankDialogProps = {
  open: boolean
  onClose: () => void
  onInsert: (payload: DragDropFillBlankPayload) => void
  defaultStartNumber?: number
}

type DistractorRow = { id: string; text: string }

function createDistractor(): DistractorRow {
  return { id: `dist-${Math.random().toString(36).slice(2, 11)}`, text: '' }
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        mb: 2.25,
        p: 2,
        borderRadius: '14px',
        bgcolor: palette.surface,
        border: `1px solid ${palette.border}`,
        boxShadow: tokens.shadows.sm,
      }}
    >
      <Typography
        component="h3"
        sx={{
          fontSize: '0.95rem',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: palette.text,
          mb: subtitle ? 0.5 : 1.25,
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" sx={{ color: palette.muted, fontSize: '0.8rem', lineHeight: 1.5, mb: 1.5 }}>
          {subtitle}
        </Typography>
      ) : null}
      {children}
    </Box>
  )
}

const primaryButtonSx = {
  bgcolor: palette.primaryDark,
  color: c.white,
  textTransform: 'none' as const,
  fontWeight: 600,
  borderRadius: '10px',
  py: 1.15,
  '&:hover': { bgcolor: palette.primaryHover },
}

export function DragDropFillBlankDialog({
  open,
  onClose,
  onInsert,
  defaultStartNumber = 1,
}: DragDropFillBlankDialogProps) {
  const toast = useToast()
  const titleId = useId()
  const descId = useId()
  const questionInputRef = useRef<HTMLTextAreaElement | null>(null)
  const [questionText, setQuestionText] = useState('')
  const [mode, setMode] = useState<'shuffled' | 'ordered'>('shuffled')
  const [startNumber, setStartNumber] = useState('1')
  const [targetsLabel, setTargetsLabel] = useState('Categories')
  const [poolLabel, setPoolLabel] = useState('Options')
  const [gapAnswers, setGapAnswers] = useState<string[]>([])
  const [distractors, setDistractors] = useState<DistractorRow[]>([])

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return
    setQuestionText('')
    setMode('shuffled')
    setStartNumber(String(Math.max(1, Math.floor(defaultStartNumber))))
    setGapAnswers([])
    setDistractors([])
  }, [open, defaultStartNumber])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Keep answer inputs in sync with number of blanks in question text.
    setGapAnswers((prev) => syncGapAnswers(questionText, prev))
  }, [questionText])
  /* eslint-enable react-hooks/set-state-in-effect */

  const gapCount = useMemo(() => countGaps(questionText), [questionText])

  const handleAppendGap = useCallback(() => {
    const textarea = questionInputRef.current
    if (!textarea) {
      setQuestionText((prev) => {
        const t = prev.trimEnd()
        return t ? `${t} ${DRAG_DROP_GAP_TOKEN}` : DRAG_DROP_GAP_TOKEN
      })
      return
    }

    const start = textarea.selectionStart ?? questionText.length
    const end = textarea.selectionEnd ?? questionText.length
    const before = questionText.slice(0, start)
    const after = questionText.slice(end)
    const next = `${before}${DRAG_DROP_GAP_TOKEN}${after}`
    setQuestionText(next)

    const cursor = start + DRAG_DROP_GAP_TOKEN.length
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }, [questionInputRef, questionText])

  const handleGapAnswer = useCallback((index: number, value: string) => {
    setGapAnswers((current) => current.map((a, i) => (i === index ? value : a)))
  }, [])

  const handleClearGapAnswer = useCallback((index: number) => {
    setGapAnswers((current) => current.map((a, i) => (i === index ? '' : a)))
  }, [])

  const handleAddDistractor = useCallback(() => {
    setDistractors((current) => [...current, createDistractor()])
  }, [])

  const handleRemoveDistractor = useCallback((id: string) => {
    setDistractors((current) => current.filter((row) => row.id !== id))
  }, [])

  const handleDistractorText = useCallback((id: string, text: string) => {
    setDistractors((current) => current.map((row) => (row.id === id ? { ...row, text } : row)))
  }, [])

  const handleInsert = useCallback(() => {
    const n = countGaps(questionText)
    if (n === 0) {
      toast.error(`Add at least one blank in the question using ${DRAG_DROP_GAP_TOKEN} (four underscores).`)
      return
    }
    if (gapAnswers.length !== n) {
      toast.error('The number of blanks and answers does not match. Check your question text.')
      return
    }
    const trimmedGaps = gapAnswers.map((a) => a.trim())
    if (trimmedGaps.some((a) => a.length === 0)) {
      toast.error('Enter a correct answer for every gap.')
      return
    }
    const uniq = new Set(trimmedGaps)
    if (uniq.size !== trimmedGaps.length) {
      toast.error('Each gap should have a different correct answer.')
      return
    }
    const parsedStart = Number(startNumber)
    const start = Number.isFinite(parsedStart) && parsedStart > 0 ? Math.floor(parsedStart) : 1
    const gaps: DragDropGap[] = trimmedGaps.map((answer, i) => ({
      id: `Q${start + i}`,
      answer,
    }))
    const distractorStrings = distractors
      .map((d) => d.text.trim())
      .filter((t) => t.length > 0)

    onInsert({
      questionText: questionText.trim(),
      mode,
      gaps,
      distractors: distractorStrings,
      targetsLabel: targetsLabel.trim() || 'Categories',
      poolLabel: poolLabel.trim() || 'Options',
    })
  }, [questionText, mode, gapAnswers, distractors, onInsert, startNumber, targetsLabel, poolLabel, toast])

  const textFieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: c.info.light,
      borderWidth: 2,
    },
  } as const

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: tokens.rgba.slate900_42,
            backdropFilter: 'blur(3px)',
          },
        },
        paper: {
          elevation: 0,
          sx: {
            borderRadius: '16px',
            maxWidth: 560,
            width: '100%',
            overflow: 'hidden',
            border: `1px solid ${tokens.rgba.slate900_08}`,
            boxShadow: tokens.shadows.dialogLg,
          },
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          position: 'relative',
          bgcolor: palette.surface,
          borderBottom: `1px solid ${palette.border}`,
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
            borderRadius: '10px',
            color: palette.muted,
            '&:hover': { bgcolor: tokens.rgba.slate900_06 },
          }}
        >
          <Typography component="span" sx={{ fontSize: '1.3rem', lineHeight: 1, fontWeight: 300 }}>
            ×
          </Typography>
        </IconButton>
        <Typography
          id={titleId}
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
            color: palette.text,
            pr: 5,
          }}
        >
          Create Drag and Drop Fill-in-the-Blank
        </Typography>
        <Typography id={descId} variant="body2" sx={{ mt: 1, color: palette.muted, lineHeight: 1.55, maxWidth: '98%' }}>
          Create a question with gaps. Use{' '}
          <Box component="code" sx={{ px: 0.5, py: 0.2, bgcolor: palette.surfaceMuted, borderRadius: 1, fontSize: '0.85em' }}>
            {DRAG_DROP_GAP_TOKEN}
          </Box>{' '}
          (four underscores) for each blank space.
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 2, px: 3, bgcolor: palette.surfaceMuted }}>
        <Box
          sx={{
            mb: 2.25,
            p: 1.75,
            borderRadius: '12px',
            bgcolor: palette.exampleBg,
            border: `1px solid ${palette.exampleBorder}`,
          }}
        >
          <Typography variant="body2" sx={{ color: palette.exampleText, lineHeight: 1.6, fontSize: '0.875rem' }}>
            <strong>Example:</strong> &quot;The {DRAG_DROP_GAP_TOKEN} is the largest planet in our {DRAG_DROP_GAP_TOKEN}.&quot;
            Then add two gap answers below.
          </Typography>
        </Box>

        <Panel title="Question mode">
          <RadioGroup value={mode} onChange={(_, v) => setMode(v as 'shuffled' | 'ordered')}>
            <FormControlLabel
              value="shuffled"
              control={
                <Radio
                  sx={{
                    color: palette.borderStrong,
                    '&.Mui-checked': { color: c.info.main },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: palette.text }}>
                    Shuffled mode
                  </Typography>
                  <Typography variant="caption" sx={{ color: palette.muted, display: 'block', mt: 0.25 }}>
                    Answers will be shuffled randomly for students.
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', mb: 1.5, ml: 0 }}
            />
            <FormControlLabel
              value="ordered"
              control={
                <Radio
                  sx={{
                    color: palette.borderStrong,
                    '&.Mui-checked': { color: c.info.main },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: palette.text }}>
                    Ordered mode
                  </Typography>
                  <Typography variant="caption" sx={{ color: palette.muted, display: 'block', mt: 0.25 }}>
                    Pool order matches gap order (gap1, gap2, …).
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', ml: 0 }}
            />
          </RadioGroup>
        </Panel>

        <Panel title="Column labels" subtitle="Shown above the matching columns in the exam player.">
          <TextField
            fullWidth
            label="Left column (categories)"
            value={targetsLabel}
            onChange={(e) => setTargetsLabel(e.target.value)}
            placeholder="e.g. Fossil categories"
            sx={{ ...textFieldSx, mb: 1.5 }}
          />
          <TextField
            fullWidth
            label="Right column (options)"
            value={poolLabel}
            onChange={(e) => setPoolLabel(e.target.value)}
            placeholder="e.g. Features"
            sx={textFieldSx}
          />
        </Panel>

        <Panel title="Question text">
          <TextField
            fullWidth
            label="Start question number"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            inputMode="numeric"
            placeholder="1"
            sx={{ ...textFieldSx, mb: 1 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder={`Enter your question with ${DRAG_DROP_GAP_TOKEN} for blanks`}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            inputRef={(node: HTMLTextAreaElement | null) => {
              questionInputRef.current = node
            }}
            sx={{ ...textFieldSx, mb: 1 }}
          />
          <Typography variant="body2" sx={{ color: palette.muted, fontWeight: 600, fontSize: '0.8rem' }}>
            Gaps found: {gapCount}
          </Typography>
        </Panel>

        <Panel
          title="Gap answers (in order)"
          subtitle="Each gap must have a unique answer. IDs gap1, gap2, … are stored for grading."
        >
          {gapAnswers.length === 0 ? (
            <Typography variant="body2" sx={{ color: palette.muted, fontStyle: 'italic', py: 0.5 }}>
              Add {DRAG_DROP_GAP_TOKEN} to the question to see gap fields.
            </Typography>
          ) : (
            gapAnswers.map((value, index) => (
              <Box key={`gap-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ minWidth: 56, fontWeight: 700, color: palette.text, flexShrink: 0 }}
                >
                  Gap {index + 1}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Correct answer"
                  value={value}
                  onChange={(e) => handleGapAnswer(index, e.target.value)}
                  sx={textFieldSx}
                />
                <IconButton
                  type="button"
                  size="small"
                  aria-label="Clear answer"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleClearGapAnswer(index)}
                  disabled={!value}
                  sx={{ color: 'error.main', flexShrink: 0, opacity: value ? 1 : 0.35 }}
                >
                  <Typography component="span" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    ×
                  </Typography>
                </IconButton>
              </Box>
            ))
          )}
          <Button type="button" fullWidth variant="primary" onClick={handleAppendGap} sx={{ ...primaryButtonSx, mt: gapAnswers.length ? 1 : 0 }}>
            Add gap answer ({DRAG_DROP_GAP_TOKEN} to question)
          </Button>
        </Panel>

        <Panel
          title="Distractor answers (optional)"
          subtitle="Extra wrong answers for the pool. Leave empty if not needed."
        >
          {distractors.map((row, index) => (
            <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
              <Typography
                component="span"
                variant="body2"
                sx={{ minWidth: 56, fontWeight: 700, color: palette.text, flexShrink: 0 }}
              >
                Extra {index + 1}
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Wrong answer (distractor)"
                value={row.text}
                onChange={(e) => handleDistractorText(row.id, e.target.value)}
                sx={textFieldSx}
              />
              <IconButton
                type="button"
                size="small"
                aria-label="Remove distractor"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleRemoveDistractor(row.id)}
                sx={{ color: 'error.main', flexShrink: 0 }}
              >
                <Typography component="span" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  ×
                </Typography>
              </IconButton>
            </Box>
          ))}
          <Button type="button" fullWidth variant="primary" onClick={handleAddDistractor} sx={{ ...primaryButtonSx, mt: distractors.length ? 1 : 0 }}>
            Add distractor
          </Button>
        </Panel>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          gap: 1,
          justifyContent: 'flex-end',
          bgcolor: palette.surface,
          borderTop: `1px solid ${palette.border}`,
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
            px: 2.5,
            py: 0.85,
            borderColor: palette.borderStrong,
            color: c.text.subtle,
            '&:hover': { borderColor: c.text.disabled, bgcolor: tokens.rgba.slate900_04 },
          }}
        >
          Cancel
        </Button>
        <Button type="button" variant="primary" disableElevation onClick={handleInsert} sx={{ ...primaryButtonSx, px: 2.75 }}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}
