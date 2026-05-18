const OVERALL_MODULE_COUNT = 4

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
