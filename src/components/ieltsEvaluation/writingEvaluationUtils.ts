import type { ReviewQuestion } from '@/pages/StudentExamReview/api/queries'
import type {
  IeltsWritingTaskType,
  ModuleEvaluationFormState,
  WritingEvaluationPayload,
  WritingTaskEvaluationData,
} from '@/types/ieltsEvaluation'

export function inferWritingTaskType(
  question: ReviewQuestion,
  index: number,
): IeltsWritingTaskType {
  const title = (question.title ?? '').toLowerCase()
  if (title.includes('task 2') || title.includes('task2') || title.includes('essay')) {
    return 'writing-task-2'
  }
  if (title.includes('task 1') || title.includes('task1')) {
    return 'writing-task-1'
  }
  return index === 0 ? 'writing-task-1' : 'writing-task-2'
}

export function createEmptyTaskFormState(): ModuleEvaluationFormState {
  return {
    categoryScores: {},
    feedback: '',
  }
}

export function parseWritingEvaluation(
  raw: string | null | undefined,
): WritingEvaluationPayload | null {
  if (!raw?.trim()) return null
  try {
    const parsed = JSON.parse(raw) as WritingEvaluationPayload
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function taskDataToFormState(
  data: WritingTaskEvaluationData | undefined,
): ModuleEvaluationFormState {
  if (!data) return createEmptyTaskFormState()
  return {
    categoryScores: { ...data.categoryScores },
    feedback: data.tutorFeedback ?? '',
  }
}

export function buildCombinedWritingFeedback(
  task1Feedback: string,
  task2Feedback: string,
): string | null {
  const parts = [
    task1Feedback.trim() ? `Task 1:\n${task1Feedback.trim()}` : '',
    task2Feedback.trim() ? `Task 2:\n${task2Feedback.trim()}` : '',
  ].filter(Boolean)

  return parts.length > 0 ? parts.join('\n\n') : null
}

export function computeModuleWritingScore(
  task1Band: number | null,
  task2Band: number | null,
): number | undefined {
  const bands = [task1Band, task2Band].filter(
    (score): score is number => score != null && Number.isFinite(score),
  )
  if (bands.length === 0) return undefined
  const average = bands.reduce((sum, score) => sum + score, 0) / bands.length
  return Math.round(average * 2) / 2
}
