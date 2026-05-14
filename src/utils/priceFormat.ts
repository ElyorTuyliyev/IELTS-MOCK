export function formatPriceValue(value: number | string): string {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) {
    return ''
  }
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function parsePriceValue(value: string): number {
  const digits = value.replace(/\s/g, '').replace(/\D/g, '')
  if (!digits) {
    return Number.NaN
  }
  return Number(digits)
}

export function formatPriceInSom(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0
  return `${formatPriceValue(safeValue)} UZS`
}
