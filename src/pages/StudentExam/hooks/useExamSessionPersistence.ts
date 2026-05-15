import { useEffect, useRef } from 'react'
import {
  clearExamSession,
  createQuestionIdsKey,
  EXAM_SESSION_VERSION,
  saveExamSession,
  type ExamSessionNavigation,
} from '../utils/examSessionPersistence'

type UseExamSessionPersistenceArgs = {
  examId: string
  enabled: boolean
  questionIds?: string[]
  navigation: ExamSessionNavigation
  listeningStarted: boolean
  listeningPlayed: boolean
  blankValues: Record<string, string>
  choiceValues: Record<string, string>
  dragDropValues: Record<string, string>
  writingAnswers: Record<string, string>
}

const SAVE_DEBOUNCE_MS = 400

export function useExamSessionPersistence({
  examId,
  enabled,
  questionIds,
  navigation,
  listeningStarted,
  listeningPlayed,
  blankValues,
  choiceValues,
  dragDropValues,
  writingAnswers,
}: UseExamSessionPersistenceArgs) {
  const hydratedRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      hydratedRef.current = false
      return
    }
    hydratedRef.current = true
  }, [enabled])

  useEffect(() => {
    if (!examId || !enabled || !hydratedRef.current) return

    const timer = window.setTimeout(() => {
      saveExamSession(examId, {
        version: EXAM_SESSION_VERSION,
        examId,
        savedAt: new Date().toISOString(),
        questionIdsKey: createQuestionIdsKey(questionIds),
        navigation,
        listeningStarted,
        listeningPlayed,
        blankValues,
        choiceValues,
        dragDropValues,
        writingAnswers,
      })
    }, SAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [
    blankValues,
    choiceValues,
    dragDropValues,
    enabled,
    examId,
    listeningPlayed,
    listeningStarted,
    navigation,
    questionIds,
    writingAnswers,
  ])
}

export { clearExamSession }
