import type { Editor } from '@tiptap/core'
import { parseGaps } from '../extensions/dragDropFillBlankExtension'

function normalizeGapsJson(raw: string | null | undefined): string {
  const value = String(raw ?? '[]').trim()
  if (!value) return '[]'
  try {
    return JSON.stringify(JSON.parse(value))
  } catch {
    return value
  }
}

export function recoverGapsJsonFromElement(element: HTMLElement): string {
  const fromAttr = normalizeGapsJson(element.getAttribute('data-gaps'))
  const gaps = parseGaps(fromAttr)
  if (gaps.some((gap) => gap.answer.trim())) return fromAttr

  const zones = Array.from(element.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__drop'))
  const gapIds = zones.map(
    (zone, index) =>
      zone.getAttribute('data-gap-id')?.trim() ||
      zone.dataset.gapId?.trim() ||
      `Q${index + 1}`,
  )
  const chipValues = Array.from(
    element.querySelectorAll<HTMLElement>('.rte-drag-drop-fill__chip'),
  )
    .map((chip) => chip.getAttribute('data-chip-value') ?? chip.textContent?.trim() ?? '')
    .filter((value) => value.length > 0 && value !== '—')

  if (gapIds.length === 0 || chipValues.length === 0) return fromAttr

  // Best-effort recovery when attrs were stripped but pool chips survived in HTML.
  if (chipValues.length === gapIds.length) {
    return JSON.stringify(
      gapIds.map((id, index) => ({
        id,
        answer: chipValues[index] ?? '',
      })),
    )
  }

  return fromAttr
}

export function resolveGapsJsonForMount(
  element: HTMLElement,
  attrGapsJson: string,
): string {
  const attrGaps = normalizeGapsJson(attrGapsJson)
  if (parseGaps(attrGaps).some((gap) => gap.answer.trim())) return attrGaps
  const recovered = recoverGapsJsonFromElement(element)
  if (parseGaps(recovered).some((gap) => gap.answer.trim())) return recovered
  return attrGaps
}

/** Ensure serialized HTML carries drag-drop attrs from the ProseMirror document. */
export function patchDragDropAttrsInHtml(html: string, editor: Editor): string {
  if (!html.includes('data-type="drag-drop-fill"')) return html

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html

  const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]'))
  if (blocks.length === 0) return html

  let blockIndex = 0
  editor.state.doc.descendants((node) => {
    if (node.type.name !== 'dragDropFillBlank') return
    const block = blocks[blockIndex]
    blockIndex += 1
    if (!block) return

    const gapsJson = normalizeGapsJson(String(node.attrs.gapsJson ?? '[]'))
    const distractorsJson = normalizeGapsJson(String(node.attrs.distractorsJson ?? '[]'))
    const questionText = String(node.attrs.questionText ?? '')
    const mode = String(node.attrs.mode ?? 'shuffled')
    const targetsLabel = String(node.attrs.targetsLabel ?? 'Categories')
    const poolLabel = String(node.attrs.poolLabel ?? 'Options')
    const clientKey = String(node.attrs.clientKey ?? '').trim()

    block.setAttribute('data-gaps', gapsJson)
    block.setAttribute('data-distractors', distractorsJson)
    block.setAttribute('data-question-text', questionText)
    block.setAttribute('data-mode', mode)
    block.setAttribute('data-targets-label', targetsLabel)
    block.setAttribute('data-pool-label', poolLabel)
    if (clientKey) block.setAttribute('data-client-key', clientKey)
  })

  return root.innerHTML
}

/** Parse drag-drop blocks from HTML and recover gap answers when attrs were stripped. */
export function repairDragDropGapsInHtml(html: string): string {
  if (!html.includes('data-type="drag-drop-fill"')) return html

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html

  root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]').forEach((block) => {
    block.setAttribute('data-gaps', recoverGapsJsonFromElement(block))
  })

  return root.innerHTML
}
