import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Box, IconButton, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { graphqlUrl } from '../../graphql/client'
import { ROUTES_PATH } from '../../routes/paths'
import { selectUserName } from '../../store'
import { useAppSelector } from '../../store/hooks'
import { FIND_ALL_QUESTIONS_QUERY } from '../QuestionsPage/api/findAllQuestionsQuery'
import { StudentExamPlayerRoot } from './StudentExamPlayerPage.style'
import {
  MODULE_DURATION_SECONDS,
  MODULE_ORDER,
  MODULE_PART_COUNTS,
  type ModuleName,
} from './constants'
import { ListeningStartOverlay, StudentExamFinishModal, StudentExamPlayerHeader } from './components'

type BackendQuestion = {
  _id: string
  examId?: string | null
  question?: string | null
  title?: string | null
  type?: string | null
  instruction?: string | null
  sourceMaterial?: string | null
  explanation?: string | null
  ieltsModule?: string | null
  listeningPart?: string | number | null
  partId?: string | null
  placementNumber?: number | null
  listeningAudio?: string | null
  passageHtml?: string | null
  questionsHtml?: string | null
  options?: Array<{ title?: string | null; isCorrectAnswer?: boolean | null }> | null
}

type DisplayQuestion = {
  id: string
  text: string
  html?: string
}

type ModulePart = {
  partNumber: number
  passageHtml?: string
  questions: DisplayQuestion[]
}

function normalizeModule(rawValue?: string | null, fallbackRawValue?: string | null): ModuleName | null {
  const value = `${rawValue ?? ''} ${fallbackRawValue ?? ''}`.toLowerCase().trim()
  if (value.includes('listening')) {
    return 'listening'
  }
  if (value.includes('course material') || value.includes('course-material')) {
    return 'listening'
  }
  if (value.includes('reading')) {
    return 'reading'
  }
  if (value.includes('writing')) {
    return 'writing'
  }
  return null
}

function parsePartNumber(question: BackendQuestion, module: ModuleName): number {
  if (module === 'listening') {
    const fromListeningPart = Number(question.listeningPart ?? 1)
    if (Number.isFinite(fromListeningPart) && fromListeningPart > 0) {
      return fromListeningPart
    }
  }
  const fromPartId = Number((question.partId ?? '').replace(/[^\d]/g, ''))
  if (Number.isFinite(fromPartId) && fromPartId > 0) {
    return fromPartId
  }
  const fromText = `${question.sourceMaterial ?? ''} ${question.title ?? ''} ${question.question ?? ''}`
    .match(/\bpart\s*(\d{1,2})\b/i)
  if (fromText) {
    const parsed = Number(fromText[1])
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }
  return 1
}

