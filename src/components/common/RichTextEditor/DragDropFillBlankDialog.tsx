import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from 'react'
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

import {
  DRAG_DROP_GAP_TOKEN,
  type DragDropFillBlankPayload,
  type DragDropGap,
} from './extensions/dragDropFillBlankExtension'

const palette = {
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  text: '#0f172a',
  muted: '#64748b',
  exampleBg: '#eff6ff',
  exampleBorder: '#bfdbfe',
  exampleText: '#1e40af',
  primaryDark: '#111827',
  primaryHover: '#0f172a',
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
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
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
  color: '#fff',
  textTransform: 'none' as const,
  fontWeight: 600,
  borderRadius: '10px',
  py: 1.15,
  '&:hover': { bgcolor: palette.primaryHover },
}

export function DragDropFillBlankDialog({ open, onClose, onInsert }: DragDropFillBlankDialogProps) {
  const titleId = useId()
  const descId = useId()
  const [questionText, setQuestionText] = useState('')
  const [mode, setMode] = useState<'shuffled' | 'ordered'>('shuffled')
  const [gapAnswers, setGapAnswers] = useState<string[]>([])
  const [distractors, setDistractors] = useState<DistractorRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setQuestionText('')
    setMode('shuffled')
    setGapAnswers([])
    setDistractors([])
    setError(null)
  }, [open])

  useEffect(() => {
    setGapAnswers((prev) => syncGapAnswers(questionText, prev))
  }, [questionText])

  const gapCount = useMemo(() => countGaps(questionText), [questionText])

  const handleAppendGap = useCallback(() => {
    setQuestionText((prev) => {
      const t = prev.trimEnd()
      return t ? `${t} ${DRAG_DROP_GAP_TOKEN}` : DRAG_DROP_GAP_TOKEN
    })
  }, [])

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
      setError(`Add at least one blank in the question using ${DRAG_DROP_GAP_TOKEN} (four underscores).`)
      return
    }
    if (gapAnswers.length !== n) {
      setError('The number of blanks and answers does not match. Check your question text.')
      return
    }
    const trimmedGaps = gapAnswers.map((a) => a.trim())
    if (trimmedGaps.some((a) => a.length === 0)) {
      setError('Enter a correct answer for every gap.')
      return
    }
    const uniq = new Set(trimmedGaps)
    if (uniq.size !== trimmedGaps.length) {
      setError('Each gap should have a different correct answer.')
      return
    }
    const gaps: DragDropGap[] = trimmedGaps.map((answer, i) => ({
      id: `gap${i + 1}`,
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
    })
    setError(null)
  }, [questionText, mode, gapAnswers, distractors, onInsert])

  const textFieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3b82f6',
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
            bgcolor: 'rgba(15, 23, 42, 0.42)',
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
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
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
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.06)' },
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
                    '&.Mui-checked': { color: '#2563eb' },
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
                    '&.Mui-checked': { color: '#2563eb' },
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

        <Panel title="Question text">
          <TextField
            fullWidth
            multiline
            minRows={4}
            placeholder={`Enter your question with ${DRAG_DROP_GAP_TOKEN} for blanks`}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
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
          <Button type="button" fullWidth variant="contained" onClick={handleAppendGap} sx={{ ...primaryButtonSx, mt: gapAnswers.length ? 1 : 0 }}>
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
                onClick={() => handleRemoveDistractor(row.id)}
                sx={{ color: 'error.main', flexShrink: 0 }}
              >
                <Typography component="span" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  ×
                </Typography>
              </IconButton>
            </Box>
          ))}
          <Button type="button" fullWidth variant="contained" onClick={handleAddDistractor} sx={{ ...primaryButtonSx, mt: distractors.length ? 1 : 0 }}>
            Add distractor
          </Button>
        </Panel>

        {error ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
          >
            <Typography variant="body2" sx={{ color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        ) : null}
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
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            py: 0.85,
            borderColor: palette.borderStrong,
            color: '#334155',
            '&:hover': { borderColor: '#94a3b8', bgcolor: 'rgba(15, 23, 42, 0.03)' },
          }}
        >
          Cancel
        </Button>
        <Button type="button" variant="contained" disableElevation onClick={handleInsert} sx={{ ...primaryButtonSx, px: 2.75 }}>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}
