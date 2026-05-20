function parseGapQuestionNumbers(block: HTMLElement): number[] {
  const gapsJson = block.getAttribute('data-gaps') ?? '[]'
  try {
    const gaps = JSON.parse(gapsJson) as Array<{ id?: string }>
    return gaps
      .map((gap) => {
        const match = String(gap.id ?? '').match(/\d+/)
        return match ? Number(match[0]) : NaN
      })
      .filter((value) => Number.isFinite(value))
  } catch {
    return []
  }
}

function isDragDropInternalChild(child: Element): boolean {
  return (
    child.classList.contains('rte-drag-drop-fill__instruction') ||
    child.classList.contains('rte-drag-drop-fill__layout') ||
    child.classList.contains('rte-drag-drop-fill__question') ||
    child.classList.contains('rte-drag-drop-fill__bank') ||
    child.classList.contains('rte-drag-drop-fill__pool') ||
    child.classList.contains('rte-drag-drop-fill__close') ||
    child.classList.contains('rte-drag-drop-fill__badge') ||
    child.classList.contains('rte-drag-drop-fill__meta')
  )
}

function elementContainsExamContent(el: Element): boolean {
  if (el.matches('table, [data-type="radio-group"], .rte-radio-group, .rte-checkbox-group')) {
    return true
  }
  if (
    el.querySelector(
      'table, [data-type="radio-group"], .rte-radio-group, input[type="radio"], input[type="checkbox"]',
    )
  ) {
    return true
  }
  return Array.from(el.querySelectorAll('p, h1, h2, h3, h4, h5, h6, strong, li')).some((node) =>
    /Questions\s+\d+/i.test(node.textContent ?? ''),
  )
}

export function isOrphanDragDropSibling(el: Element): boolean {
  const text = (el.textContent ?? '').trim().toLowerCase()
  const isDuplicateInstruction =
    el.matches('p') &&
    /drag\s+answers?/.test(text) &&
    /fill/.test(text) &&
    /gap/.test(text)
  if (isDuplicateInstruction) return true

  if (el.classList.contains('rte-drag-drop-fill__pool')) {
    return !elementContainsExamContent(el)
  }
  if (el.classList.contains('rte-drag-drop-fill__pool-items')) {
    return !elementContainsExamContent(el)
  }
  if (el.querySelector('.rte-drag-drop-fill__pool-items, .rte-drag-drop-fill__chip')) {
    return !elementContainsExamContent(el)
  }
  return false
}

function isExamContentCapturedInDragDrop(child: Node): boolean {
  if (child.nodeType !== Node.ELEMENT_NODE) return false
  const el = child as HTMLElement
  if (isDragDropInternalChild(el)) return false
  if (el.getAttribute('data-type') === 'drag-drop-fill') return false
  if (
    el.matches(
      '.rte-drag-drop-fill__pool-items, .rte-drag-drop-fill__chip, .rte-drag-drop-fill__targets, .rte-drag-drop-fill__drop, .rte-drag-drop-fill__row, .rte-drag-drop-fill__column-head',
    )
  ) {
    return false
  }
  return elementContainsExamContent(el)
}

function isInsideDragDropChrome(el: Element): boolean {
  return Boolean(
    el.closest(
      '.rte-drag-drop-fill__row, .rte-drag-drop-fill__pool, .rte-drag-drop-fill__targets, .rte-drag-drop-fill__column-head',
    ),
  )
}

function isLaterSectionHeading(el: Element, fromQ: number): boolean {
  const text = (el.textContent ?? '').trim()
  const rangeMatch = text.match(/Questions\s+(\d+)\s*[–-]\s*(\d+)/i)
  if (rangeMatch) {
    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])
    return (fromQ >= start && fromQ <= end) || start >= fromQ
  }
  return new RegExp(`Questions\\s+${fromQ}\\b`, 'i').test(text)
}

export function releaseExamContentFromDragDropElement(
  block: HTMLElement,
  doc: Document = document,
): void {
  const gapNumbers = parseGapQuestionNumbers(block)
  const fromQ = gapNumbers.length > 0 ? Math.max(...gapNumbers) + 1 : 16

  let sectionAnchor: Element | null = null
  for (const el of block.querySelectorAll('p, h1, h2, h3, h4, h5, h6, strong, li')) {
    if (sectionAnchor || isInsideDragDropChrome(el)) continue
    if (isLaterSectionHeading(el, fromQ)) {
      sectionAnchor = el
    }
  }

  if (sectionAnchor) {
    const nodesToMove: Node[] = []
    let node: ChildNode | null = sectionAnchor
    while (node) {
      nodesToMove.push(node)
      node = node.nextSibling
    }
    if (nodesToMove.length > 0) {
      const fragment = doc.createDocumentFragment()
      nodesToMove.forEach((moveNode) => fragment.appendChild(moveNode))
      block.after(fragment)
      return
    }
  }

  const foreignNodes: Node[] = []
  Array.from(block.childNodes).forEach((child) => {
    if (!isExamContentCapturedInDragDrop(child)) return
    foreignNodes.push(child)
  })
  if (foreignNodes.length === 0) return

  const fragment = doc.createDocumentFragment()
  foreignNodes.forEach((node) => fragment.appendChild(node))
  block.after(fragment)
}

export function stripOrphanDragDropExamArtifacts(html: string): string {
  if (typeof window === 'undefined') return html

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html

  root.querySelectorAll('.rte-drag-drop-fill__pool').forEach((pool) => {
    if (pool.closest('[data-type="drag-drop-fill"]')) return
    if (!isOrphanDragDropSibling(pool)) return
    pool.remove()
  })

  root.querySelectorAll('.rte-drag-drop-fill__chip').forEach((chip) => {
    if (chip.closest('[data-type="drag-drop-fill"]')) return
    const holder = chip.parentElement
    if (holder && isOrphanDragDropSibling(holder)) {
      chip.remove()
    }
  })

  root.querySelectorAll('p').forEach((paragraph) => {
    if (paragraph.closest('[data-type="drag-drop-fill"]')) return
    const text = (paragraph.textContent ?? '').trim().toLowerCase()
    if (/drag\s+answers?/.test(text) && /fill/.test(text) && /gap/.test(text)) {
      paragraph.remove()
    }
  })

  return root.innerHTML
}

export function releaseCapturedContentFromDragDropBlocks(html: string): string {
  if (typeof window === 'undefined' || !html.includes('data-type="drag-drop-fill')) {
    return html
  }

  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  const root = doc.body.firstElementChild as HTMLElement | null
  if (!root) return html

  root.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]').forEach((block) => {
    releaseExamContentFromDragDropElement(block, doc)
  })

  return root.innerHTML
}

export function parseDragDropGapQuestionNumbers(block: HTMLElement): number[] {
  return parseGapQuestionNumbers(block)
}
