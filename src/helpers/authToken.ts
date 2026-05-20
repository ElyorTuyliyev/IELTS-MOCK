/** JWTs above this size often trigger HTTP 431 (header too large). */
export const MAX_AUTH_TOKEN_LENGTH = 8_192

export function isAuthTokenOversized(token: string | null | undefined) {
  return Boolean(token && token.length > MAX_AUTH_TOKEN_LENGTH)
}

export function isSafeAuthToken(token: string | null | undefined): token is string {
  return Boolean(token && !isAuthTokenOversized(token))
}
