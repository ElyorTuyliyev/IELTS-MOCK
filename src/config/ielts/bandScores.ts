/** IELTS band scores from 0 to 9 in 0.5 increments. */
export const IELTS_BAND_SCORES: number[] = Array.from({ length: 19 }, (_, i) => i * 0.5)

export const IELTS_BAND_SCORE_OPTIONS = IELTS_BAND_SCORES.map((score) => ({
  value: String(score),
  label: Number.isInteger(score) ? String(score) : score.toFixed(1),
}))

/** Integer bands with official IELTS descriptor text (0–9). */
export const IELTS_DESCRIPTOR_BANDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export type IeltsDescriptorBand = (typeof IELTS_DESCRIPTOR_BANDS)[number]
