export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const GMAIL_DOMAIN = 'gmail.com'

const GMAIL_TYPO_DOMAINS = new Set([
  'gamil.com',
  'gmial.com',
  'gmal.com',
  'gmil.com',
  'gnail.com',
  'gmai.com',
  'gmail.co',
  'gmail.con',
  'gmail.cm',
  'gmail.om',
  'gmailcom',
])

export const EMAIL_REQUIRED_MESSAGE = 'Email is required.'
export const EMAIL_INVALID_MESSAGE = 'Enter a valid email address.'
export const GMAIL_INVALID_MESSAGE = 'Gmail address must end with @gmail.com.'
export const GMAIL_TYPO_MESSAGE =
  'The email domain looks incorrect. Make sure gmail.com is spelled correctly.'

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

export function getEmailDomain(value: string): string {
  const normalized = normalizeEmail(value)
  const at = normalized.lastIndexOf('@')
  if (at < 0) return ''
  return normalized.slice(at + 1)
}

export function isValidEmail(value: string): boolean {
  const normalized = normalizeEmail(value)
  return normalized.length > 0 && EMAIL_REGEX.test(normalized)
}

export function isValidGmailAddress(value: string): boolean {
  return isValidEmail(value) && getEmailDomain(value) === GMAIL_DOMAIN
}

export function validateEmailField(value: string): true | string {
  if (!normalizeEmail(value)) {
    return EMAIL_REQUIRED_MESSAGE
  }
  if (!isValidEmail(value)) {
    return EMAIL_INVALID_MESSAGE
  }
  return true
}

export function validateGmailField(value: string): true | string {
  if (!normalizeEmail(value)) {
    return EMAIL_REQUIRED_MESSAGE
  }
  if (!isValidEmail(value)) {
    return EMAIL_INVALID_MESSAGE
  }

  const domain = getEmailDomain(value)
  if (GMAIL_TYPO_DOMAINS.has(domain)) {
    return GMAIL_TYPO_MESSAGE
  }
  if (domain !== GMAIL_DOMAIN) {
    return GMAIL_INVALID_MESSAGE
  }
  return true
}

export const emailRegisterRules = {
  required: EMAIL_REQUIRED_MESSAGE,
  validate: validateEmailField,
}

export const gmailRegisterRules = {
  required: EMAIL_REQUIRED_MESSAGE,
  validate: validateGmailField,
}
