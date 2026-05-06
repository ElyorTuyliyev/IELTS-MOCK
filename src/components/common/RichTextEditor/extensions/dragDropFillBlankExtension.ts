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

function toJoinedAnswers(gaps: DragDropGap[]): string {
  const values = gaps
    .map((gap, index) => {
      const answer = gap.answer.trim()
      return answer ? `gap${index + 1}: ${answer}` : ''
    })
    .filter(Boolean)
  return values.length ? values.join(' | ') : '—'
}

function toJoinedDistractors(distractors: string[]): string {
  const values = distractors.map((value) => value.trim()).filter(Boolean)
  return values.length ? values.join(' | ') : '—'
}

function toAnswerLines(gaps: DragDropGap[]): string[] {
  return gaps
    .map((gap, index) => {
      const answer = gap.answer.trim()
      return answer ? `gap${index + 1}: ${answer}` : ''
    })
    .filter(Boolean)
}

function toDistractorLines(distractors: string[]): string[] {
  return distractors.map((value) => value.trim()).filter(Boolean)
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
    const excerpt = q || '—'
    const answersText = toJoinedAnswers(gaps)
    const distractorsText = toJoinedDistractors(distractors)
    const answerLines = toAnswerLines(gaps)
    const distractorLines = toDistractorLines(distractors)
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
        ['div', { class: 'rte-drag-drop-fill__meta-label' }, 'Answers:'],
        answerLines.length
          ? ['ul', { class: 'rte-drag-drop-fill__list' }, ...answerLines.map((line) => ['li', {}, line])]
          : ['div', { class: 'rte-drag-drop-fill__meta-line' }, '—'],
      ],
      [
        'div',
        { class: 'rte-drag-drop-fill__meta' },
        ['div', { class: 'rte-drag-drop-fill__meta-label' }, 'Distractors:'],
        distractorLines.length
          ? ['ul', { class: 'rte-drag-drop-fill__list' }, ...distractorLines.map((line) => ['li', {}, line])]
          : ['div', { class: 'rte-drag-drop-fill__meta-line' }, '—'],
      ],
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
        const answersText = toJoinedAnswers(gaps)
        const distractorsText = toJoinedDistractors(distractors)
        const answerLines = toAnswerLines(gaps)
        const distractorLines = toDistractorLines(distractors)

        dom.setAttribute('data-question-text', q)
        dom.setAttribute('data-mode', mode)
        dom.setAttribute('data-gaps', String(current.attrs.gapsJson ?? '[]'))
        dom.setAttribute('data-distractors', String(current.attrs.distractorsJson ?? '[]'))

        const badge = document.createElement('div')
        badge.className = 'rte-drag-drop-fill__badge'
        badge.textContent = mode === 'ordered' ? 'Ordered' : 'Shuffled'
        dom.appendChild(badge)

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

        const excerpt = document.createElement('div')
        excerpt.className = 'rte-drag-drop-fill__excerpt'
        excerpt.textContent = q || '—'
        dom.appendChild(excerpt)

        const answersMeta = document.createElement('div')
        answersMeta.className = 'rte-drag-drop-fill__meta'
        const answersLabel = document.createElement('div')
        answersLabel.className = 'rte-drag-drop-fill__meta-label'
        answersLabel.textContent = 'Answers:'
        answersMeta.appendChild(answersLabel)
        if (answerLines.length > 0) {
          const list = document.createElement('ul')
          list.className = 'rte-drag-drop-fill__list'
          answerLines.forEach((line) => {
            const item = document.createElement('li')
            item.textContent = line
            list.appendChild(item)
          })
          answersMeta.appendChild(list)
        } else {
          const line = document.createElement('div')
          line.className = 'rte-drag-drop-fill__meta-line'
          line.textContent = answersText
          answersMeta.appendChild(line)
        }
        dom.appendChild(answersMeta)

        const distractorsMeta = document.createElement('div')
        distractorsMeta.className = 'rte-drag-drop-fill__meta'
        const distractorsLabel = document.createElement('div')
        distractorsLabel.className = 'rte-drag-drop-fill__meta-label'
        distractorsLabel.textContent = 'Distractors:'
        distractorsMeta.appendChild(distractorsLabel)
        if (distractorLines.length > 0) {
          const list = document.createElement('ul')
          list.className = 'rte-drag-drop-fill__list'
          distractorLines.forEach((line) => {
            const item = document.createElement('li')
            item.textContent = line
            list.appendChild(item)
          })
          distractorsMeta.appendChild(list)
        } else {
          const line = document.createElement('div')
          line.className = 'rte-drag-drop-fill__meta-line'
          line.textContent = distractorsText
          distractorsMeta.appendChild(line)
        }
        dom.appendChild(distractorsMeta)

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
