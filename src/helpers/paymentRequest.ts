import { graphqlUrl } from '../graphql/client'

export const uploadPaymentProofEndpoint = `${graphqlUrl.replace(/\/graphql$/, '')}/files/upload-payment-proof`

export function buildPaymentRequestUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) {
    return null
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalized}`
  }
  return normalized
}

export async function uploadPaymentProofWithToken(
  file: File,
  token: string,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('token', token)

  const response = await fetch(uploadPaymentProofEndpoint, {
    method: 'POST',
    body: formData,
  })

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(raw.trim() || 'Failed to upload payment screenshot')
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('Upload returned an empty response.')
  }

  if (trimmed.startsWith('/') || trimmed.startsWith('uploads/')) {
    return trimmed
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (typeof parsed === 'string') {
      return parsed
    }
    if (parsed && typeof parsed === 'object') {
      const record = parsed as { path?: string; url?: string }
      const path = record.path ?? record.url
      if (typeof path === 'string' && path.trim()) {
        return path.trim()
      }
    }
  } catch {
    /* plain-text path */
  }

  return trimmed
}