function resolveAudioUrl(raw?: string): string | undefined {
  if (!raw) {
    return undefined
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }
  const base = graphqlUrl.replace(/\/graphql$/, '')
  return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`
}

function normalizeText(value?: string | null): string {
  return (value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveQuestionText(item: BackendQuestion, fallbackIndex: number): string {
  const candidates = [
    normalizeText(item.sourceMaterial),
    normalizeText(item.question),
    normalizeText(item.title),
    normalizeText(item.instruction),
    normalizeText(item.explanation),
  ]
  const found = candidates.find((text) => text.length > 0)
  return found ?? `Question ${fallbackIndex}`
}

function countListeningQuestions(item: BackendQuestion): number {
  const html = String(item.sourceMaterial ?? '')
  let max = 0
  for (const match of html.matchAll(/\[(\d{1,3})\]/g)) {
    const n = Number(match[1])
    if (Number.isFinite(n)) max = Math.max(max, n)
  }
  for (const match of html.matchAll(/\bQ(\d{1,3})\b/gi)) {
    const n = Number(match[1])
    if (Number.isFinite(n)) max = Math.max(max, n)
  }
  const optionsCount = item.options?.length ?? 0
  return Math.max(1, max, optionsCount)
}

function formatRemainingTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

function formatListeningHtmlForExam(
  rawHtml: string,
  keyPrefix: string,
): string {
  const escapeAttr = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  /** Stable keys: same source HTML + keyPrefix must always yield the same data-blank-key (see blankValues sync). */
  const toBlankInput = (label: string, storageKey: string) => {
    const cleanLabel = (label || '').trim() || 'Answer'
    const questionNumber = cleanLabel.match(/\d+/)?.[0] ?? cleanLabel
    const safeLabel = escapeAttr(questionNumber)
    const safeKey = escapeAttr(storageKey)
    return `<span class="ielts-blank-inline"><input class="ielts-blank-input" data-blank-key="${safeKey}" type="text" placeholder="${safeLabel}" aria-label="Question ${safeLabel} answer" /></span>`
  }

  if (typeof window !== 'undefined') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${rawHtml}</div>`, 'text/html')
    const root = doc.body.firstElementChild
    if (root) {
      root.querySelectorAll('span[data-type="blank-answer"]').forEach((node, spanIndex) => {
        const id = (node.getAttribute('data-id') || 'Q1').trim() || 'Q1'
        const idSlug = id.replace(/[^a-zA-Z0-9_-]+/g, '_')
        const storageKey = `${keyPrefix}:blank:${spanIndex}:${idSlug}`
        const wrapper = doc.createElement('span')
        wrapper.innerHTML = toBlankInput(id, storageKey)
        node.replaceWith(wrapper)
      })
      root.querySelectorAll('input').forEach((node, index) => {
        const asInput = node as HTMLInputElement
        const originalType = (asInput.getAttribute('type') || asInput.type || 'text').toLowerCase()
        const isChoiceInput = originalType === 'radio' || originalType === 'checkbox'
        if (!isChoiceInput) {
          asInput.type = 'text'
        }
        asInput.disabled = false
        asInput.readOnly = false
        if (!isChoiceInput) {
          asInput.classList.add('ielts-blank-input')
        }

        const existingKey = asInput.getAttribute('data-blank-key')?.trim()
        if (!isChoiceInput && !existingKey) {
          asInput.setAttribute('data-blank-key', `${keyPrefix}:dom:${index}`)
        }

        const rawLabel =
          asInput.getAttribute('placeholder') ||
          asInput.getAttribute('aria-label') ||
          `${index + 1}`
        const onlyNumber = rawLabel.match(/\d+/)?.[0] ?? `${index + 1}`
        if (!isChoiceInput) {
          asInput.setAttribute('placeholder', onlyNumber)
          asInput.setAttribute('aria-label', `Question ${onlyNumber} answer`)
        }
      })
      rawHtml = root.innerHTML
    }
  }

  const bracketOccurrence: Record<string, number> = {}
  rawHtml = rawHtml.replace(/\[(\d+)\]/g, (_match, n: string) => {
    const nextOcc = (bracketOccurrence[n] ?? 0) + 1
    bracketOccurrence[n] = nextOcc
    const storageKey =
      nextOcc === 1 ? `${keyPrefix}:slot:${n}` : `${keyPrefix}:slot:${n}:x${nextOcc}`
    return toBlankInput(n, storageKey)
  })
  let underlineSeq = 0
  rawHtml = rawHtml.replace(/_{4,}/g, () => {
    underlineSeq += 1
    return toBlankInput(String(underlineSeq), `${keyPrefix}:line:${underlineSeq}`)
  })
  return rawHtml
}

