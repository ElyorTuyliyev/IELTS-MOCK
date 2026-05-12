import { mergeAttributes, Node } from '@tiptap/core'

export type BlankAnswerPayload = { id: string; answer: string }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    blankAnswer: {
      insertBlankAnswer: (payload: BlankAnswerPayload) => ReturnType
    }
  }
}

function safeId(raw: string): string {
  const t = raw.trim()
  if (!t) return 'Q1'
  return t.toUpperCase().startsWith('Q') ? t.toUpperCase() : `Q${t}`
}

export const BlankAnswer = Node.create({
  name: 'blankAnswer',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      id: {
        default: 'Q1',
        parseHTML: (element) => element.getAttribute('data-id') ?? 'Q1',
        renderHTML: (attributes) => ({ 'data-id': String(attributes.id ?? 'Q1') }),
      },
      answer: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-answer') ?? '',
        renderHTML: (attributes) => ({ 'data-answer': String(attributes.answer ?? '') }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-type="blank-answer"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const id = safeId(String(node.attrs.id ?? 'Q1'))
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'blank-answer',
        class: 'rte-blank-answer',
        'data-id': id,
        'data-answer': String(node.attrs.answer ?? ''),
      }),
      ['span', { class: 'rte-blank-answer__id' }, id],
      ['span', { class: 'rte-blank-answer__line', 'aria-hidden': 'true' }, '_____'],
    ]
  },

  addCommands() {
    return {
      insertBlankAnswer:
        (payload: BlankAnswerPayload) =>
        ({ commands }) => {
          const id = safeId(payload.id)
          return commands.insertContent({
            type: this.name,
            attrs: { id, answer: payload.answer },
          })
        },
    }
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span')
      dom.className = 'rte-blank-answer'
      dom.setAttribute('data-type', 'blank-answer')
      dom.setAttribute('contenteditable', 'false')

      const mount = (current: typeof node) => {
        while (dom.firstChild) dom.removeChild(dom.firstChild)
        const id = safeId(String(current.attrs.id ?? 'Q1'))
        dom.setAttribute('data-id', id)
        dom.setAttribute('data-answer', String(current.attrs.answer ?? ''))

        const idEl = document.createElement('span')
        idEl.className = 'rte-blank-answer__id'
        idEl.textContent = id
        dom.appendChild(idEl)

        const line = document.createElement('span')
        line.className = 'rte-blank-answer__line'
        line.setAttribute('aria-hidden', 'true')
        line.textContent = '_____'
        dom.appendChild(line)
      }

      mount(node)

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== 'blankAnswer') return false
          mount(updated)
          return true
        },
        stopEvent: () => false,
        ignoreMutation: () => true,
      }
    }
  },
})

