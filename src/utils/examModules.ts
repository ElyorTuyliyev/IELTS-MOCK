import type { IeltsModule } from '../pages/AddQuestion/AddQuestionPage.constants'

export type ExamModuleRefs = {
  listeningId?: string | null
  readingId?: string | null
  writingId?: string | null
  speakingId?: string | null
}

const MODULE_REF_KEYS: Record<IeltsModule, keyof ExamModuleRefs> = {
  Listening: 'listeningId',
  Reading: 'readingId',
  Writing: 'writingId',
  Speaking: 'speakingId',
}

export function resolveExamModuleId(
  exam: ExamModuleRefs | null | undefined,
  uiModule: IeltsModule,
): string | null {
  if (!exam) return null
  const id = exam[MODULE_REF_KEYS[uiModule]]
  return id != null && String(id).trim() !== '' ? String(id) : null
}