export function StudentExamPlayerPage() {
  const navigate = useNavigate()
  const userName = useAppSelector(selectUserName)
  const [searchParams] = useSearchParams()
  const { data, loading, error } = useQuery<{ findAllQuestions: BackendQuestion[] }>(
    FIND_ALL_QUESTIONS_QUERY,
  )
  const examId = searchParams.get('examId')?.trim() ?? ''
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const listeningContentRef = useRef<HTMLDivElement | null>(null)
  const moduleContentRef = useRef<HTMLDivElement | null>(null)
  const splitContainerRef = useRef<HTMLDivElement | null>(null)
  const isResizingRef = useRef(false)

  const [moduleIndex, setModuleIndex] = useState(0)
  const [part, setPart] = useState(1)
  const [activeQuestion, setActiveQuestion] = useState('1')
  const [secondsLeft, setSecondsLeft] = useState(MODULE_DURATION_SECONDS.listening)
  const [listeningStarted, setListeningStarted] = useState(false)
  const [listeningPlayed, setListeningPlayed] = useState(false)
  const [blankValues, setBlankValues] = useState<Record<string, string>>({})
  const blankValuesRef = useRef(blankValues)
  blankValuesRef.current = blankValues
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({})
  const [splitLeftWidth, setSplitLeftWidth] = useState(50)
  const [finishModalOpen, setFinishModalOpen] = useState(false)
  const [submittedAtLabel, setSubmittedAtLabel] = useState('')
  const skipAutoAdvanceRef = useRef(true)

  const activeModule = MODULE_ORDER[moduleIndex] ?? 'writing'
  const previousModuleRef = useRef<ModuleName>(activeModule)
  const examQuestions = useMemo(() => {
    const allQuestions = data?.findAllQuestions ?? []
    const byExam = allQuestions.filter((item) => (examId ? (item.examId ?? '').toString() === examId : true))
    return byExam.length > 0 ? byExam : allQuestions
  }, [data?.findAllQuestions, examId])
  const summaryCandidateName = userName?.trim() || 'Test Taker'
  const summaryTestName = useMemo(() => {
    const firstTitle = examQuestions.find((item) => (item.title ?? '').trim())?.title?.trim() ?? ''
    if (!firstTitle) {
      return 'IELTS Mock'
    }
    return firstTitle.split('—')[0]?.trim() || firstTitle
  }, [examQuestions])
  const summaryDuration = useMemo(() => {
    const placementMinutes = examQuestions.find((item) => Number(item.placementNumber) > 0)?.placementNumber
    if (placementMinutes && Number.isFinite(Number(placementMinutes))) {
      return `${Math.floor(Number(placementMinutes))}:00`
    }
    return formatRemainingTime(MODULE_DURATION_SECONDS[activeModule])
  }, [activeModule, examQuestions])

  const moduleData = useMemo(() => {
    const grouped: Record<ModuleName, ModulePart[]> = { listening: [], reading: [], writing: [] }
    const audioByModule: Partial<Record<ModuleName, string>> = {}
    const durationByModule: Partial<Record<ModuleName, number>> = {}
    const allQuestions = data?.findAllQuestions ?? []
    const sourceByExamId = allQuestions.filter((item) =>
      examId ? (item.examId ?? '').toString() === examId : true,
    )
    // If examId filter returns nothing, fallback to all questions.
    const source = sourceByExamId.length > 0 ? sourceByExamId : allQuestions

    const questionsByModuleAndPart: Record<ModuleName, Record<number, BackendQuestion[]>> = {
      listening: {},
      reading: {},
      writing: {},
    }

    source.forEach((item) => {
      const module =
        normalizeModule(item.ieltsModule, item.type) ??
        (item.listeningPart ? 'listening' : null)
      if (!module) {
        return
      }
      const partNumber = parsePartNumber(item, module)
      if (!questionsByModuleAndPart[module][partNumber]) {
        questionsByModuleAndPart[module][partNumber] = []
      }
      questionsByModuleAndPart[module][partNumber].push(item)
      if (!audioByModule[module] && item.listeningAudio?.trim()) {
        audioByModule[module] = resolveAudioUrl(item.listeningAudio.trim())
      }
      const placementMinutes = Number(item.placementNumber)
      if (!durationByModule[module] && Number.isFinite(placementMinutes) && placementMinutes > 0) {
        durationByModule[module] = Math.floor(placementMinutes * 60)
      }
    })

    MODULE_ORDER.forEach((module) => {
      const moduleParts = Object.keys(questionsByModuleAndPart[module])
        .map(Number)
        .filter((num) => Number.isFinite(num) && num > 0)
        .sort((a, b) => a - b)

      if (moduleParts.length === 0) {
        grouped[module] = []
        return
      }

      grouped[module] = moduleParts.map((partNumber) => {
        const questions = questionsByModuleAndPart[module][partNumber] ?? []
        const orderedQuestions = [...questions].sort((a, b) => {
          const aPlacement = Number(a.placementNumber ?? Number.MAX_SAFE_INTEGER)
          const bPlacement = Number(b.placementNumber ?? Number.MAX_SAFE_INTEGER)
          if (aPlacement !== bPlacement) {
            return aPlacement - bPlacement
          }
          return a._id.localeCompare(b._id)
        })

        if (module === 'listening' && orderedQuestions.length === 1) {
          const source = orderedQuestions[0]
          const count = countListeningQuestions(source)
          return {
            partNumber,
            questions: Array.from({ length: count }, (_, idx) => ({
              id: String(idx + 1),
              text: resolveQuestionText(source, idx + 1),
              html: idx === 0 ? source.sourceMaterial?.trim() || undefined : undefined,
            })),
          }
        }

        const partPassage =
          module === 'reading' || module === 'writing'
            ? orderedQuestions.find((q) => (q.passageHtml ?? '').trim())?.passageHtml?.trim() ||
              orderedQuestions.find((q) => (q.sourceMaterial ?? '').trim())?.sourceMaterial?.trim() ||
              undefined
            : undefined

        return {
          partNumber,
          passageHtml: partPassage,
          questions: orderedQuestions.map((q, idx) => ({
            id: String(idx + 1),
            text: resolveQuestionText(q, idx + 1),
            html:
              module === 'reading'
                ? q.questionsHtml?.trim() || q.sourceMaterial?.trim() || undefined
                : q.sourceMaterial?.trim() || undefined,
          })),
        }
      })
    })

    return { grouped, audioByModule, durationByModule }
  }, [data?.findAllQuestions, examId])

  const activeParts = moduleData.grouped[activeModule] ?? []
  const visibleParts = useMemo(() => {
    const expectedCount = MODULE_PART_COUNTS[activeModule] ?? activeParts.length
    const byPartNumber = new Map(activeParts.map((item) => [item.partNumber, item]))
    return Array.from({ length: expectedCount }, (_, index) => {
      const partNumber = index + 1
      return (
        byPartNumber.get(partNumber) ?? {
          partNumber,
          questions: [],
        }
      )
    })
  }, [activeModule, activeParts])
  const currentPartQuestions =
    visibleParts.find((item) => item.partNumber === part)?.questions ?? []
  const currentPartPassage =
    visibleParts.find((item) => item.partNumber === part)?.passageHtml ?? undefined
  const currentQuestionIds = currentPartQuestions.map((item) => item.id)
  const currentWritingKey = `writing-part-${part}`
  const currentWritingAnswer = writingAnswers[currentWritingKey] ?? ''
  const currentWritingWordCount = currentWritingAnswer.trim()
    ? currentWritingAnswer.trim().split(/\s+/).filter(Boolean).length
    : 0
  const hasAnyQuestions = MODULE_ORDER.some((module) => (moduleData.grouped[module] ?? []).length > 0)

  useEffect(() => {
    const firstPart = visibleParts[0]?.partNumber ?? 1
    setPart((prev) =>
      visibleParts.some((item) => item.partNumber === prev) ? prev : firstPart,
    )
  }, [visibleParts])

  useEffect(() => {
    if (!currentQuestionIds.includes(activeQuestion)) {
      setActiveQuestion(currentQuestionIds[0] ?? '1')
    }
  }, [activeQuestion, currentQuestionIds])

  useEffect(() => {
    const moduleDuration =
      activeModule === 'reading'
        ? 60 * 60
        : moduleData.durationByModule[activeModule] ?? MODULE_DURATION_SECONDS[activeModule]
    skipAutoAdvanceRef.current = true
    setSecondsLeft(moduleDuration)
  }, [activeModule, moduleData.durationByModule])

  useEffect(() => {
    const previousModule = previousModuleRef.current
    if (previousModule === 'listening' && activeModule !== 'listening' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    previousModuleRef.current = activeModule
  }, [activeModule])

  useEffect(() => {
    const shouldRunTimer = activeModule !== 'listening' || listeningStarted
    if (!shouldRunTimer) {
      return
    }
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [activeModule, listeningStarted])

  useEffect(() => {
    if (skipAutoAdvanceRef.current) {
      skipAutoAdvanceRef.current = false
      return
    }

    if (secondsLeft > 0) {
      return
    }

    if (activeModule === 'writing') {
      if (!finishModalOpen) {
        setSubmittedAtLabel(
          new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        )
        setFinishModalOpen(true)
      }
      return
    }

    const nextModuleIndex = moduleIndex + 1
    if (nextModuleIndex >= MODULE_ORDER.length) {
      return
    }

    if (activeModule === 'listening' && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const nextModule = MODULE_ORDER[nextModuleIndex]
    const nextParts = moduleData.grouped[nextModule] ?? []
    const firstPart = nextParts[0]

    setModuleIndex(nextModuleIndex)
    setPart(firstPart?.partNumber ?? 1)
    setActiveQuestion(firstPart?.questions[0]?.id ?? '1')
  }, [activeModule, finishModalOpen, moduleData.grouped, moduleIndex, secondsLeft])

  const handleStartListening = async () => {
    if (listeningStarted) {
      return
    }
    setListeningStarted(true)

    const rawAudio = moduleData.audioByModule.listening
    if (!rawAudio || listeningPlayed) {
      return
    }
    try {
      if (audioRef.current) {
        audioRef.current.src = rawAudio
        await audioRef.current.play()
        setListeningPlayed(true)
      }
    } catch {
      // Ignore playback failures and continue timer flow.
    }
  }

  const activeQuestionIndex = currentQuestionIds.indexOf(activeQuestion)
  /** Content-based key so Apollo/new object refs do not re-run HTML transform every tick (which wipes inputs). */
  const listeningHtmlSourceKey =
    activeModule === 'listening'
      ? `${part}|${currentPartQuestions.map((q) => `${q.id}\u0001${q.html ?? ''}`).join('\u0002')}`
      : ''
  const listeningHtml = useMemo(() => {
    if (activeModule !== 'listening') {
      return null
    }
    const chunks = currentPartQuestions
      .map((question) => question.html?.trim())
      .filter((value): value is string => Boolean(value))
    if (chunks.length === 0) {
      return null
    }
    // listeningHtmlSourceKey already captures id+html; deps omit currentPartQuestions to avoid Apollo ref churn.
    return chunks
      .map((chunk, index) => formatListeningHtmlForExam(chunk, `part-${part}-chunk-${index}`))
      .join('<hr style="border:none;border-top:1px solid #d7d7d7;margin:12px 0;" />')
  }, [activeModule, part, listeningHtmlSourceKey])

  useEffect(() => {
    const container = listeningContentRef.current
    if (!container) {
      return
    }

    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input.ielts-blank-input'),
    )
    const unsubscribers = inputs.map((input) => {
      const key = input.dataset.blankKey
      if (!key) {
        return () => {}
      }

      input.disabled = false
      input.readOnly = false
      input.style.pointerEvents = 'auto'

      const savedValue = blankValuesRef.current[key] ?? ''
      input.value = savedValue

      const handleInput = () => {
        const value = input.value
        setBlankValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
      }

      input.addEventListener('input', handleInput)
      input.addEventListener('change', handleInput)

      return () => {
        input.removeEventListener('input', handleInput)
        input.removeEventListener('change', handleInput)
      }
    })

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [listeningHtml])

  useEffect(() => {
    const container = moduleContentRef.current
    if (!container) {
      return
    }

    container.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
      const inputType = (input.getAttribute('type') || input.type || 'text').toLowerCase()
      input.disabled = false
      input.readOnly = false
      if (inputType !== 'radio' && inputType !== 'checkbox') {
        input.type = 'text'
      }
      input.style.pointerEvents = 'auto'
    })
  }, [activeModule, currentPartQuestions])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isResizingRef.current || !splitContainerRef.current) {
        return
      }
      const rect = splitContainerRef.current.getBoundingClientRect()
      if (rect.width <= 0) {
        return
      }
      const rawPercent = ((event.clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(75, Math.max(25, rawPercent))
      setSplitLeftWidth((prev) => (Math.abs(prev - clamped) < 0.1 ? prev : clamped))
    }

    const handlePointerUp = () => {
      isResizingRef.current = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  const activePartIndex = visibleParts.findIndex((item) => item.partNumber === part)
  const canGoToNextModule = moduleIndex < MODULE_ORDER.length - 1
  const moduleInstructionPrefix =
    activeModule === 'listening'
      ? 'Listen and answer questions'
      : activeModule === 'reading'
        ? 'Read and answer questions'
        : 'Write responses for questions'

  const handleGoToNextModule = () => {
    if (!canGoToNextModule) {
      return
    }
    const nextModuleIndex = moduleIndex + 1
    const nextModule = MODULE_ORDER[nextModuleIndex]
    const nextParts = moduleData.grouped[nextModule] ?? []
    const firstPart = nextParts[0]
    setModuleIndex(nextModuleIndex)
    setPart(firstPart?.partNumber ?? 1)
    setActiveQuestion(firstPart?.questions[0]?.id ?? '1')
  }

  const handleCompleteModule = () => {
    if (activeModule === 'reading') {
      const writingIndex = MODULE_ORDER.indexOf('writing')
      if (writingIndex >= 0) {
        const writingParts = moduleData.grouped.writing ?? []
        const firstPart = writingParts[0]
        setModuleIndex(writingIndex)
        setPart(firstPart?.partNumber ?? 1)
        setActiveQuestion(firstPart?.questions[0]?.id ?? '1')
        return
      }
    }
    if (activeModule === 'writing') {
      setSubmittedAtLabel(
        new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
      setFinishModalOpen(true)
      return
    }
    handleGoToNextModule()
  }

  const handleMoveQuestion = (direction: -1 | 1) => {
    const currentIndex = activeQuestionIndex < 0 ? 0 : activeQuestionIndex
    const nextIndex = currentIndex + direction

    if (nextIndex >= 0 && nextIndex < currentQuestionIds.length) {
      setActiveQuestion(currentQuestionIds[nextIndex] ?? currentQuestionIds[0] ?? '1')
      return
    }

    if (direction === 1) {
      const nextPart = visibleParts[activePartIndex + 1]
      if (!nextPart) {
        return
      }
      setPart(nextPart.partNumber)
      setActiveQuestion(nextPart.questions[0]?.id ?? '1')
      return
    }

    const prevPart = visibleParts[activePartIndex - 1]
    if (!prevPart) {
      return
    }
    setPart(prevPart.partNumber)
    setActiveQuestion(prevPart.questions[prevPart.questions.length - 1]?.id ?? '1')
  }

  const moduleLabel = activeModule.charAt(0).toUpperCase() + activeModule.slice(1)
  const timeLeftLabel = formatRemainingTime(secondsLeft)

  return (
    <StudentExamPlayerRoot>
      <audio ref={audioRef} preload="auto" />

      <StudentExamPlayerHeader
        moduleLabel={moduleLabel}
        isListeningAudioPlaying={activeModule === 'listening' && listeningStarted}
        timeLeftLabel={timeLeftLabel}
      />

      <Box className="student-exam-player__main">
        {currentPartQuestions.length > 0 ? (
          <Box className="student-exam-player__part-banner">
            <Typography className="student-exam-player__part-title">Part {part}</Typography>
            <Typography className="student-exam-player__part-desc">
              {moduleInstructionPrefix} {currentQuestionIds[0] ?? 1}–{currentQuestionIds[currentQuestionIds.length - 1] ?? 1}.
            </Typography>
          </Box>
        ) : null}

        {activeModule === 'listening' && !listeningStarted ? (
          <ListeningStartOverlay onPlay={() => void handleStartListening()} />
        ) : null}

        {loading ? (
          <Typography className="student-exam-player__loading-text">Questions loading...</Typography>
        ) : error ? (
          <Typography className="student-exam-player__error-text">Questions yuklanmadi: {error.message}</Typography>
        ) : !hasAnyQuestions ? (
          <Box className="student-exam-player__empty-state">
            <Typography className="student-exam-player__empty-title">Not Found</Typography>
            <Typography className="student-exam-player__empty-sub">Bu exam uchun savollar topilmadi.</Typography>
          </Box>
        ) : activeModule === 'listening' ? (
          listeningHtml ? (
            <Box
              ref={listeningContentRef}
              className="student-exam-player__prose student-exam-player__prose--listening"
              dangerouslySetInnerHTML={{ __html: listeningHtml }}
            />
          ) : (
            <Typography className="student-exam-player__muted">Listening part content mavjud emas.</Typography>
          )
        ) : activeModule === 'reading' ? (
          <Box ref={splitContainerRef} className="student-exam-player__split">
            <Box
              className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
              style={{ width: `${splitLeftWidth}%` }}
            >
              {currentPartPassage ? (
                <Box dangerouslySetInnerHTML={{ __html: currentPartPassage }} />
              ) : (
                <Typography className="student-exam-player__passage-muted">Passage content mavjud emas.</Typography>
              )}
            </Box>
            <Box
              role="separator"
              aria-orientation="vertical"
              className="student-exam-player__resize-handle"
              onPointerDown={(event) => {
                event.preventDefault()
                isResizingRef.current = true
              }}
            >
              <Box className="student-exam-player__resize-knob">↔</Box>
            </Box>
            <Box
              ref={moduleContentRef}
              className="student-exam-player__split-pane student-exam-player__split-pane--side"
              style={{ width: `${100 - splitLeftWidth}%` }}
            >
              {currentPartQuestions.map((question) => (
                <Box key={question.id} className="student-exam-player__question-row">
                  <Typography className="student-exam-player__question-num">{question.id}.</Typography>
                  <Box className="student-exam-player__question-body">
                    {question.html ? (
                      <Box
                        className="student-exam-player__prose student-exam-player__prose--question"
                        dangerouslySetInnerHTML={{ __html: question.html }}
                      />
                    ) : (
                      <Typography className="student-exam-player__question-text">{question.text}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : activeModule === 'writing' ? (
          <Box ref={splitContainerRef} className="student-exam-player__split">
            <Box
              className="student-exam-player__split-pane student-exam-player__split-pane--passage student-exam-player__prose"
              style={{ width: `${splitLeftWidth}%` }}
            >
              {currentPartPassage ? (
                <Box dangerouslySetInnerHTML={{ __html: currentPartPassage }} />
              ) : (
                <Typography className="student-exam-player__passage-muted">Passage content mavjud emas.</Typography>
              )}
            </Box>
            <Box
              role="separator"
              aria-orientation="vertical"
              className="student-exam-player__resize-handle"
              onPointerDown={(event) => {
                event.preventDefault()
                isResizingRef.current = true
              }}
            >
              <Box className="student-exam-player__resize-knob">↔</Box>
            </Box>

            <Box
              className="student-exam-player__split-pane student-exam-player__split-pane--side"
              style={{ width: `${100 - splitLeftWidth}%` }}
            >
              <Box className="student-exam-player__writing-head">
                <Typography className="student-exam-player__writing-title">Your answer</Typography>
                <Typography className="student-exam-player__writing-count">
                  Words: {currentWritingWordCount}
                </Typography>
              </Box>
              <Box
                component="textarea"
                className="student-exam-player__writing-textarea"
                value={currentWritingAnswer}
                onChange={(event) => {
                  const value = event.target.value
                  setWritingAnswers((prev) =>
                    prev[currentWritingKey] === value ? prev : { ...prev, [currentWritingKey]: value },
                  )
                }}
                placeholder="Yozing..."
              />
            </Box>
          </Box>
        ) : (
          <Box ref={moduleContentRef} className="student-exam-player__module-stack">
            {currentPartQuestions.map((question) => (
              <Box key={question.id} className="student-exam-player__question-row student-exam-player__question-row--center">
                <Typography className="student-exam-player__question-num">{question.id}.</Typography>
                <Box className="student-exam-player__question-body">
                  {question.html ? (
                    <Box
                      className="student-exam-player__prose student-exam-player__prose--question"
                      dangerouslySetInnerHTML={{ __html: question.html }}
                    />
                  ) : (
                    <Typography className="student-exam-player__question-text">{question.text}</Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {hasAnyQuestions ? (
          <Box className="student-exam-player__fab-wrap">
            <Box className="student-exam-player__fab-inner">
              <IconButton
                size="small"
                className="student-exam-player__nav-btn"
                onClick={() => handleMoveQuestion(-1)}
                disabled={activePartIndex <= 0 && activeQuestionIndex <= 0}
              >
                <Typography className="student-exam-player__nav-arrow">&larr;</Typography>
              </IconButton>
              <IconButton
                size="small"
                className="student-exam-player__nav-btn"
                onClick={() => handleMoveQuestion(1)}
                disabled={
                  activePartIndex >= visibleParts.length - 1 &&
                  activeQuestionIndex >= currentQuestionIds.length - 1
                }
              >
                <Typography className="student-exam-player__nav-arrow">&rarr;</Typography>
              </IconButton>
            </Box>
          </Box>
        ) : null}
      </Box>

      <Box className="student-exam-player__footer">
        {visibleParts.map((partItem) => {
          const isCurrent = partItem.partNumber === part
          const isCompletionPart =
            (activeModule === 'listening' && partItem.partNumber === 4) ||
            (activeModule === 'reading' && partItem.partNumber === 3) ||
            (activeModule === 'writing' && partItem.partNumber === 2)
          return (
            <Box
              key={partItem.partNumber}
              className={`student-exam-player__part-tab${isCurrent ? ' student-exam-player__part-tab--current' : ''}`}
              onClick={() => {
                if (isCurrent) return
                setPart(partItem.partNumber)
                setActiveQuestion(partItem.questions[0]?.id ?? '1')
              }}
            >
              {isCurrent ? (
                <>
                  <Typography className="student-exam-player__part-tab-title">Part {partItem.partNumber}</Typography>
                  <Box className="student-exam-player__part-tab-row">
                    <Box className="student-exam-player__part-tab-chips">
                      {partItem.questions.map((question) => (
                        <Box
                          key={`${partItem.partNumber}-${question.id}`}
                          className={`student-exam-player__q-chip${
                            question.id === activeQuestion ? ' student-exam-player__q-chip--active' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveQuestion(question.id)
                          }}
                        >
                          {question.id}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography className="student-exam-player__part-tab-idle">
                  Part {partItem.partNumber} &nbsp;&nbsp;0 of {partItem.questions.length}
                </Typography>
              )}
              {isCompletionPart ? (
                <Box className="student-exam-player__complete-cell">
                  <IconButton
                    size="small"
                    className="student-exam-player__complete-btn"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleCompleteModule()
                    }}
                    disabled={
                      activeModule === 'writing' && partItem.partNumber === 2 ? false : !canGoToNextModule
                    }
                  >
                    <Typography className="student-exam-player__complete-check">✓</Typography>
                  </IconButton>
                </Box>
              ) : null}
            </Box>
          )
        })}
      </Box>

      <StudentExamFinishModal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        summaryCandidateName={summaryCandidateName}
        summaryTestName={summaryTestName}
        summaryDuration={summaryDuration}
        submittedAtLabel={submittedAtLabel}
        onContinue={() => {
          setFinishModalOpen(false)
          navigate(ROUTES_PATH.dashboard)
        }}
      />
    </StudentExamPlayerRoot>
  )
}
