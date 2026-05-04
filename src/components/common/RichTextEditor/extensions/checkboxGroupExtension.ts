import { mergeAttributes, Node } from '@tiptap/core'

export type CheckboxOption = { label: string; value: string }

function defaultOptions(): CheckboxOption[] {
  return [
    { label: 'Variant A', value: 'a' },
    { label: 'Variant B', value: 'b' },
    { label: 'Variant C', value: 'c' },
  ]
}

function parseCheckedValues(json: string | null | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map((v) => String(v))
  } catch {
    return []
  }
}

function parseOptions(json: string | null | undefined): CheckboxOption[] {
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
    checkboxGroup: {
      insertCheckboxGroup: (
        options?: CheckboxOption[],
        checkedValues?: string[] | null,
      ) => ReturnType
    }
  }
}

export const CheckboxGroup = Node.create({
  name: 'checkboxGroup',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      groupId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-group-id'),
        renderHTML: (attributes) => {
          if (!attributes.groupId) return {}
          return { 'data-group-id': attributes.groupId as string }
        },
      },
      optionsJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-options') ?? '[]',
        renderHTML: (attributes) => ({
          'data-options': String(attributes.optionsJson ?? '[]'),
        }),
      },
      checkedValuesJson: {
        default: '[]',
        parseHTML: (element) => element.getAttribute('data-checked-values') ?? '[]',
        renderHTML: (attributes) => ({
          'data-checked-values': String(attributes.checkedValuesJson ?? '[]'),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="checkbox-group"]' }]
  },

  renderHTML({ node, HTMLAttributes }) {
    const groupId = (node.attrs.groupId as string) ?? `cbg-${Date.now()}`
    const options = parseOptions(node.attrs.optionsJson as string)
    const checkedSet = new Set(parseCheckedValues(node.attrs.checkedValuesJson as string))
    const children = options.map((opt, index) => [
      'label',
      { class: 'rte-checkbox-option' },
      [
        'input',
        {
          type: 'checkbox',
          name: `${groupId}-${index}`,
          value: opt.value,
          ...(checkedSet.has(opt.value) ? { checked: 'checked' as const } : {}),
        },
      ],
      ['span', { class: 'rte-checkbox-label' }, opt.label],
    ])
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'checkbox-group',
        class: 'rte-checkbox-group',
      }),
      ...children,
    ]
  },

  addCommands() {
    return {
      insertCheckboxGroup:
        (options?: CheckboxOption[], checkedValues?: string[] | null) =>
        ({ commands }) => {
          const groupId = `cbg-${Math.random().toString(36).slice(2, 11)}`
          const opts = options?.length ? options : defaultOptions()
          const checked = checkedValues?.length ? checkedValues : []
          return commands.insertContent({
            type: this.name,
            attrs: {
              groupId,
              optionsJson: JSON.stringify(opts),
              checkedValuesJson: JSON.stringify(checked),
            },
          })
        },
    }
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'rte-checkbox-group'
      dom.setAttribute('data-type', 'checkbox-group')
      dom.setAttribute('contenteditable', 'false')

      const mount = (current: typeof node) => {
        while (dom.firstChild) {
          dom.removeChild(dom.firstChild)
        }
        const groupId =
          (current.attrs.groupId as string) ?? `cbg-${Math.random().toString(36).slice(2, 11)}`
        const options = parseOptions(current.attrs.optionsJson as string)
        const checkedSet = new Set(parseCheckedValues(current.attrs.checkedValuesJson as string))
        dom.setAttribute('data-group-id', groupId)
        dom.setAttribute('data-options', String(current.attrs.optionsJson ?? '[]'))
        dom.setAttribute(
          'data-checked-values',
          String(current.attrs.checkedValuesJson ?? '[]'),
        )

        options.forEach((opt, index) => {
          const label = document.createElement('label')
          label.className = 'rte-checkbox-option'
          const input = document.createElement('input')
          input.type = 'checkbox'
          input.name = `${groupId}-${index}`
          input.value = opt.value
          input.checked = checkedSet.has(opt.value)
          input.setAttribute('tabindex', '0')
          const span = document.createElement('span')
          span.className = 'rte-checkbox-label'
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
          if (updated.type.name !== 'checkboxGroup') {
            return false
          }
          mount(updated)
          return true
        },
        stopEvent: (event: Event) => {
          const target = event.target as HTMLElement | null
          if (!target) return false
          return Boolean(
            target.closest('label.rte-checkbox-option') || target.tagName === 'INPUT',
          )
        },
        ignoreMutation: () => true,
      }
    }
  },
})
