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
    const excerpt = q.length > 160 ? `${q.slice(0, 160)}…` : q || '—'
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
      ['div', { class: 'rte-drag-drop-fill__badge' }, mode === 'ordered' ? 'Ordered' : 'Shuffled'],
      ['div', { class: 'rte-drag-drop-fill__excerpt' }, excerpt],
      [
        'div',
        { class: 'rte-drag-drop-fill__meta' },
        `${gaps.length} gap(s) · ${distractors.filter(Boolean).length} distractor(s)`,
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
    return ({ node }) => {
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

        dom.setAttribute('data-question-text', q)
        dom.setAttribute('data-mode', mode)
        dom.setAttribute('data-gaps', String(current.attrs.gapsJson ?? '[]'))
        dom.setAttribute('data-distractors', String(current.attrs.distractorsJson ?? '[]'))

        const badge = document.createElement('div')
        badge.className = 'rte-drag-drop-fill__badge'
        badge.textContent = mode === 'ordered' ? 'Ordered' : 'Shuffled'
        dom.appendChild(badge)

        const excerpt = document.createElement('div')
        excerpt.className = 'rte-drag-drop-fill__excerpt'
        excerpt.textContent = q.length > 220 ? `${q.slice(0, 220)}…` : q || '—'
        dom.appendChild(excerpt)

        const meta = document.createElement('div')
        meta.className = 'rte-drag-drop-fill__meta'
        meta.textContent = `${gaps.length} gap(s) · ${distractors.filter(Boolean).length} distractor(s)`
        dom.appendChild(meta)
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
        stopEvent: () => true,
        ignoreMutation: () => true,
      }
    }
  },
})
