import { mergeAttributes, Node } from '@tiptap/core'

export type RadioOption = { label: string; value: string }

function defaultOptions(): RadioOption[] {
  return [
    { label: 'Variant A', value: 'a' },
    { label: 'Variant B', value: 'b' },
    { label: 'Variant C', value: 'c' },
  ]
}

function parseOptions(json: string | null | undefined): RadioOption[] {
  if (!json) return defaultOptions()
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultOptions()
    return parsed.map((item, index) => {
      if (typeof item === 'string') {
        return { label: item, value: String(index) }
      }
      if (item && typeof item === 'object' && 'label' in item) {
        const o = item as { label: string; value?: string }
        return { label: String(o.label), value: String(o.value ?? index) }
      }
      return { label: `Variant ${index + 1}`, value: String(index) }
    })
  } catch {
    return defaultOptions()
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    radioGroup: {
      insertRadioGroup: (options?: RadioOption[], checkedValue?: string | null) => ReturnType
    }
  }
}

export const RadioGroup = Node.create({
  name: 'radioGroup',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes.name) return {}
          return { 'data-name': attributes.name as string }
        },
      },
      optionsJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-options') ?? '[]',
        renderHTML: (attributes) => ({
          'data-options': String(attributes.optionsJson ?? '[]'),
        }),
      },
      checkedValue: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-checked-value'),
        renderHTML: (attributes) => {
          if (!attributes.checkedValue) return {}
          return { 'data-checked-value': String(attributes.checkedValue) }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="radio-group"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const name = (node.attrs.name as string) ?? `rg-${Date.now()}`
    const checked = node.attrs.checkedValue as string | null | undefined
    const options = parseOptions(node.attrs.optionsJson as string)
    const children = options.map((opt) => [
      'label',
      { class: 'rte-radio-option' },
      [
        'input',
        {
          type: 'radio',
          name,
          value: opt.value,
          ...(checked && checked === opt.value ? { checked: 'checked' as const } : {}),
        },
      ],
      ['span', { class: 'rte-radio-label' }, opt.label],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'radio-group',
        class: 'rte-radio-group',
      }),
      ...children,
    ]
  },

  addCommands() {
    return {
      insertRadioGroup:
        (options?: RadioOption[], checkedValue?: string | null) =>
        ({ commands }) => {
          const name = `rg-${Math.random().toString(36).slice(2, 11)}`
          const opts = options?.length ? options : defaultOptions()
          return commands.insertContent({
            type: this.name,
            attrs: {
              name,
              optionsJson: JSON.stringify(opts),
              checkedValue: checkedValue ?? null,
            },
          })
        },
    }
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'rte-radio-group'
      dom.setAttribute('data-type', 'radio-group')
      dom.setAttribute('contenteditable', 'false')

      const mount = (current: typeof node) => {
        while (dom.firstChild) {
          dom.removeChild(dom.firstChild)
        }
        const name = (current.attrs.name as string) ?? `rg-${Date.now()}`
        const checkedVal = current.attrs.checkedValue as string | null | undefined
        const options = parseOptions(current.attrs.optionsJson as string)
        dom.setAttribute('data-name', name)
        dom.setAttribute('data-options', String(current.attrs.optionsJson ?? '[]'))
        if (checkedVal) {
          dom.setAttribute('data-checked-value', checkedVal)
        } else {
          dom.removeAttribute('data-checked-value')
        }

        options.forEach((opt) => {
          const label = document.createElement('label')
          label.className = 'rte-radio-option'
          const input = document.createElement('input')
          input.type = 'radio'
          input.name = name
          input.value = opt.value
          input.checked = Boolean(checkedVal && checkedVal === opt.value)
          input.setAttribute('tabindex', '0')
          const span = document.createElement('span')
          span.className = 'rte-radio-label'
          span.textContent = opt.label
          label.appendChild(input)
          label.appendChild(span)
          dom.appendChild(label)
        })
      }

      mount(node)

      return {
        dom,
        update: (updated) => {
          if (updated.type.name !== 'radioGroup') {
            return false
          }
          mount(updated)
          return true
        },
        stopEvent: (event: Event) => {
          const target = event.target as HTMLElement | null
          if (!target) return false
          return Boolean(
            target.closest('label.rte-radio-option') || target.tagName === 'INPUT',
          )
        },
        ignoreMutation: () => true,
      }
    }
  },
})
