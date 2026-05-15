/** `YYYY-MM-DD` for native `<input type="date">` from an ISO or parseable date string. */
export function isoToDateInputValue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Midnight local time as ISO string from `YYYY-MM-DD`. */
export function dateInputValueToIso(value: string): string {
  if (!value) {
    return ''
  }
  return new Date(`${value}T00:00:00`).toISOString()
}
