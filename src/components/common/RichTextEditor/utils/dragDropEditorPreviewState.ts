/** Editor preview: chip placements survive nodeView remount / setContent within a session. */
const previewValuesByClientKey = new Map<string, Record<string, string>>()

export function getEditorDragDropPreviewValues(clientKey: string): Record<string, string> {
  const existing = previewValuesByClientKey.get(clientKey)
  if (existing) return existing
  const next: Record<string, string> = {}
  previewValuesByClientKey.set(clientKey, next)
  return next
}

export function mergeEditorDragDropPreviewValues(
  clientKey: string,
  captured: Record<string, string>,
): Record<string, string> {
  const target = getEditorDragDropPreviewValues(clientKey)
  for (const [key, value] of Object.entries(captured)) {
    if (value) target[key] = value
    else delete target[key]
  }
  return target
}

export function writeEditorDragDropPreviewValue(
  clientKey: string,
  key: string,
  value: string,
): void {
  const target = getEditorDragDropPreviewValues(clientKey)
  if (value) target[key] = value
  else delete target[key]
}
