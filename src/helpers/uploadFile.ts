import { uploadEndpoint } from '../pages/AddQuestion/utils'

export async function uploadFileWithAuth(
  file: File,
  token: string,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const raw = await response.text()
  if (!response.ok) {
    throw new Error(raw.trim() || 'Failed to upload file')
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('File upload returned empty response.')
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
    /* plain-text path from Nest */
  }

  return trimmed
}
