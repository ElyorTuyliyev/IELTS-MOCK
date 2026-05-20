const OVERALL_MODULE_COUNT = 4

/** IELTS band 0–9 from correct/total, rounded to nearest 0.5 (IELTSDA-style). */
export function calculateBandScore(correct: number, total: number): number {
  if (total <= 0) return 0
  const ratio = correct / total
  const rawBand = ratio * 9
  return Math.round(rawBand * 2) / 2
}

/** Overall = (L + R + W + S) / 4, rounded to nearest 0.5 (matches backend). */
export function computeOverallModuleScore(
  listening?: number | null,
  reading?: number | null,
  writing?: number | null,
  speaking?: number | null,
): number {
  const sum =
    (Number(listening) || 0) +
    (Number(reading) || 0) +
    (Number(writing) || 0) +
    (Number(speaking) || 0)
  const avg = sum / OVERALL_MODULE_COUNT
  return Math.round(avg * 2) / 2
}

export function formatModuleScore(value?: number | null): string {
  if (value == null || !Number.isFinite(Number(value))) return '-'
  const n = Number(value)
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}
