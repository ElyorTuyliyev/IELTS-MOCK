import { mergeAttributes, Node } from '@tiptap/core'

/** Savoldagi bo‘shliq belgisi (4 ta past chiziq) */
export const DRAG_DROP_GAP_TOKEN = '____'

export type DragDropGap = { id: string; answer: string }

export type DragDropFillBlankPayload = {
  questionText: string
  mode: 'shuffled' | 'ordered'
  gaps: DragDropGap[]
  distractors: string[]
}

function escapeText(value: string): string {
  return String(value ?? '')
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

function buildPool(mode: string, gaps: DragDropGap[], distractors: string[]) {
  const answers = gaps.map((g) => g.answer).filter(Boolean)
  const pool = [...answers, ...distractors.map((d) => String(d ?? '')).filter(Boolean)]
  if (mode === 'shuffled') {
    // stable-ish shuffle for preview
    return pool.sort((a, b) => a.localeCompare(b))
  }
  return pool
}

function parseGaps(json: string | null | undefined): DragDropGap[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((item, index) => {
      if (item && typeof item === 'object' && 'answer' in item) {
        const o = item as { id?: string; answer: string }
        return {
          id: typeof o.id === 'string' && o.id ? o.id : `gap${index + 1}`,
          answer: String(o.answer ?? ''),
        }
      }
      return { id: `gap${index + 1}`, answer: '' }
    })
  } catch {
    return []
  }
}

function parseDistractors(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((x) => String(x ?? ''))
  } catch {
    return []
  }
}

// Note: Previously we rendered meta lists (Answers/Distractors).
// Now we render "question + blanks + pool chips" preview (like IELTS UI),
// so those helpers are not needed.

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
          'data-question-text': String(attributes.questionText ?? ''),
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
          'data-gaps': String(attributes.gapsJson ?? '[]'),
        }),
      },
      distractorsJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-distractors') ?? '[]',
        renderHTML: (attributes) => ({
          'data-distractors': String(attributes.distractorsJson ?? '[]'),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="drag-drop-fill"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const q = String(node.attrs.questionText ?? '')
    const mode = String(node.attrs.mode ?? 'shuffled')
    const gaps = parseGaps(node.attrs.gapsJson as string)
    const distractors = parseDistractors(node.attrs.distractorsJson as string)
    const excerpt = q || '—'
    const questionParts = buildQuestionParts(excerpt, gaps)
    const pool = buildPool(mode, gaps, distractors)
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'drag-drop-fill',
        class: 'rte-drag-drop-fill',
        'data-question-text': q,
        'data-mode': mode,
        'data-gaps': String(node.attrs.gapsJson ?? '[]'),
        'data-distractors': String(node.attrs.distractorsJson ?? '[]'),
      }),
      [
        'div',
        { class: 'rte-drag-drop-fill__question' },
        ...questionParts.map((part) => {
          if (typeof part === 'string') return escapeText(part)
          return [
            'input',
            {
              class: 'rte-drag-drop-fill__blank',
              type: 'text',
              disabled: 'disabled',
              value: '',
              placeholder: part.id,
            },
          ]
        }),
      ],
      [
        'div',
        { class: 'rte-drag-drop-fill__pool' },
        ['div', { class: 'rte-drag-drop-fill__pool-label' }, 'Drag answers to fill the gaps'],
        [
          'div',
          { class: 'rte-drag-drop-fill__pool-items' },
          ...pool.map((value) => ['span', { class: 'rte-drag-drop-fill__chip' }, value || '—']),
        ],
      ],
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
            },
          })
        },
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('div')
      dom.className = 'rte-drag-drop-fill'
      dom.setAttribute('data-type', 'drag-drop-fill')
      dom.setAttribute('contenteditable', 'false')

      const mount = (current: typeof node) => {
        while (dom.firstChild) {
          dom.removeChild(dom.firstChild)
        }
        const q = String(current.attrs.questionText ?? '')
        const mode = String(current.attrs.mode ?? 'shuffled')
        const gaps = parseGaps(current.attrs.gapsJson as string)
        const distractors = parseDistractors(current.attrs.distractorsJson as string)
        const excerpt = q || '—'
        const questionParts = buildQuestionParts(excerpt, gaps)
        const pool = buildPool(mode, gaps, distractors)

        dom.setAttribute('data-question-text', q)
        dom.setAttribute('data-mode', mode)
        dom.setAttribute('data-gaps', String(current.attrs.gapsJson ?? '[]'))
        dom.setAttribute('data-distractors', String(current.attrs.distractorsJson ?? '[]'))

        const close = document.createElement('button')
        close.type = 'button'
        close.className = 'rte-drag-drop-fill__close'
        close.setAttribute('aria-label', "Remove block")
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
              tr.deleteRange(pos, pos + current.nodeSize)
              return true
            })
            .run()
        }
        dom.appendChild(close)

        const question = document.createElement('div')
        question.className = 'rte-drag-drop-fill__question'
        questionParts.forEach((part) => {
          if (typeof part === 'string') {
            question.appendChild(document.createTextNode(part))
            return
          }
          const input = document.createElement('input')
          input.className = 'rte-drag-drop-fill__blank'
          input.type = 'text'
          input.disabled = true
          input.placeholder = part.id
          question.appendChild(input)
        })
        dom.appendChild(question)

        const poolWrap = document.createElement('div')
        poolWrap.className = 'rte-drag-drop-fill__pool'
        const poolLabel = document.createElement('div')
        poolLabel.className = 'rte-drag-drop-fill__pool-label'
        poolLabel.textContent = 'Drag answers to fill the gaps'
        poolWrap.appendChild(poolLabel)
        const poolItems = document.createElement('div')
        poolItems.className = 'rte-drag-drop-fill__pool-items'
        pool.forEach((value) => {
          const chip = document.createElement('span')
          chip.className = 'rte-drag-drop-fill__chip'
          chip.textContent = value || '—'
          poolItems.appendChild(chip)
        })
        poolWrap.appendChild(poolItems)
        dom.appendChild(poolWrap)
      }

      mount(node)

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== 'dragDropFillBlank') {
            return false
          }
          mount(updated)
          return true
        },
        stopEvent: (event: Event) => {
          const target = event.target as HTMLElement | null
          if (!target) return false
          // Only intercept clicks for our internal controls (e.g. close button).
          // Let ProseMirror handle selection/cursor around the atom node.
          return Boolean(target.closest('button.rte-drag-drop-fill__close'))
        },
        ignoreMutation: () => true,
      }
    }
  },
})
