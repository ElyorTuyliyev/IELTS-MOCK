import { mergeAttributes, Node } from '@tiptap/core'
import {
  attachDragDropBlockBehavior,
  captureDragDropValuesFromBlock,
} from '../utils/dragDropBlockHydration'
import {
  recoverGapsJsonFromElement,
  resolveGapsJsonForMount,
} from '../utils/dragDropHtmlSync'
import {
  getEditorDragDropPreviewValues,
  mergeEditorDragDropPreviewValues,
  writeEditorDragDropPreviewValue,
} from '../utils/dragDropEditorPreviewState'

/** Blank marker in the question (4 underscores) */
export const DRAG_DROP_GAP_TOKEN = '____'

export type DragDropGap = { id: string; answer: string }

export type DragDropFillBlankPayload = {
  questionText: string
  mode: 'shuffled' | 'ordered'
  gaps: DragDropGap[]
  distractors: string[]
  targetsLabel?: string
  poolLabel?: string
}

/** For HTML attribute values (so `"` inside JSON is not broken) */
export function escapeHtmlAttr(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
}

function normalizeJsonAttr(value: string | null | undefined): string {
  if (!value) return '[]'
  try {
    return JSON.stringify(JSON.parse(value))
  } catch {
    return String(value)
  }
}

function createClientKey(): string {
  return `dd-${Math.random().toString(36).slice(2, 11)}`
}

function buildQuestionParts(questionText: string, gaps: DragDropGap[]) {
  const chunks = String(questionText ?? '').split(DRAG_DROP_GAP_TOKEN)
  const parts: Array<string | { type: 'blank'; id: string }> = []
  chunks.forEach((chunk, index) => {
    if (chunk) parts.push(chunk)
    if (index < chunks.length - 1) {
      const id = gaps[index]?.id?.trim() || `Q${index + 1}`
      parts.push({ type: 'blank', id })
    }
  })
  return parts
}

export type DragDropMatchingRow = { label: string; gapId: string }

export function gapIdToDisplayNumber(gapId: string): string {
  const match = gapId.match(/\d+/)
  return match?.[0] ?? gapId
}

export function extractDragDropInstruction(questionText: string): string {
  return String(questionText ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.includes(DRAG_DROP_GAP_TOKEN))
    .join(' ')
}

export function buildMatchingRows(questionText: string, gaps: DragDropGap[]): DragDropMatchingRow[] {
  const lines = String(questionText ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length > 0) {
    const rows: DragDropMatchingRow[] = []
    let gapIndex = 0
    for (const line of lines) {
      if (!line.includes(DRAG_DROP_GAP_TOKEN)) continue
      const segments = line.split(DRAG_DROP_GAP_TOKEN)
      const gapCount = segments.length - 1
      for (let i = 0; i < gapCount; i += 1) {
        const label = (i === 0 ? segments[0] : '').trim() || `Item ${gapIndex + 1}`
        rows.push({
          label,
          gapId: gaps[gapIndex]?.id?.trim() || `Q${gapIndex + 1}`,
        })
        gapIndex += 1
      }
    }
    if (rows.length > 0) return rows
  }

  const parts = buildQuestionParts(questionText, gaps)
  const rows: DragDropMatchingRow[] = []
  let currentLabel = ''
  let gapIndex = 0
  for (const part of parts) {
    if (typeof part === 'string') {
      const trimmed = part.trim().replace(/\s+/g, ' ')
      if (trimmed) currentLabel = trimmed
    } else {
      rows.push({
        label: currentLabel || `Item ${gapIndex + 1}`,
        gapId: part.id,
      })
      currentLabel = ''
      gapIndex += 1
    }
  }
  if (rows.length > 0) return rows

  return gaps.map((gap, index) => ({
    label: `Item ${index + 1}`,
    gapId: gap.id?.trim() || `Q${index + 1}`,
  }))
}

export function buildPool(
  mode: string,
  gaps: DragDropGap[],
  distractors: string[],
  seed = '',
) {
  const answers = gaps.map((g) => g.answer).filter(Boolean)
  const pool = [...answers, ...distractors.map((d) => String(d ?? '')).filter(Boolean)]
  if (mode === 'shuffled') {
    const arr = [...pool]
    let hash = 0
    const seedStr = seed || JSON.stringify(gaps.map((g) => g.id))
    for (let i = 0; i < seedStr.length; i += 1) {
      hash = (hash * 31 + seedStr.charCodeAt(i)) | 0
    }
    for (let i = arr.length - 1; i > 0; i -= 1) {
      hash = (hash * 1664525 + 1013904223) | 0
      const j = Math.abs(hash) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  return pool
}

export function parseGaps(json: string | null | undefined): DragDropGap[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((item, index) => {
      if (item && typeof item === 'object' && 'answer' in item) {
        const o = item as { id?: string; answer: string }
        return {
          id: typeof o.id === 'string' && o.id ? o.id : `Q${index + 1}`,
          answer: String(o.answer ?? ''),
        }
      }
      return { id: `Q${index + 1}`, answer: '' }
    })
  } catch {
    return []
  }
}

export function parseDistractors(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((x) => String(x ?? ''))
  } catch {
    return []
  }
}

