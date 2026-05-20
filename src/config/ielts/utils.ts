import type { IeltsModuleDescriptorConfig } from '@/types/ieltsEvaluation'

/** Map half-band scores to the lower whole-band descriptor (IELTS convention). */
export function getDescriptorBand(score: number): number {
  return score % 1 === 0 ? score : Math.floor(score)
}

export function formatBandScore(score: number | null | undefined): string {
  if (score == null || !Number.isFinite(score)) return '—'
  return Number.isInteger(score) ? String(score) : score.toFixed(1)
}

export function computeOverallBand(
  scores: Array<number | null | undefined>,
): number | null {
  const valid = scores.filter(
    (score): score is number => score != null && Number.isFinite(score),
  )
  if (valid.length === 0) return null
  const average = valid.reduce((sum, score) => sum + score, 0) / valid.length
  return Math.round(average * 2) / 2
}

export function getCategoryDescriptor(
  config: IeltsModuleDescriptorConfig,
  categoryKey: string,
  score: number | null,
): string {
  if (score == null) {
    return 'Select a band score to view the official IELTS descriptor for this criterion.'
  }

  const wholeBand = getDescriptorBand(score)
  const descriptor = config.descriptors[categoryKey]?.[wholeBand]

  if (!descriptor) {
    return 'Descriptor not available for this band score.'
  }

  if (score % 1 !== 0) {
    const upper = Math.min(9, Math.ceil(score))
    return `Band ${formatBandScore(score)} (between Band ${wholeBand} and Band ${upper})\n\n${descriptor}`
  }

  return descriptor
}

export function areAllCategoriesSelected(
  categoryKeys: string[],
  scores: Partial<Record<string, number | null>>,
): boolean {
  return categoryKeys.every(
    (key) => scores[key] != null && Number.isFinite(scores[key]),
  )
}
