import { MODULE_ORDER, MODULE_PART_COUNTS, type ModuleName } from '../constants'
import type { ModuleDataResult } from '../hooks/useExamData'

export const EXAM_SESSION_VERSION = 1
const STORAGE_PREFIX = 'ielts-student-exam:'

export type ExamSessionNavigation = {
  moduleIndex: number
  part: number
  activeQuestion: string
}

export type ExamSessionSnapshot = {
  version: typeof EXAM_SESSION_VERSION
  examId: string
  savedAt: string
  questionIdsKey: string
  navigation: ExamSessionNavigation
  listeningStarted: boolean
  listeningPlayed: boolean
  blankValues: Record<string, string>
  choiceValues: Record<string, string>
  dragDropValues: Record<string, string>
  writingAnswers: Record<string, string>
}

export type ExamSessionInitial = Pick<
  ExamSessionSnapshot,
  | 'navigation'
  | 'listeningStarted'
  | 'listeningPlayed'
  | 'blankValues'
  | 'choiceValues'
  | 'dragDropValues'
  | 'writingAnswers'
>

export function getExamSessionStorageKey(examId: string): string {
  return `${STORAGE_PREFIX}${examId}`
}

export function createQuestionIdsKey(questionIds?: string[]): string {
  if (!questionIds?.length) return ''
  return [...questionIds].sort().join('|')
}

export function loadExamSession(examId: string): ExamSessionSnapshot | null {
  if (!examId || typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(getExamSessionStorageKey(examId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as ExamSessionSnapshot
    if (parsed.version !== EXAM_SESSION_VERSION || parsed.examId !== examId) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveExamSession(examId: string, snapshot: ExamSessionSnapshot): void {
  if (!examId || typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(getExamSessionStorageKey(examId), JSON.stringify(snapshot))
  } catch {
    // Ignore quota / private mode errors
  }
}

export function clearExamSession(examId: string): void {
  if (!examId || typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(getExamSessionStorageKey(examId))
  } catch {
    // Ignore
  }
}

function defaultVisibleParts(module: ModuleName, moduleData: ModuleDataResult) {
  const fromData = moduleData.grouped[module] ?? []
  if (fromData.length > 0) return fromData
  const expectedCount = MODULE_PART_COUNTS[module] ?? 0
  return Array.from({ length: expectedCount }, (_, index) => ({
    partNumber: index + 1,
    questions: [] as { id: string }[],
  }))
}

export function resolveExamSessionInitial(
  snapshot: ExamSessionSnapshot | null,
  examId: string,
  questionIds: string[] | undefined,
  moduleData: ModuleDataResult,
): ExamSessionInitial | null {
  if (!snapshot || snapshot.examId !== examId) return null

  const questionIdsKey = createQuestionIdsKey(questionIds)
  if (questionIdsKey && snapshot.questionIdsKey && snapshot.questionIdsKey !== questionIdsKey) {
    return null
  }

  const moduleIndex = Math.min(
    Math.max(0, snapshot.navigation.moduleIndex),
    MODULE_ORDER.length - 1,
  )
  const activeModule = MODULE_ORDER[moduleIndex] ?? 'listening'
  const visibleParts = defaultVisibleParts(activeModule, moduleData)

  const partExists = visibleParts.some((item) => item.partNumber === snapshot.navigation.part)
  const part = partExists
    ? snapshot.navigation.part
    : (visibleParts.find((item) => item.questions.length > 0)?.partNumber ??
      visibleParts[0]?.partNumber ??
      1)

  const currentPart = visibleParts.find((item) => item.partNumber === part)
  const moduleQuestions = visibleParts.flatMap((item) => item.questions)
  const questionInPart = currentPart?.questions.some((q) => q.id === snapshot.navigation.activeQuestion)
  const questionInModule = moduleQuestions.some((q) => q.id === snapshot.navigation.activeQuestion)

  let activeQuestion = snapshot.navigation.activeQuestion
  if (questionInPart) {
    // keep restored question
  } else if (currentPart?.questions.length) {
    activeQuestion = currentPart.questions[0].id
  } else if (questionInModule) {
    activeQuestion = snapshot.navigation.activeQuestion
  } else {
    activeQuestion =
      visibleParts.find((item) => item.questions.length > 0)?.questions[0]?.id ??
      moduleQuestions[0]?.id ??
      '1'
  }

  return {
    navigation: { moduleIndex, part, activeQuestion },
    listeningStarted: Boolean(snapshot.listeningStarted),
    listeningPlayed: Boolean(snapshot.listeningPlayed),
    blankValues: snapshot.blankValues ?? {},
    choiceValues: snapshot.choiceValues ?? {},
    dragDropValues: snapshot.dragDropValues ?? {},
    writingAnswers: snapshot.writingAnswers ?? {},
  }
}
