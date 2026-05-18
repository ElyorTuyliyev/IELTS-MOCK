/** Stable storage key: `{mongoQuestionId}|{slotKey}` (e.g. `abc123|Q1`, `abc123|radio-1`). */
export function compositeAnswerStorageKey(questionId: string, slotKey: string): string {
  const qid = questionId.trim()
  const slot = slotKey.trim()
  if (!qid || !slot) return ''
  return `${qid}|${slot}`
}

export function tryParseCompositeAnswerStorageKey(
  key: string,
): { questionId: string; slotKey: string } | null {
  const sep = key.indexOf('|')
  if (sep <= 0) return null
  const questionId = key.slice(0, sep).trim()
  const slotKey = key.slice(sep + 1).trim()
  if (!questionId || !slotKey) return null
  return { questionId, slotKey }
}

export function slotKeyFromChoiceStorageKey(key: string): string | null {
  const radioChoiceMatch = key.match(/:choice:radio:(\d+)$/)
  if (radioChoiceMatch) {
    return `radio-${Number(radioChoiceMatch[1]) + 1}`
  }
  const legacyChoiceMatch = key.match(/:choice:(\d+)$/)
  if (legacyChoiceMatch) {
    const digits = legacyChoiceMatch[1].replace(/[^\d]/g, '')
    return digits ? `Q${digits}` : legacyChoiceMatch[1]
  }
  return null
}
