import type { ExamHighlightColor } from '../constants/examHighlight'

const HIGHLIGHT_CLASS_PREFIX = 'exam-highlight'

const PROTECTED_SELECTOR =
  'input, textarea, button, select, option, [contenteditable="true"], .ielts-blank-input, .ielts-blank-inline, .ielts-drag-drop-slot, .ielts-drag-drop-chip, .rte-drag-drop-fill__chip, .rte-drag-drop-fill__drop'

/** UI chrome where text selection / highlights are disabled. */
const NON_HIGHLIGHTABLE_SELECTOR = [
  '.student-exam-player__highlight-float',
  '.student-exam-player__highlight-toolbar',
  '.student-exam-player__listening-overlay',
  '.student-exam-player__fab-wrap',
  '.student-exam-player__resize-handle',
  '.student-exam-player__nav-btn',
  '.student-exam-player__q-chip',
  '.student-exam-player__part-tab',
  '.student-exam-player__complete-btn',
  PROTECTED_SELECTOR,
].join(', ')

export function highlightClassFor(color: ExamHighlightColor): string {
  return `${HIGHLIGHT_CLASS_PREFIX} ${HIGHLIGHT_CLASS_PREFIX}--${color}`
}

function nodeElement(node: Node): Element | null {
  return node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element | null)
}

function nodeInHighlightableArea(node: Node, root: HTMLElement): boolean {
  const el = nodeElement(node)
  if (!el || !root.contains(el)) return false
  if (el.closest(NON_HIGHLIGHTABLE_SELECTOR)) return false
  return true
}

function nodeTouchesProtected(node: Node): boolean {
  return Boolean(nodeElement(node)?.closest(PROTECTED_SELECTOR))
}

function selectionTouchesProtected(range: Range): boolean {
  if (nodeTouchesProtected(range.startContainer) || nodeTouchesProtected(range.endContainer)) {
    return true
  }
  const fragment = range.cloneContents()
  return Boolean(fragment.querySelector(PROTECTED_SELECTOR))
}

function selectionIsInRoot(range: Range, root: HTMLElement): boolean {
  return (
    root.contains(range.startContainer) &&
    root.contains(range.endContainer) &&
    nodeInHighlightableArea(range.startContainer, root) &&
    nodeInHighlightableArea(range.endContainer, root)
  )
}

export type ExamHighlightToolbarPosition = {
  top: number
  left: number
}

export function getToolbarPositionFromRange(range: Range): ExamHighlightToolbarPosition {
  const rect = range.getBoundingClientRect()
  const toolbarHeight = 44
  const gap = 10
  let top = rect.top - toolbarHeight - gap
  if (rect.top < toolbarHeight + gap + 12) {
    top = rect.bottom + gap
  }
  const left = rect.left + rect.width / 2
  return { top, left }
}

export function getSelectionRangeInRoot(root: HTMLElement): Range | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null
  const range = sel.getRangeAt(0).cloneRange()
  if (!selectionIsInRoot(range, root)) return null
  if (selectionTouchesProtected(range)) return null
  const text = range.toString().trim()
  if (!text) return null
  return range
}

function wrapRangeTextNodes(range: Range, color: ExamHighlightColor): void {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT
      const text = node.textContent ?? ''
      if (!text.trim()) return NodeFilter.FILTER_REJECT
      if (node.parentElement?.closest('mark.exam-highlight')) return NodeFilter.FILTER_REJECT
      if (nodeTouchesProtected(node)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let current = walker.nextNode()
  while (current) {
    textNodes.push(current as Text)
    current = walker.nextNode()
  }

  // Apply end-to-start so earlier DOM wraps do not invalidate later text node offsets.
  for (const textNode of [...textNodes].reverse()) {
    const nodeRange = document.createRange()
    const start = textNode === range.startContainer ? range.startOffset : 0
    const end =
      textNode === range.endContainer ? range.endOffset : (textNode.textContent?.length ?? 0)
    if (start >= end) continue
    nodeRange.setStart(textNode, start)
    nodeRange.setEnd(textNode, end)

    const mark = document.createElement('mark')
    mark.className = highlightClassFor(color)
    mark.setAttribute('data-highlight-color', color)
    try {
      nodeRange.surroundContents(mark)
    } catch {
      const extracted = nodeRange.extractContents()
      mark.appendChild(extracted)
      nodeRange.insertNode(mark)
    }
  }
}

export function applyHighlightToRange(range: Range, color: ExamHighlightColor): void {
  const startEl = nodeElement(range.startContainer)
  const endEl = nodeElement(range.endContainer)
  const sameParent = startEl?.parentElement && startEl.parentElement === endEl?.parentElement
  const singleText =
    range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE

  if (singleText && sameParent) {
    const mark = document.createElement('mark')
    mark.className = highlightClassFor(color)
    mark.setAttribute('data-highlight-color', color)
    try {
      range.surroundContents(mark)
      return
    } catch {
      // fall through to multi-node wrap
    }
  }

  wrapRangeTextNodes(range, color)
}

function unwrapHighlightMark(mark: Element): void {
  const parent = mark.parentNode
  if (!parent) return
  while (mark.firstChild) {
    parent.insertBefore(mark.firstChild, mark)
  }
  parent.removeChild(mark)
  if (parent instanceof HTMLElement) {
    parent.normalize()
  }
}

export function removeHighlightsInRange(range: Range, root: HTMLElement): void {
  root.querySelectorAll('mark.exam-highlight').forEach((mark) => {
    if (range.intersectsNode(mark)) {
      unwrapHighlightMark(mark)
    }
  })
}

export function clearHighlightsUnder(root: HTMLElement): void {
  root.querySelectorAll('mark.exam-highlight').forEach((mark) => {
    unwrapHighlightMark(mark)
  })
}
