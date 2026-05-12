export const MODULE_ORDER = ['listening', 'reading', 'writing'] as const

export type ModuleName = (typeof MODULE_ORDER)[number]

export const MODULE_DURATION_SECONDS: Record<ModuleName, number> = {
  listening: 30 * 60,
  reading: 60 * 60,
  writing: 60 * 60,
}

export const MODULE_PART_COUNTS: Record<ModuleName, number> = {
  listening: 4,
  reading: 3,
  writing: 2,
}
