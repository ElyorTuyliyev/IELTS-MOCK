import type { Editor } from '@tiptap/core'

function decodeHtmlAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

function htmlToPlainText(html: string): string {
  if (!html) return ''
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ')
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent ?? ''
}

/** Highest Q / gap / bracket question index found in one HTML fragment. */
export function maxQuestionNumberFromHtml(html: string): number {
  const source = String(html ?? '')
  if (!source.trim()) return 0

  const text = htmlToPlainText(source)
  let max = 0
  const bump = (n: number) => {
    if (Number.isFinite(n) && n > 0) max = Math.max(max, n)
  }

  for (const m of text.matchAll(/\[(\d{1,3})\]/g)) bump(Number(m[1]))
  for (const m of text.matchAll(/\bQ(\d{1,3})\b/gi)) bump(Number(m[1]))
  for (const m of source.matchAll(/data-id="Q(\d{1,4})"/gi)) bump(Number(m[1]))
  for (const m of source.matchAll(/\bQ(\d{1,4})\b/gi)) bump(Number(m[1]))
  for (const m of source.matchAll(/data-gaps="([^"]*)"/gi)) {
    try {
      const gaps = JSON.parse(decodeHtmlAttr(m[1])) as Array<{ id?: string }>
      if (Array.isArray(gaps)) {
        for (const gap of gaps) {
          const match = String(gap.id ?? '').match(/(?:Q|gap)(\d+)/i)
          if (match) bump(Number(match[1]))
        }
      }
    } catch {
      // ignore malformed gap JSON
    }
  }

  return max
}

export function maxQuestionNumberFromHtmlList(htmlParts: string[]): number {
  return htmlParts.reduce((max, html) => Math.max(max, maxQuestionNumberFromHtml(html)), 0)
}

export function nextQuestionNumberFromHtmlList(htmlParts: string[]): number {
  return Math.max(1, maxQuestionNumberFromHtmlList(htmlParts) + 1)
}

export function resolveNextQuestionNumber(
  editor: Editor,
  priorQuestionHtml: string[] = [],
): number {
  const currentHtml = editor.getHTML() ?? ''
  const currentText = editor.getText() ?? ''
  let max = maxQuestionNumberFromHtmlList(priorQuestionHtml)

  const bump = (n: number) => {
    if (Number.isFinite(n) && n > 0) max = Math.max(max, n)
  }
  for (const m of currentText.matchAll(/\[(\d{1,3})\]/g)) bump(Number(m[1]))
  for (const m of currentText.matchAll(/\bQ(\d{1,3})\b/gi)) bump(Number(m[1]))
  for (const m of currentHtml.matchAll(/data-id="Q(\d{1,4})"/gi)) bump(Number(m[1]))
  for (const m of currentHtml.matchAll(/\bQ(\d{1,4})\b/gi)) bump(Number(m[1]))
  for (const m of currentHtml.matchAll(/data-gaps="([^"]*)"/gi)) {
    try {
      const gaps = JSON.parse(decodeHtmlAttr(m[1])) as Array<{ id?: string }>
      if (Array.isArray(gaps)) {
        for (const gap of gaps) {
          const match = String(gap.id ?? '').match(/(?:Q|gap)(\d+)/i)
          if (match) bump(Number(match[1]))
        }
      }
    } catch {
      // ignore malformed gap JSON
    }
  }

  return Math.max(1, max + 1)
}
