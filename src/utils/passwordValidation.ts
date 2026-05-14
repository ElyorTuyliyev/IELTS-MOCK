export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 64

export const PASSWORD_REQUIRED_MESSAGE = 'Password is required.'
export const PASSWORD_INVALID_MESSAGE =
  'Password must be at least 8 characters and include at least one letter and one number.'

const HAS_LETTER_RE = /[a-zA-Z]/
const HAS_DIGIT_RE = /\d/

export function isValidPassword(value: string): boolean {
  const password = value.trim()
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return false
  }
  return HAS_LETTER_RE.test(password) && HAS_DIGIT_RE.test(password)
}

export function validatePasswordField(value: string): true | string {
  if (!value.trim()) {
    return PASSWORD_REQUIRED_MESSAGE
  }
  if (!isValidPassword(value)) {
    return PASSWORD_INVALID_MESSAGE
  }
  return true
}

export const passwordRegisterRules = {
  required: PASSWORD_REQUIRED_MESSAGE,
  validate: validatePasswordField,
}
