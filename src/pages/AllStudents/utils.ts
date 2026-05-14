import { formatShortDate } from '../../helpers/dateFormat'

export const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

export function decodeJwtPayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null

  const tokenParts = token.split('.')
  if (tokenParts.length < 2) return null

  try {
    const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

export function safeDateToIso(dateString: string): string {
  if (!dateString.trim()) return ''
  try {
    const date = new Date(`${dateString.trim()}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime())) return ''
    return date.toISOString()
  } catch {
    return ''
  }
}

export function formatCreationDate(isoDate: string): string {
  return formatShortDate(isoDate)
}

export function parseCreationDateTimestamp(formatted: string): number {
  const ts = new Date(formatted).getTime()
  return Number.isNaN(ts) ? 0 : ts
}
