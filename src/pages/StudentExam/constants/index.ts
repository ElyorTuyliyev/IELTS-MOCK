export const MODULE_ORDER = ['listening', 'reading', 'writing', 'speaking'] as const

export type ModuleName = (typeof MODULE_ORDER)[number]

export const MODULE_DURATION_SECONDS: Record<ModuleName, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
  speaking: 15 * 60,
}

export const MODULE_PART_COUNTS: Record<ModuleName, number> = {
  listening: 4,
  reading: 3,
  writing: 2,
  speaking: 1,
}

export function findFirstModuleIndexWithQuestions(
  grouped: Record<ModuleName, Array<{ questions: unknown[] }>>,
): number {
  for (let i = 0; i < MODULE_ORDER.length; i += 1) {
    const mod = MODULE_ORDER[i]
    if (grouped[mod]?.some((part) => part.questions.length > 0)) {
      return i
    }
  }
  return 0
}
