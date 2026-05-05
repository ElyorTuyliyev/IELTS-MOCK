import { useEffect, useMemo, useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Box, Button, Typography } from '@mui/material'

import { graphqlUrl } from '../../graphql/client'
import { StudentExamPlayerPageRoot } from './StudentExamPlayerPage.style'

type QuestionType = 'text' | 'choice'

type QuestionConfig = {
  id: number
  type: QuestionType
  prompt: string
  options?: string[]
  questionType?: string
}

type BackendQuestionOption = {
  title: string
  isCorrectAnswer: boolean
}

type BackendQuestion = {
  _id: string
  title: string
  instruction?: string | null
  stem?: string | null
  sourceMaterial?: string | null
  explanation?: string | null
  question: string
  type: string
  examId: string
  partId?: string | null
  ieltsModule?: string | null
  listeningPart?: number | null
  listeningAudio?: string | null
  placementNumber?: number | null
  options?: BackendQuestionOption[] | null
}

type FindAllQuestionsResponse = {
  findAllQuestions: BackendQuestion[]
}

type PlayerPart = {
  id: number
  title: string
  instruction: string
  lines: string[]
  questionRange: number[]
  questions: QuestionConfig[]
  audioUrl?: string
  hasStandaloneContent?: boolean
}

function renderWithBlanks(value: string) {
  return value.split(/(\[\d+\])/g).map((chunk, idx) => {
    if (/^\[\d+\]$/.test(chunk)) {
      const label = chunk.slice(1, -1)
      return (
        <Box component="span" key={`${chunk}-${idx}`} className="blank">
          {label}
        </Box>
      )
    }
    return <span key={`${chunk}-${idx}`}>{chunk}</span>
  })
}

function decodeAndRenderRawHtml(rawValue: string) {
  if (typeof window === 'undefined') {
    return rawValue
  }

  const textarea = window.document.createElement('textarea')
  textarea.innerHTML = rawValue
  return textarea.value
}

function looksLikeHtml(value: string) {
  return /<[^>]+>/.test(value) || /&lt;|&gt;|&nbsp;|&#/i.test(value)
}

function normalizeQuestionType(rawType?: string | null): QuestionType {
  const lowered = (rawType ?? '').toLowerCase()
  if (lowered.includes('single') || lowered.includes('multiple') || lowered.includes('choice')) {
    return 'choice'
  }
  return 'text'
}

const EXAM_DURATION_SECONDS = 30 * 60
const STORAGE_KEY = 'student-exam-player-state-v1'

const FIND_ALL_QUESTIONS_QUERY = gql`
  query FindAllQuestions {
    findAllQuestions {
      _id
      title
      instruction
      stem
      sourceMaterial
      explanation
      question
      type
      examId
      partId
      ieltsModule
      listeningPart
      listeningAudio
      placementNumber
      options {
        title
        isCorrectAnswer
      }
    }
  }
`

const apiBaseUrl = graphqlUrl.replace(/\/graphql$/, '')