export function extractInlineQuestionBody(questionText: string): string {
  const lines = String(questionText ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const gapLines = lines.filter((line) => line.includes(DRAG_DROP_GAP_TOKEN))
  if (gapLines.length > 0) return gapLines.join('\n')
  return String(questionText ?? '').trim()
}

function appendTextWithLineBreaks(parent: HTMLElement, text: string) {
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    if (index > 0) parent.appendChild(document.createElement('br'))
    if (line) parent.appendChild(document.createTextNode(line))
  })
}

function appendPoolChips(poolItems: HTMLElement, pool: string[]) {
  pool.forEach((value, chipIndex) => {
    const chip = document.createElement('span')
    chip.className = 'rte-drag-drop-fill__chip'
    chip.draggable = false
    chip.dataset.chipValue = value || '—'
    chip.dataset.chipIndex = String(chipIndex)
    chip.textContent = value || '—'
    poolItems.appendChild(chip)
  })
}

function appendInlineLayout(
  parent: HTMLElement,
  questionText: string,
  gaps: DragDropGap[],
  pool: string[],
  poolLabel = 'Word bank',
) {
  const instruction = extractDragDropInstruction(questionText)
  const body = extractInlineQuestionBody(questionText)

  if (instruction) {
    const intro = document.createElement('p')
    intro.className = 'rte-drag-drop-fill__instruction'
    intro.textContent = instruction
    parent.appendChild(intro)
  }

  const questionEl = document.createElement('p')
  questionEl.className = 'rte-drag-drop-fill__question'
  const parts = buildQuestionParts(body, gaps)
  for (const part of parts) {
    if (typeof part === 'string') {
      appendTextWithLineBreaks(questionEl, part)
      continue
    }
    const blank = document.createElement('span')
    blank.className = 'rte-drag-drop-fill__blank'
    blank.dataset.gapId = part.id
    blank.setAttribute('data-gap-id', part.id)
    blank.dataset.type = 'drop'
    blank.setAttribute('role', 'button')
    blank.tabIndex = 0
    const blankNum = document.createElement('span')
    blankNum.className = 'rte-drag-drop-fill__blank-num'
    blankNum.textContent = gapIdToDisplayNumber(part.id)
    blank.appendChild(blankNum)
    questionEl.appendChild(blank)
  }
  parent.appendChild(questionEl)

  const bank = document.createElement('div')
  bank.className = 'rte-drag-drop-fill__bank'
  const poolLabelEl = document.createElement('div')
  poolLabelEl.className = 'rte-drag-drop-fill__pool-label'
  poolLabelEl.textContent = poolLabel
  const poolItems = document.createElement('div')
  poolItems.className = 'rte-drag-drop-fill__pool-items'
  appendPoolChips(poolItems, pool)
  bank.appendChild(poolLabelEl)
  bank.appendChild(poolItems)
  parent.appendChild(bank)
}

/** Rebuild inline DOM (e.g. when hydrating legacy matching blocks in the exam player). */
export function renderInlineDragDropDom(
  block: HTMLElement,
  questionText: string,
  gaps: DragDropGap[],
  pool: string[],
  poolLabel: string,
) {
  block
    .querySelectorAll(
      '.rte-drag-drop-fill__instruction, .rte-drag-drop-fill__question, .rte-drag-drop-fill__bank, .rte-drag-drop-fill__layout',
    )
    .forEach((node) => node.remove())
  appendInlineLayout(block, questionText, gaps, pool, poolLabel)
  block.classList.remove('rte-drag-drop-fill--matching')
  block.classList.add('rte-drag-drop-fill--inline')
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dragDropFillBlank: {
      insertDragDropFillBlank: (payload: DragDropFillBlankPayload) => ReturnType
    }
  }
}

