import type {
  ModuleEvaluationFormState,
  SpeakingEvaluationData,
  SpeakingEvaluationPayload,
} from '@/types/ieltsEvaluation'

export function createEmptyModuleFormState(): ModuleEvaluationFormState {
  return {
    categoryScores: {},
    feedback: '',
  }
}

export function parseSpeakingEvaluation(
  raw: string | null | undefined,
): SpeakingEvaluationPayload | null {
  if (!raw?.trim()) return null
  try {
    const parsed = JSON.parse(raw) as SpeakingEvaluationPayload
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function speakingDataToFormState(
  data: SpeakingEvaluationData | undefined,
): ModuleEvaluationFormState {
  if (!data) return createEmptyModuleFormState()
  return {
    categoryScores: { ...data.categoryScores },
    feedback: data.tutorFeedback ?? '',
  }
}
