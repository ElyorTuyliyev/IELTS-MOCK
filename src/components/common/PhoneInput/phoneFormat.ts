const UZ_PHONE_DIGITS_LENGTH = 12

export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeUzPhoneDigits(digits: string): string {
  const d = stripPhoneDigits(digits)
  if (!d) return ''

  if (d.startsWith('998')) {
    return d.slice(0, UZ_PHONE_DIGITS_LENGTH)
  }

  if (d.startsWith('8') && d.length <= 10) {
    return (`998${d.slice(1)}`).slice(0, UZ_PHONE_DIGITS_LENGTH)
  }

  if (d.length <= 9) {
    return (`998${d}`).slice(0, UZ_PHONE_DIGITS_LENGTH)
  }

  return d.slice(0, UZ_PHONE_DIGITS_LENGTH)
}

export function formatUzPhone(value: string): string {
  const digits = normalizeUzPhoneDigits(value)
  if (!digits) return ''

  const local = digits.slice(3)
  let formatted = '+998'

  if (local.length === 0) return formatted

  formatted += `(${local.slice(0, 2)}`
  if (local.length < 2) return formatted

  formatted += ')'

  if (local.length > 2) {
    formatted += local.slice(2, 5)
  }

  if (local.length > 5) {
    formatted += `-${local.slice(5, 7)}`
  }

  if (local.length > 7) {
    formatted += `-${local.slice(7, 9)}`
  }

  return formatted
}

export function isCompleteUzPhone(value: string): boolean {
  return normalizeUzPhoneDigits(value).length === UZ_PHONE_DIGITS_LENGTH
}