export const DragDropFillBlank = Node.create({
  name: 'dragDropFillBlank',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      questionText: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-question-text') ?? '',
        renderHTML: (attributes) => ({
          'data-question-text': escapeHtmlAttr(String(attributes.questionText ?? '')),
        }),
      },
      mode: {
        default: 'shuffled',
        parseHTML: (element) =>
          (element.getAttribute('data-mode') as 'shuffled' | 'ordered') ?? 'shuffled',
        renderHTML: (attributes) => ({
          'data-mode': String(attributes.mode ?? 'shuffled'),
        }),
      },
      gapsJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-gaps') ?? '[]',
        renderHTML: (attributes) => ({
          'data-gaps': escapeHtmlAttr(String(attributes.gapsJson ?? '[]')),
        }),
      },
      distractorsJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-distractors') ?? '[]',
        renderHTML: (attributes) => ({
          'data-distractors': escapeHtmlAttr(String(attributes.distractorsJson ?? '[]')),
        }),
      },
      targetsLabel: {
        default: 'Categories',
        parseHTML: (element) => element.getAttribute('data-targets-label') ?? 'Categories',
        renderHTML: (attributes) => ({
          'data-targets-label': escapeHtmlAttr(String(attributes.targetsLabel ?? 'Categories')),
        }),
      },
      poolLabel: {
        default: 'Word bank',
        parseHTML: (element) => element.getAttribute('data-pool-label') ?? 'Word bank',
        renderHTML: (attributes) => ({
          'data-pool-label': escapeHtmlAttr(String(attributes.poolLabel ?? 'Word bank')),
        }),
      },
      clientKey: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-client-key'),
        renderHTML: (attributes) => {
          const key = String(attributes.clientKey ?? '').trim()
          return key ? { 'data-client-key': escapeHtmlAttr(key) } : {}
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="drag-drop-fill"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false
          return {
            questionText: element.getAttribute('data-question-text') ?? '',
            mode: (element.getAttribute('data-mode') as 'shuffled' | 'ordered') ?? 'shuffled',
            gapsJson: recoverGapsJsonFromElement(element),
            distractorsJson: element.getAttribute('data-distractors') ?? '[]',
            targetsLabel: element.getAttribute('data-targets-label') ?? 'Categories',
            poolLabel: element.getAttribute('data-pool-label') ?? 'Options',
            clientKey: element.getAttribute('data-client-key'),
          }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const q = String(node.attrs.questionText ?? '')
    const mode = String(node.attrs.mode ?? 'shuffled')
    const gaps = parseGaps(node.attrs.gapsJson as string)
    const distractors = parseDistractors(node.attrs.distractorsJson as string)
    const instruction = extractDragDropInstruction(q)
    const body = extractInlineQuestionBody(q)
    const poolLabel = String(node.attrs.poolLabel ?? 'Word bank')
    const pool = buildPool(mode, gaps, distractors, q)
    const children: Array<unknown> = []

    if (instruction) {
      children.push(['p', { class: 'rte-drag-drop-fill__instruction' }, instruction])
    }

    const questionChildren: Array<unknown> = []
    for (const part of buildQuestionParts(body, gaps)) {
      if (typeof part === 'string') {
        if (part) questionChildren.push(part)
        continue
      }
      questionChildren.push([
        'span',
        {
          class: 'rte-drag-drop-fill__blank',
          'data-gap-id': part.id,
          role: 'button',
          tabindex: '0',
        },
        ['span', { class: 'rte-drag-drop-fill__blank-num' }, gapIdToDisplayNumber(part.id)],
      ])
    }
    children.push(['p', { class: 'rte-drag-drop-fill__question' }, ...questionChildren])

    children.push([
      'div',
      { class: 'rte-drag-drop-fill__bank' },
      ['div', { class: 'rte-drag-drop-fill__pool-label' }, poolLabel],
      [
        'div',
        { class: 'rte-drag-drop-fill__pool-items' },
        ...pool.map((value, chipIndex) => [
          'span',
          {
            class: 'rte-drag-drop-fill__chip',
            'data-chip-value': escapeHtmlAttr(value || '—'),
            'data-chip-index': String(chipIndex),
          },
          value || '—',
        ]),
      ],
    ])

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'drag-drop-fill',
        class: 'rte-drag-drop-fill rte-drag-drop-fill--inline',
        'data-question-text': escapeHtmlAttr(q),
        'data-mode': mode,
        'data-gaps': escapeHtmlAttr(String(node.attrs.gapsJson ?? '[]')),
        'data-distractors': escapeHtmlAttr(String(node.attrs.distractorsJson ?? '[]')),
        'data-pool-label': escapeHtmlAttr(poolLabel),
      }),
      ...children,
    ]
  },

  addCommands() {
    return {
      insertDragDropFillBlank:
        (payload: DragDropFillBlankPayload) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              questionText: payload.questionText,
              mode: payload.mode,
              gapsJson: JSON.stringify(payload.gaps),
              distractorsJson: JSON.stringify(payload.distractors),
              targetsLabel: payload.targetsLabel ?? 'Categories',
              poolLabel: payload.poolLabel ?? 'Word bank',
              clientKey: createClientKey(),
            },
          })
        },
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('div')
      dom.className = 'rte-drag-drop-fill rte-drag-drop-fill--inline'
      dom.setAttribute('data-type', 'drag-drop-fill')
      dom.setAttribute('contenteditable', 'false')

      let dragCleanup: (() => void) | null = null
      let currentNode = node

      const resolveClientKey = (n: typeof node): string => {
        const fromAttr = String(n.attrs.clientKey ?? '').trim()
        return fromAttr || createClientKey()
      }

      const persistClientKey = (n: typeof node, clientKey: string) => {
        if (String(n.attrs.clientKey ?? '').trim() === clientKey) return
        const pos = typeof getPos === 'function' ? getPos() : null
        if (!editor || typeof pos !== 'number') return
        editor.commands.command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, { ...n.attrs, clientKey })
          return true
        })
      }

      const attrsSignature = (n: typeof node) =>
        JSON.stringify([
          String(n.attrs.questionText ?? ''),
          String(n.attrs.mode ?? 'shuffled'),
          normalizeJsonAttr(String(n.attrs.gapsJson ?? '[]')),
          normalizeJsonAttr(String(n.attrs.distractorsJson ?? '[]')),
          String(n.attrs.targetsLabel ?? 'Categories'),
          String(n.attrs.poolLabel ?? 'Options'),
        ])

      const mount = (next: typeof node) => {
        const clientKey = resolveClientKey(next)
        persistClientKey(next, clientKey)
        dom.dataset.previewKey = clientKey
        dom.setAttribute('data-client-key', clientKey)

        if (dom.querySelector('.rte-drag-drop-fill__chip')) {
          mergeEditorDragDropPreviewValues(
            clientKey,
            captureDragDropValuesFromBlock(dom, clientKey),
          )
        }

        const resolvedGapsJson = resolveGapsJsonForMount(
          dom,
          String(next.attrs.gapsJson ?? '[]'),
        )
        const pos = typeof getPos === 'function' ? getPos() : null
        if (
          editor &&
          typeof pos === 'number' &&
          resolvedGapsJson !== String(next.attrs.gapsJson ?? '[]')
        ) {
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, {
              ...next.attrs,
              gapsJson: resolvedGapsJson,
              clientKey,
            })
            return true
          })
        }

        dragCleanup?.()
        dragCleanup = null

        while (dom.firstChild) {
          dom.removeChild(dom.firstChild)
        }

        const q = String(next.attrs.questionText ?? '')
        const mode = String(next.attrs.mode ?? 'shuffled')
        const gaps = parseGaps(resolvedGapsJson)
        const distractors = parseDistractors(next.attrs.distractorsJson as string)
        const poolLabel = String(next.attrs.poolLabel ?? 'Word bank')
        const pool = buildPool(mode, gaps, distractors, q)

        dom.setAttribute('data-question-text', q)
        dom.setAttribute('data-mode', mode)
        dom.setAttribute('data-gaps', resolvedGapsJson)
        dom.setAttribute('data-distractors', String(next.attrs.distractorsJson ?? '[]'))
        dom.setAttribute('data-pool-label', poolLabel)

        const close = document.createElement('button')
        close.type = 'button'
        close.className = 'rte-drag-drop-fill__close'
        close.setAttribute('aria-label', 'Remove block')
        close.textContent = '×'
        close.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!editor || !getPos) return
          const pos = typeof getPos === 'function' ? getPos() : null
          if (typeof pos !== 'number') return
          editor
            .chain()
            .focus()
            .command(({ tr }) => {
              tr.deleteRange(pos, pos + next.nodeSize)
              return true
            })
            .run()
        }
        dom.appendChild(close)

        appendInlineLayout(dom, q, gaps, pool, poolLabel)

        const previewValuesRef = { current: getEditorDragDropPreviewValues(clientKey) }
        dragCleanup = attachDragDropBlockBehavior(dom, {
          blockKey: clientKey,
          examMode: false,
          valuesRef: previewValuesRef,
          onValueChange: (key, value) => writeEditorDragDropPreviewValue(clientKey, key, value),
        })
        currentNode =
          resolvedGapsJson === String(next.attrs.gapsJson ?? '[]')
            ? next
            : next.type.create({
                ...next.attrs,
                gapsJson: resolvedGapsJson,
                clientKey,
              })
      }

      mount(node)

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== 'dragDropFillBlank') {
            return false
          }
          if (attrsSignature(updated) === attrsSignature(currentNode)) {
            currentNode = updated
            return true
          }
          mount(updated)
          return true
        },
        stopEvent: (event: Event) => {
          const target = event.target as HTMLElement | null
          if (!target) return false
          if (target.closest('button.rte-drag-drop-fill__close')) return true
          return Boolean(
            target.closest(
              '.rte-drag-drop-fill__chip, .rte-drag-drop-fill__blank, .rte-drag-drop-fill__drop, .rte-drag-drop-fill__pool-items',
            ),
          )
        },
        destroy: () => {
          dragCleanup?.()
          dragCleanup = null
        },
        ignoreMutation: () => true,
      }
    }
  },
})