function resolveAssetUrl(rawPath?: string | null) {
  const trimmed = rawPath?.trim()
  if (!trimmed) {
    return undefined
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${apiBaseUrl}${normalizedPath}`
}

const PARTS: PlayerPart[] = [
  {
    id: 1,
    title: 'Questions 1-10',
    instruction: 'Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
    lines: [
      'Phone call about second-hand furniture',
      'Dining table: [1] cheap, medium size, made of [2].',
      'Dining chairs: set of [3], seats covered in [4] material.',
      'Desk: 3 drawers, top drawer has a [5], price [6].',
      'Address: [7] Old Lane, Stonethorpe.',
      'Directions: turn [8] at the crossroads, opposite the [9].',
    ],
    questionRange: Array.from({ length: 10 }, (_, idx) => idx + 1),
    questions: Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 1,
      type: 'text',
      prompt: `Question ${idx + 1}: Write ONE WORD/NUMBER.`,
    })),
  },
  {
    id: 2,
    title: 'Questions 11-20',
    instruction: 'Who is responsible for each area? Choose and move it into the gap.',
    lines: [
      'People and staff responsibilities.',
      'Map labeling task: choose correct labels for areas 16-20.',
      'Labels: Grocery room, common room, kitchen, pantry room, sports complex.',
    ],
    questionRange: Array.from({ length: 10 }, (_, idx) => idx + 11),
    questions: [
      {
        id: 11,
        type: 'choice',
        prompt: 'Who is responsible for finance?',
        options: ['Mary Brown', 'John Stevens', 'Alison Jones', 'Tim Smith'],
      },
      {
        id: 12,
        type: 'choice',
        prompt: 'Who manages food?',
        options: ['Mary Brown', 'John Stevens', 'Alison Jones', 'Jenny James'],
      },
      { id: 13, type: 'text', prompt: 'Question 13: Enter the correct label.' },
      { id: 14, type: 'text', prompt: 'Question 14: Enter the correct label.' },
      { id: 15, type: 'text', prompt: 'Question 15: Enter the correct label.' },
      { id: 16, type: 'text', prompt: 'Question 16: Enter map label.' },
      { id: 17, type: 'text', prompt: 'Question 17: Enter map label.' },
      { id: 18, type: 'text', prompt: 'Question 18: Enter map label.' },
      { id: 19, type: 'text', prompt: 'Question 19: Enter map label.' },
      { id: 20, type: 'text', prompt: 'Question 20: Enter map label.' },
    ],
  },
  {
    id: 3,
    title: 'Questions 21-30',
    instruction: 'Choose correct answers and complete the flow chart.',
    lines: [
      'Fossil categories and their main features.',
      'Procedure for detecting life on another planet.',
      'Sample preparation, heating, and radiation steps.',
    ],
    questionRange: Array.from({ length: 10 }, (_, idx) => idx + 21),
    questions: Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 21,
      type: idx < 5 ? 'choice' : 'text',
      prompt:
        idx < 5
          ? `Question ${idx + 21}: Choose the best category.`
          : `Question ${idx + 21}: Fill the flow-chart answer.`,
      options:
        idx < 5
          ? ['Cast fossils', 'Compaction fossils', 'Fusion fossils', 'Permineralisation fossils']
          : undefined,
    })),
  },
  {
    id: 4,
    title: 'Questions 31-40',
    instruction: 'Choose the correct answer and fill the table with ONE WORD.',
    lines: [
      'Learner persistence study findings and recommendations.',
      'Research findings: social factors, personal characteristics, and outcomes.',
      'Recommendations for new students and tutor support.',
    ],
    questionRange: Array.from({ length: 10 }, (_, idx) => idx + 31),
    questions: Array.from({ length: 10 }, (_, idx) => ({
      id: idx + 31,
      type: idx < 2 ? 'choice' : 'text',
      prompt:
        idx < 2
          ? `Question ${idx + 31}: Choose the correct answer.`
          : `Question ${idx + 31}: Write ONE WORD ONLY.`,
      options:
        idx < 2
          ? ['Age group', 'Geographical area', 'Socio-economic level', 'Financial constraints']
          : undefined,
    })),
  },
]

export function StudentExamPlayerPage() {
  const initialQuestion = PARTS[0].questionRange[0]

  const [activePartId, setActivePartId] = useState(1)
  const [activeQuestion, setActiveQuestion] = useState(initialQuestion)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [playedAudioParts, setPlayedAudioParts] = useState<Record<number, boolean>>({})
  const [audioUnlockedParts, setAudioUnlockedParts] = useState<Record<number, boolean>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { data: questionsData } = useQuery<FindAllQuestionsResponse>(FIND_ALL_QUESTIONS_QUERY)

  const backendParts = useMemo<PlayerPart[]>(() => {
    const all = questionsData?.findAllQuestions ?? []
    const listeningOnly = all.filter(
      (item) =>
        (item.ieltsModule ?? '').toLowerCase().includes('listening') ||
        Boolean((item.listeningPart ?? '').toString().trim()) ||
        Boolean((item.listeningAudio ?? '').trim()),
    )

    if (listeningOnly.length === 0) {
      return []
    }

    let globalQuestionNumber = 1
    const byPart = [1, 2, 3, 4].map((partNo) => {
      const partQuestions = listeningOnly
        .filter((item) => {
          const rawPart = (item.listeningPart ?? '').toString().trim()
          if (!rawPart) {
            return partNo === 1
          }
          const numericPart = Number(rawPart.replace(/[^\d]/g, ''))
          return Number.isFinite(numericPart) ? numericPart === partNo : false
        })
        .sort((a, b) => {
          const aOrder = a.placementNumber ?? Number.MAX_SAFE_INTEGER
          const bOrder = b.placementNumber ?? Number.MAX_SAFE_INTEGER
          if (aOrder !== bOrder) {
            return aOrder - bOrder
          }
          return a._id.localeCompare(b._id)
        })
      if (partQuestions.length === 0) {
        return null
      }

      const partStart = globalQuestionNumber
      const mappedQuestions = partQuestions
        .map((item, idx): QuestionConfig => {
          const options = (item.options ?? [])
            .map((opt) => opt.title?.trim())
            .filter((v): v is string => Boolean(v))

          const questionId = partStart + idx
          return {
            id: questionId,
            type: options.length > 1 ? 'choice' : normalizeQuestionType(item.type),
            prompt: item.question?.trim() || item.title?.trim() || `Question ${idx + 1}`,
            options: options.length > 1 ? options : undefined,
            questionType: item.type,
          }
        })
        .filter((item) => Boolean(item.prompt))

      const questionRange = mappedQuestions.map((q) => q.id)
      if (questionRange.length === 0) {
        return null
      }
      globalQuestionNumber += questionRange.length

      const partAudio = partQuestions.find((item) => (item.listeningAudio ?? '').trim().length > 0)
      const sharedContentSource = partQuestions.find(
        (item) =>
          Boolean(item.sourceMaterial?.trim()) ||
          Boolean(item.stem?.trim()) ||
          Boolean(item.instruction?.trim()) ||
          Boolean(item.explanation?.trim()),
      )
      const partContentBlocks = [
        sharedContentSource?.title?.trim(),
        sharedContentSource?.instruction?.trim(),
        sharedContentSource?.stem?.trim(),
        sharedContentSource?.sourceMaterial?.trim(),
        sharedContentSource?.explanation?.trim(),
      ].filter((value): value is string => Boolean(value))
      const hasStandaloneContent = partContentBlocks.some((block) => looksLikeHtml(block))

      return {
        id: partNo,
        title: `Questions ${questionRange[0]}-${questionRange[questionRange.length - 1]}`,
        instruction:
          sharedContentSource?.instruction?.trim() ||
          'Complete the tasks using the audio and information provided.',
        lines:
          partContentBlocks.length > 0
            ? partContentBlocks
            : mappedQuestions.slice(0, 8).map((q) => q.prompt),
        questionRange,
        questions: mappedQuestions,
        audioUrl: resolveAssetUrl(partAudio?.listeningAudio),
        hasStandaloneContent,
      } satisfies PlayerPart
    })

    return byPart.filter((item) => item !== null) as PlayerPart[]
  }, [questionsData?.findAllQuestions])

  const effectiveParts = backendParts.length > 0 ? backendParts : PARTS
  const effectiveQuestionIds = useMemo(
    () => effectiveParts.flatMap((part) => part.questionRange),
    [effectiveParts],
  )

  const activePart = useMemo(() => {
    const found = effectiveParts.find((part) => part.id === activePartId)
    return found ?? effectiveParts[0]
  }, [activePartId, effectiveParts])
  useEffect(() => {
    if (!effectiveQuestionIds.includes(activeQuestion)) {
      setActiveQuestion(effectiveQuestionIds[0])
      setActivePartId(effectiveParts[0].id)
    }
  }, [activeQuestion, effectiveParts, effectiveQuestionIds])

  useEffect(() => {
    try {
      const savedRaw = window.localStorage.getItem(STORAGE_KEY)
      if (!savedRaw) {
        return
      }
      const saved = JSON.parse(savedRaw) as {
        activePartId?: number
        activeQuestion?: number
        answers?: Record<number, string>
        secondsLeft?: number
        playedAudioParts?: Record<number, boolean>
        audioUnlockedParts?: Record<number, boolean>
      }
      if (saved.activePartId) {
        setActivePartId(saved.activePartId)
      }
      if (saved.activeQuestion) {
        setActiveQuestion(saved.activeQuestion)
      }
      if (saved.answers && typeof saved.answers === 'object') {
        setAnswers(saved.answers)
      }
      if (typeof saved.secondsLeft === 'number') {
        setSecondsLeft(saved.secondsLeft)
      }
      if (saved.playedAudioParts && typeof saved.playedAudioParts === 'object') {
        setPlayedAudioParts(saved.playedAudioParts)
      }
      if (saved.audioUnlockedParts && typeof saved.audioUnlockedParts === 'object') {
        setAudioUnlockedParts(saved.audioUnlockedParts)
      }
    } catch {
      // Ignore invalid saved session.
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activePartId,
        activeQuestion,
        answers,
        secondsLeft,
        playedAudioParts,
        audioUnlockedParts,
      }),
    )
  }, [activePartId, activeQuestion, answers, secondsLeft, playedAudioParts, audioUnlockedParts])

  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) {
      return
    }

    const currentAudioUrl = activePart.audioUrl
    const alreadyPlayed = Boolean(playedAudioParts[activePart.id])
    const isUnlockedForCurrentPart = Boolean(audioUnlockedParts[activePart.id])

    if (!currentAudioUrl || alreadyPlayed || !isUnlockedForCurrentPart) {
      audioElement.pause()
      setIsAudioPlaying(false)
      return
    }

    audioElement.src = currentAudioUrl
    audioElement.currentTime = 0
    const onEnded = () => {
      setPlayedAudioParts((prev) => ({ ...prev, [activePart.id]: true }))
      setIsAudioPlaying(false)
    }
    audioElement.addEventListener('ended', onEnded)
    void audioElement.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false))

    return () => {
      audioElement.removeEventListener('ended', onEnded)
      audioElement.pause()
    }
  }, [activePart.audioUrl, activePart.id, playedAudioParts, audioUnlockedParts])

  const handlePartChange = (partId: number) => {
    const nextPart = effectiveParts.find((item) => item.id === partId)
    if (!nextPart) {
      return
    }
    setActivePartId(partId)
    setActiveQuestion(nextPart.questionRange[0])
  }

  const moveQuestion = (direction: -1 | 1) => {
    const idx = effectiveQuestionIds.indexOf(activeQuestion)
    if (idx < 0) {
      return
    }
    const nextIdx = Math.min(Math.max(0, idx + direction), effectiveQuestionIds.length - 1)
    const nextQuestion = effectiveQuestionIds[nextIdx]
    const nextPart = effectiveParts.find((part) => part.questionRange.includes(nextQuestion))
    if (nextPart) {
      setActivePartId(nextPart.id)
    }
    setActiveQuestion(nextQuestion)
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
  }

  const rightPaneDefaultOptions = ['TRUE', 'FALSE', 'NOT GIVEN']
  const shouldShowAudioGate =
    Boolean(activePart.audioUrl) &&
    !playedAudioParts[activePart.id] &&
    !audioUnlockedParts[activePart.id]
  const controlsLocked = shouldShowAudioGate
  const normalizedPartLines = useMemo(() => {
    const seen = new Set<string>()
    const blacklist = new Set([
      activePart.title.trim().toLowerCase(),
      activePart.instruction.trim().toLowerCase(),
      `part ${activePart.id}`.toLowerCase(),
    ])

    return activePart.lines.filter((line) => {
      const normalized = line
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()

      if (!normalized || normalized.length < 2) {
        return false
      }
      if (blacklist.has(normalized)) {
        return false
      }
      if (seen.has(normalized)) {
        return false
      }
      seen.add(normalized)
      return true
    })
  }, [activePart.id, activePart.instruction, activePart.lines, activePart.title])

  return (
    <StudentExamPlayerPageRoot>
      <Box className="player__topbar">
        <Box className="player__brand">
          <span className="player__logo">IELTS</span>
          <Box className="player__identity">
            <Typography component="p" className="player__identity-title">
              Test taker ID
            </Typography>
            <Box
              className="player__identity-audio"
              onClick={() => {
                if (controlsLocked) {
                  return
                }
                const audioElement = audioRef.current
                if (
                  !audioElement ||
                  !activePart.audioUrl ||
                  playedAudioParts[activePart.id] ||
                  !audioUnlockedParts[activePart.id]
                ) {
                  return
                }
                if (audioElement.paused) {
                  void audioElement.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false))
                } else {
                  audioElement.pause()
                  setIsAudioPlaying(false)
                }
              }}
            >
              <span className="player__audio-icon">{isAudioPlaying ? '🔊' : '🔇'}</span>
              <Typography component="span" className="player__identity-audio-text">
                {playedAudioParts[activePart.id]
                  ? 'Audio completed'
                  : isAudioPlaying
                    ? 'Audio is Playing'
                    : 'Audio is Paused'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="player__top-actions">
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="player__icon-svg">
              <path
                d="M12 3a4.5 4.5 0 0 0-4.5 4.5v1.6c0 .7-.3 1.4-.8 1.9L5.2 12.5a2 2 0 0 0 1.4 3.4h10.8a2 2 0 0 0 1.4-3.4L17.3 11c-.5-.5-.8-1.2-.8-1.9V7.5A4.5 4.5 0 0 0 12 3Zm0 18a2.8 2.8 0 0 0 2.7-2.1H9.3A2.8 2.8 0 0 0 12 21Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="player__icon-svg">
              <path
                d="M4 6.5h16M4 12h16M4 17.5h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Box>
      </Box>

      <Box className="player__workspace">
        <Box className="player__sheet">
          <Box className="player__audio-strip">
            <Typography component="p" className="player__strip-title">
              Part {activePart.id}
            </Typography>
            <Typography component="p" className="player__strip-subtitle">
              Listen and answer questions {activePart.questionRange[0]}-
              {activePart.questionRange[activePart.questionRange.length - 1]}.
            </Typography>
          </Box>

          <Box className="player__content">
            {shouldShowAudioGate ? (
              <Box className="player__audio-gate">
                <Box className="player__audio-gate-content">
                  <Box className="player__audio-gate-icon">🎧</Box>
                  <Typography component="p" className="player__audio-gate-text">
                    You will listen to the audio once for this part. Pause or rewind is not allowed.
                  </Typography>
                  <Button
                    className="player__audio-gate-button"
                    onClick={() =>
                      setAudioUnlockedParts((prev) => ({
                        ...prev,
                        [activePart.id]: true,
                      }))
                    }
                  >
                    ▶ Play
                  </Button>
                </Box>
              </Box>
            ) : null}
            <Box className="player__listening-layout">
              <Typography component="h3" className="player__title">
                {activePart.title}
              </Typography>
              <Typography component="p" className="player__line">
                {activePart.instruction}
              </Typography>
              <audio ref={audioRef} className="player__audio-hidden" preload="metadata" />
              {normalizedPartLines.map((line) => (
                <Box key={line} className="player__line-html">
                  {looksLikeHtml(line) ? (
                    <div
                      className="player__line-html-content"
                      dangerouslySetInnerHTML={{ __html: decodeAndRenderRawHtml(line) }}
                    />
                  ) : (
                    <Typography component="p" className="player__line">
                      {renderWithBlanks(line)}
                    </Typography>
                  )}
                </Box>
              ))}
              {!activePart.hasStandaloneContent ? (
                <Box className="player__question-list player__question-list--stacked">
                  {activePart.questions.map((question, idx) => {
                    const questionNo = activePart.questionRange[idx] ?? question.id
                    const optionSet = question.options?.length ? question.options : rightPaneDefaultOptions
                    return (
                      <Box key={question.id} className="player__question-item">
                        <Box className="player__question-prompt-html">
                          {looksLikeHtml(question.prompt) ? (
                            <div
                              className="player__line-html-content"
                              dangerouslySetInnerHTML={{
                                __html: `<strong>${questionNo}</strong> ${decodeAndRenderRawHtml(question.prompt)}`,
                              }}
                            />
                          ) : (
                            <Typography component="p" className="player__question-prompt">
                              <strong>{questionNo}</strong> {question.prompt}
                            </Typography>
                          )}
                        </Box>
                        {question.type === 'text' && !question.options?.length ? (
                          <input
                            className="player__text-input"
                            value={answers[questionNo] ?? ''}
                            onChange={(event) =>
                              setAnswers((prev) => ({ ...prev, [questionNo]: event.target.value }))
                            }
                            disabled={isSubmitted || controlsLocked}
                          />
                        ) : (
                          <Box className="player__choices">
                            {optionSet.map((option) => {
                              const selected = (answers[questionNo] ?? '') === option
                              return (
                                <button
                                  key={`${questionNo}-${option}`}
                                  type="button"
                                  className={`player__choice-btn${selected ? ' player__choice-btn--selected' : ''}`}
                                  onClick={() => setAnswers((prev) => ({ ...prev, [questionNo]: option }))}
                                  disabled={isSubmitted || controlsLocked}
                                >
                                  ○ {option}
                                </button>
                              )
                            })}
                          </Box>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              ) : null}
            </Box>

            <Box className="player__side-nav">
              <Button className="player__arrow" onClick={() => moveQuestion(-1)} disabled={controlsLocked}>
                ←
              </Button>
              <Button
                className="player__arrow player__arrow--next"
                onClick={() => moveQuestion(1)}
                disabled={controlsLocked}
              >
                →
              </Button>
            </Box>
          </Box>

          <Box className="player__footer">
            <Box className="player__footer-left">
              <Box className="player__part-switch">
                {effectiveParts.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    className={`player__part-btn${activePartId === part.id ? ' player__part-btn--active' : ''}`}
                    onClick={() => handlePartChange(part.id)}
                    disabled={controlsLocked}
                  >
                    Part {part.id}
                  </button>
                ))}
              </Box>
              <Box className="player__questions">
                {activePart.questionRange.map((questionNo) => (
                  <button
                    key={questionNo}
                    type="button"
                    className={`player__q-btn${questionNo === activeQuestion ? ' player__q-btn--active' : ''}${
                      (answers[questionNo] ?? '').trim().length > 0 ? ' player__q-btn--answered' : ''
                    }`}
                    onClick={() => setActiveQuestion(questionNo)}
                    disabled={controlsLocked}
                  >
                    {questionNo}
                  </button>
                ))}
              </Box>
            </Box>

            <Box className="player__nav">
              <Button className="player__submit" onClick={handleSubmit} disabled={isSubmitted || controlsLocked}>
                {isSubmitted ? '✓' : '✓'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </StudentExamPlayerPageRoot>
  )
}
