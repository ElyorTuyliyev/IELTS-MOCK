import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Box } from '@mui/material'
import { c, tokens } from '../../../theme'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TextAlign } from '@tiptap/extension-text-align'
import { FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import { RichTextEditorExpandBackdrop, RichTextEditorRoot } from './RichTextEditor.styles'
import { BlankAnswerDialog } from './BlankAnswerDialog'
import { BlankAnswer } from './extensions/blankAnswerExtension'
import { DragDropFillBlank } from './extensions/dragDropFillBlankExtension'
import { RadioGroup } from './extensions/radioGroupExtension'
import { DragDropFillBlankDialog } from './DragDropFillBlankDialog'
import { RadioOptionsDialog } from './RadioOptionsDialog'
import { TableInsertDialog } from './TableInsertDialog'
import {
  patchDragDropAttrsInHtml,
  repairDragDropGapsInHtml,
} from './utils/dragDropHtmlSync'
import { resolveNextQuestionNumber } from './utils/questionNumbering'

export type RichTextEditorProps = {
  value: string
  onChange: (nextValue: string) => void
  placeholder?: string
  minHeight?: number
  /** Text area max height; overflow scrolls inside */
  maxHeight?: number
  /** Hide toolbar (read-only preview style still editable if focused programmatically) */
  readOnly?: boolean
  /** Previous parts HTML — next Q number continues from the highest Q here */
  priorQuestionHtml?: string[]
}

function IconBold() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6V4zm0 8h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6v-8z" />
    </svg>
  )
}

function IconItalic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 5v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V5h-8z" />
    </svg>
  )
}

function IconUnderline() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 21h14v-2H5v2zm7-4c2.76 0 5-2.24 5-5V5h-2v7c0 1.65-1.35 3-3 3s-3-1.35-3-3V5H7v7c0 2.76 2.24 5 5 5z" />
    </svg>
  )
}

function IconStrike() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.24 8.75c-.26-.48-.39-1.03-.39-1.67 0-.61.13-1.16.4-1.67s.66-.91 1.17-1.22.75-.47 1.23-.6.96-.19 1.48-.19c.5 0 .94.06 1.35.18s.75.31 1.05.57.53.55.7.9.25.75.25 1.2h2.67c0-.58-.11-1.13-.34-1.63s-.55-.95-1-1.33-1.01-.68-1.65-.9-1.38-.33-2.2-.33c-.79 0-1.52.11-2.2.33-.68.22-1.27.54-1.78.95s-.9.93-1.2 1.53-.45 1.27-.45 2.01c0 .59.09 1.13.27 1.63h3.09zm12.76 3H8.08c-.09.32-.14.66-.14 1.02 0 .46.1.88.3 1.26s.48.7.84.95.78.44 1.26.57c.48.13.99.2 1.53.2.46 0 .9-.05 1.32-.15s.78-.38 1.08-.75.48-.87.57-1.47h2.11c-.13 1.2-.5 2.25-1.11 3.15s-1.38 1.59-2.31 2.07-2 .72-3.21.72c-.86 0-1.65-.13-2.37-.39s-1.35-.63-1.86-1.11-.9-1.05-1.17-1.71-.42-1.39-.42-2.19c0-.75.12-1.44.36-2.07h8.64v-2zm-9.72 2.02c.09.5.31.89.66 1.17s.78.42 1.29.42c.55 0 1.02-.14 1.41-.42s.59-.67.66-1.17H10.28z" />
    </svg>
  )
}

function IconQuote() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.17 14c.51 0 .92-.39.92-.88L8 5.88C8 5.39 7.59 5 7.08 5H4.92C4.41 5 4 5.39 4 5.88v7.24c0 .49.41.88.92.88h2.25zm9 0c.51 0 .92-.39.92-.88L18 5.88C18 5.39 17.59 5 17.08 5h-2.16c-.51 0-.92.39-.92.88v7.24c0 .49.41.88.92.88h2.25z" />
    </svg>
  )
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  )
}

function IconImage() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  )
}

function IconListBullet() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 5.5 4 5.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
    </svg>
  )
}

function IconListNumber() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
    </svg>
  )
}

function IconOutdent() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
    </svg>
  )
}

function IconIndent() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zm-8-14v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" />
    </svg>
  )
}

function IconAlignLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
    </svg>
  )
}

function IconAlignCenter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
    </svg>
  )
}

function IconAlignRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
    </svg>
  )
}

function IconAlignJustify() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" />
    </svg>
  )
}

function IconHr() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 11h16v2H4z" />
    </svg>
  )
}

function IconTable() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 3v18h18V3H3zm8 16H5v-6h6v6zm0-8H5V5h6v6zm8 8h-6v-6h6v6zm0-8h-6V5h6v6z" />
    </svg>
  )
}

function TableDeleteCorner({ editor }: { editor: Editor }) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const activeTableRef = useRef<HTMLTableElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const root = editor.view.dom as HTMLElement | null
    if (!root) return

    const setFromTable = (table: HTMLTableElement | null) => {
      activeTableRef.current = table
      if (!table) {
        setPos(null)
        return
      }
      const rect = table.getBoundingClientRect()
      setPos({ top: rect.top + 8, left: rect.right + 8 })
    }

    const scheduleReposition = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        const table = activeTableRef.current
        if (!table) return
        const rect = table.getBoundingClientRect()
        setPos({ top: rect.top + 8, left: rect.right + 8 })
      })
    }

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as EventTarget | null
      if (!(target instanceof Node)) {
        setFromTable(null)
        return
      }
      if (!root.contains(target)) {
        setFromTable(null)
        return
      }
      const el = target as Element
      const table = el.closest('table') as HTMLTableElement | null
      if (table === activeTableRef.current) return
      setFromTable(table)
    }
    const onPointerLeave = () => setFromTable(null)

    root.addEventListener('pointermove', onPointerMove, { passive: true, capture: true })
    root.addEventListener('pointerleave', onPointerLeave, { passive: true, capture: true })
    root.addEventListener('scroll', scheduleReposition, { passive: true, capture: true })

    return () => {
      root.removeEventListener('pointermove', onPointerMove, true)
      root.removeEventListener('pointerleave', onPointerLeave, true)
      root.removeEventListener('scroll', scheduleReposition, true)
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [editor])

  if (!pos) return null

  return createPortal(
    <button
      type="button"
      aria-label="Delete table"
      title="Delete table"
      onMouseDown={(e) => {
        // keep selection stable
        e.preventDefault()
      }}
      onClick={() => {
        editor.chain().focus().deleteTable().run()
      }}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 2000,
        width: 30,
        height: 30,
        borderRadius: 999,
        border: `1px solid ${tokens.rgba.slate900_18}`,
        background: tokens.rgba.white_95,
        color: c.error.main,
        fontSize: 18,
        lineHeight: 1,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: tokens.shadows.floating,
      }}
    >
      ×
    </button>,
    document.body,
  )
}

function IconRadio() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" fill="currentColor" />
    </svg>
  )
}

function IconExpandEditor() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      />
    </svg>
  )
}

function IconDragDropFill() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 6h12M8 12h12M8 18h8M4 6h.01M4 12h.01M4 18h.01"
      />
    </svg>
  )
}

function IconBlank() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <rect x="4" y="8" width="16" height="8" rx="2" strokeWidth="2" />
      <path d="M8 12h8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}


const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-width') ??
          element.getAttribute('width') ??
          element.style.width?.replace('px', '') ??
          null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {}
          const n = Number(attributes.width)
          if (!Number.isFinite(n) || n <= 0) return {}
          return {
            width: String(Math.round(n)),
            'data-width': String(Math.round(n)),
            style: `width:${Math.round(n)}px;max-width:100%;height:auto;`,
          }
        },
      },
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('span')
      dom.className = 'rte-image-wrap'
      dom.setAttribute('contenteditable', 'false')

      const img = document.createElement('img')
      img.className = 'rte-img'
      img.draggable = false

      const handle = document.createElement('span')
      handle.className = 'rte-image-resize-handle'
      handle.setAttribute('aria-hidden', 'true')
      const sizeBadge = document.createElement('span')
      sizeBadge.className = 'rte-image-size-badge'
      sizeBadge.setAttribute('aria-hidden', 'true')

      const updateSizeBadge = () => {
        const width = Math.round(img.getBoundingClientRect().width || img.clientWidth || 0)
        const height = Math.round(img.getBoundingClientRect().height || img.clientHeight || 0)
        if (!width || !height) {
          sizeBadge.textContent = ''
          return
        }
        sizeBadge.textContent = `${width} × ${height}`
      }

      const applyFromNode = (current: typeof node) => {
        const src = String(current.attrs.src ?? '')
        const alt = String(current.attrs.alt ?? '')
        const title = String(current.attrs.title ?? '')
        const widthRaw = current.attrs.width
        const widthNum = Number(widthRaw)

        img.src = src
        img.alt = alt
        img.title = title
        if (Number.isFinite(widthNum) && widthNum > 0) {
          img.style.width = `${Math.round(widthNum)}px`
        } else {
          img.style.width = ''
        }
        requestAnimationFrame(updateSizeBadge)
      }

      const commitWidth = (nextWidth: number) => {
        const pos = typeof getPos === 'function' ? getPos() : null
        if (typeof pos !== 'number') return
        const width = Math.max(80, Math.round(nextWidth))
        editor.commands.command(({ tr, state, dispatch }) => {
          const current = state.doc.nodeAt(pos)
          if (!current) return false
          tr.setNodeMarkup(pos, undefined, {
            ...current.attrs,
            width,
          })
          if (dispatch) dispatch(tr)
          return true
        })
      }

      handle.addEventListener('pointerdown', (event: PointerEvent) => {
        event.preventDefault()
        event.stopPropagation()
        handle.setPointerCapture?.(event.pointerId)
        const startX = event.clientX
        const rect = img.getBoundingClientRect()
        const startWidth = rect.width || img.clientWidth || 320
        const editorWidth = (editor.view.dom as HTMLElement).getBoundingClientRect().width || 1200
        const minWidth = 80
        const maxWidth = Math.max(minWidth, editorWidth - 24)

        const onMove = (moveEvent: PointerEvent) => {
          moveEvent.preventDefault()
          const delta = moveEvent.clientX - startX
          const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta))
          img.style.width = `${Math.round(next)}px`
          updateSizeBadge()
        }

        const onUp = (upEvent: PointerEvent) => {
          upEvent.preventDefault()
          const delta = upEvent.clientX - startX
          const next = Math.min(maxWidth, Math.max(minWidth, startWidth + delta))
          commitWidth(next)
          handle.releasePointerCapture?.(event.pointerId)
          window.removeEventListener('pointermove', onMove, true)
          window.removeEventListener('pointerup', onUp, true)
          window.removeEventListener('pointercancel', onUp, true)
        }

        window.addEventListener('pointermove', onMove, { capture: true, passive: false })
        window.addEventListener('pointerup', onUp, { capture: true, passive: false })
        window.addEventListener('pointercancel', onUp, { capture: true, passive: false })
      })

      dom.appendChild(img)
      dom.appendChild(sizeBadge)
      dom.appendChild(handle)
      applyFromNode(node)
      img.addEventListener('load', updateSizeBadge)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== this.name) return false
          applyFromNode(updatedNode)
          return true
        },
        stopEvent: (event) => {
          const target = event.target as HTMLElement | null
          return Boolean(target && (target === handle || handle.contains(target)))
        },
        ignoreMutation: () => true,
        destroy: () => {
          img.removeEventListener('load', updateSizeBadge)
        },
      }
    }
  },
})

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={`rte-btn rte-btn--icon${active ? ' is-active' : ''}`}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function blockTypeValue(editor: Editor): string {
  if (editor.isActive('heading', { level: 1 })) return 'h1'
  if (editor.isActive('heading', { level: 2 })) return 'h2'
  if (editor.isActive('heading', { level: 3 })) return 'h3'
  return 'paragraph'
}

/** Current font-size from editor `textStyle` (empty = default) */
function textFontSizeFromEditor(editor: Editor): string {
  const raw = editor.getAttributes('textStyle').fontSize
  if (raw == null || typeof raw !== 'string') return ''
  const t = raw.trim()
  if (!t) return ''
  if (/^\d+(\.\d+)?px$/i.test(t)) return t.replace(/PX$/i, 'px')
  if (/^\d+(\.\d+)?$/.test(t)) return `${t}px`
  return t
}

/** `null` — remove; `false` — invalid; string — passed to setFontSize */
function normalizeUserFontSize(raw: string): string | null | false {
  const t = raw.trim().replace(/,/g, '.')
  if (!t) return null
  if (/^(\d+(\.\d+)?|\.\d+)$/i.test(t)) return `${t}px`
  if (
    /^(\d+(\.\d+)?|\.\d+)(px|rem|em|%|pt|pc|ch|ex|vw|vh|vmin|vmax)$/i.test(t)
  ) {
    const m = t.match(/^(.+?)(px|rem|em|%|pt|pc|ch|ex|vw|vh|vmin|vmax)$/i)!
    return `${m[1]}${m[2].toLowerCase()}`
  }
  return false
}

function FontSizeToolbarInput({ editor }: { editor: Editor }) {
  const fromEditor = textFontSizeFromEditor(editor)
  const [draft, setDraft] = useState(fromEditor)
  const focusedRef = useRef(false)

  useEffect(() => {
    if (focusedRef.current) return
    setDraft(fromEditor)
  }, [fromEditor])

  const apply = useCallback(() => {
    const n = normalizeUserFontSize(draft)
    if (n === null) {
      editor.chain().focus().unsetFontSize().run()
      setDraft('')
      return
    }
    if (n === false) {
      setDraft(fromEditor)
      return
    }
    editor.chain().focus().setFontSize(n).run()
    setDraft(n)
  }, [draft, editor, fromEditor])

  return (
    <input
      type="text"
      className="rte-fontsize-input"
      inputMode="decimal"
      aria-label="Font size"
      title="Examples: 16, 16px, 1.125rem, 120%. Empty = default. Enter to apply."
      placeholder="16px"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={() => {
        focusedRef.current = true
      }}
      onBlur={() => {
        focusedRef.current = false
        apply()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          apply()
          e.currentTarget.blur()
        }
        if (e.key === 'Escape') {
          setDraft(fromEditor)
          e.currentTarget.blur()
        }
      }}
    />
  )
}

function RichTextToolbar({
  editor,
  textColorInputRef,
  highlightInputRef,
  imageInputRef,
  onTextColorPick,
  onHighlightPick,
  onImageFile,
  onOpenRadioModal,
  onOpenTableModal,
  onOpenDragDropFillModal,
  onInsertBlank,
  expanded,
  onToggleExpand,
}: {
  editor: Editor
  textColorInputRef: React.RefObject<HTMLInputElement | null>
  highlightInputRef: React.RefObject<HTMLInputElement | null>
  imageInputRef: React.RefObject<HTMLInputElement | null>
  onTextColorPick: (e: ChangeEvent<HTMLInputElement>) => void
  onHighlightPick: (e: ChangeEvent<HTMLInputElement>) => void
  onImageFile: (e: ChangeEvent<HTMLInputElement>) => void
  onOpenRadioModal: () => void
  onOpenTableModal: () => void
  onOpenDragDropFillModal: () => void
  onInsertBlank: () => void
  expanded: boolean
  onToggleExpand: () => void
}) {
  const blockValue = blockTypeValue(editor)
  const canSink = editor.can().sinkListItem('listItem')
  const canLift = editor.can().liftListItem('listItem')
  const isInTable = editor.isActive('table')

  const setBlockType = (value: string) => {
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run()
      return
    }
    const level = Number(value.replace('h', '')) as 1 | 2 | 3
    editor.chain().focus().toggleHeading({ level }).run()
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const next = window.prompt('Link URL', previous ?? 'https://')
    if (next === null) return
    if (next === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: next }).run()
  }

  return (
    <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
      <div className="rte-toolbar__scroll">
      <div className="rte-toolbar__group">
        <select
          className="rte-select"
          aria-label="Block type"
          value={blockValue}
          onChange={(e) => setBlockType(e.target.value)}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <FontSizeToolbarInput editor={editor} />
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <IconBold />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <IconItalic />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <IconUnderline />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <IconStrike />
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <span className="rte-color-wrap">
          <input
            ref={textColorInputRef}
            type="color"
            className="rte-color-input"
            aria-label="Text color"
            defaultValue={c.slate[900]}
            onChange={onTextColorPick}
          />
          <ToolbarButton
            title="Text color"
            onClick={() => textColorInputRef.current?.click()}
          >
            <span className="rte-swatch rte-swatch--text">A</span>
          </ToolbarButton>
        </span>
        <span className="rte-color-wrap">
          <input
            ref={highlightInputRef}
            type="color"
            className="rte-color-input"
            aria-label="Highlight color"
            defaultValue={c.warning.highlight}
            onChange={onHighlightPick}
          />
          <ToolbarButton
            title="Highlight"
            active={editor.isActive('highlight')}
            onClick={() => highlightInputRef.current?.click()}
          >
            <span className="rte-swatch rte-swatch--highlight">A</span>
          </ToolbarButton>
        </span>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <IconQuote />
        </ToolbarButton>
        <ToolbarButton
          title="Link"
          active={editor.isActive('link')}
          onClick={setLink}
        >
          <IconLink />
        </ToolbarButton>
        <ToolbarButton title="Image" onClick={() => imageInputRef.current?.click()}>
          <IconImage />
        </ToolbarButton>
        <input
          ref={imageInputRef}
          type="file"
          className="rte-color-input"
          accept="image/*"
          aria-hidden
          tabIndex={-1}
          onChange={onImageFile}
        />
        <ToolbarButton
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <IconCode />
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title="Bulleted list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <IconListBullet />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <IconListNumber />
        </ToolbarButton>
        <ToolbarButton
          title="Outdent"
          disabled={!canLift}
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        >
          <IconOutdent />
        </ToolbarButton>
        <ToolbarButton
          title="Indent"
          disabled={!canSink}
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        >
          <IconIndent />
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <IconAlignLeft />
        </ToolbarButton>
        <ToolbarButton
          title="Center"
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <IconAlignCenter />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <IconAlignRight />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <IconAlignJustify />
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <IconHr />
        </ToolbarButton>
        <ToolbarButton title="Insert table" onClick={onOpenTableModal}>
          <IconTable />
        </ToolbarButton>
        {isInTable ? (
          <ToolbarButton
            title="Delete table"
            onClick={() => editor.chain().focus().deleteTable().run()}
          >
            🗑
          </ToolbarButton>
        ) : null}
        <ToolbarButton
          title="Radio options"
          active={editor.isActive('radioGroup')}
          onClick={onOpenRadioModal}
        >
          <IconRadio />
        </ToolbarButton>
        <ToolbarButton
          title="Drag & drop fill-in-the-blank"
          active={editor.isActive('dragDropFillBlank')}
          onClick={onOpenDragDropFillModal}
        >
          <IconDragDropFill />
        </ToolbarButton>
        <ToolbarButton title="Blank (____)" onClick={onInsertBlank}>
          <IconBlank />
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group rte-toolbar__group--history">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>

      <span className="rte-toolbar__sep" aria-hidden />

      <div className="rte-toolbar__group">
        <ToolbarButton
          title={expanded ? 'Collapse' : 'Full width'}
          active={expanded}
          onClick={onToggleExpand}
        >
          <IconExpandEditor />
        </ToolbarButton>
      </div>
      </div>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter text…',
  minHeight = 200,
  maxHeight = 500,
  readOnly = false,
  priorQuestionHtml = [],
}: RichTextEditorProps) {
  const [, setToolbarTick] = useState(0)
  const toolbarRafRef = useRef<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [radioModalOpen, setRadioModalOpen] = useState(false)
  const [radioDefaultQuestionNumber, setRadioDefaultQuestionNumber] = useState(1)
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [dragDropFillModalOpen, setDragDropFillModalOpen] = useState(false)
  const [dragDropDefaultStartNumber, setDragDropDefaultStartNumber] = useState(1)
  const [blankAnswerOpen, setBlankAnswerOpen] = useState(false)
  const [blankDefaultId, setBlankDefaultId] = useState('Q1')
  const textColorRef = useRef<HTMLInputElement>(null)
  const highlightRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const lastEmittedHtmlRef = useRef<string | null>(null)
  const instanceId = useId()
  const scheduleToolbarRefresh = useCallback(() => {
    if (toolbarRafRef.current != null) return
    toolbarRafRef.current = window.requestAnimationFrame(() => {
      toolbarRafRef.current = null
      setToolbarTick((n) => n + 1)
    })
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // We add custom Link/Underline extensions below; disable in StarterKit to avoid duplicates.
        link: false,
        underline: false,
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: 'rte-bullet-list' } },
        orderedList: { HTMLAttributes: { class: 'rte-ordered-list' } },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote'] }),
      ResizableImage.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: 'rte-img' } }),
      Table.configure({
        resizable: true,
        handleWidth: 6,
        cellMinWidth: 40,
        lastColumnResizable: true,
        HTMLAttributes: { class: 'rte-table-wrap' },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      RadioGroup,
      DragDropFillBlank,
      BlankAnswer,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editable: !readOnly,
    onUpdate: ({ editor: ed }) => {
      const html = patchDragDropAttrsInHtml(ed.getHTML(), ed)
      lastEmittedHtmlRef.current = html
      onChange(html)
      scheduleToolbarRefresh()
    },
    onSelectionUpdate: () => {
      scheduleToolbarRefresh()
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        spellcheck: 'true',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!readOnly)
  }, [editor, readOnly])

  useEffect(() => {
    return () => {
      if (toolbarRafRef.current != null) {
        cancelAnimationFrame(toolbarRafRef.current)
        toolbarRafRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!editor) return
    const next = repairDragDropGapsInHtml(value || '<p></p>')
    const current = patchDragDropAttrsInHtml(editor.getHTML(), editor)
    if (current === next) {
      lastEmittedHtmlRef.current = next
      return
    }
    if (next === lastEmittedHtmlRef.current) return
    editor.commands.setContent(next, { emitUpdate: false })
    lastEmittedHtmlRef.current = next
  }, [editor, value])

  // Row height resize for tables (drag near bottom border)
  useEffect(() => {
    if (!editor) return

    const root = editor.view.dom as HTMLElement
    let dragging = false
    let startY = 0
    let startHeight = 0
    let activeRow: HTMLTableRowElement | null = null
    let activePointerId: number | null = null

    const EDGE_PX = 7
    const MIN_ROW_HEIGHT = 24

    const isNearBottomEdge = (cell: HTMLElement, clientY: number) => {
      const rect = cell.getBoundingClientRect()
      return rect.bottom - clientY >= 0 && rect.bottom - clientY <= EDGE_PX
    }

    const setRowHeight = (row: HTMLTableRowElement, px: number) => {
      const safe = Math.max(MIN_ROW_HEIGHT, Math.round(px))
      Array.from(row.cells).forEach((cell) => {
        ;(cell as HTMLElement).style.height = `${safe}px`
        ;(cell as HTMLElement).style.minHeight = `${safe}px`
      })
    }

    const cellAtPointer = (clientX: number, clientY: number) => {
      const el = document.elementFromPoint(clientX, clientY)
      if (!(el instanceof HTMLElement)) return null
      return el.closest('td,th') as HTMLElement | null
    }

    const onDragMove = (e: PointerEvent) => {
      if (!dragging || !activeRow) return
      if (activePointerId != null && e.pointerId !== activePointerId) return
      e.preventDefault()
      const next = startHeight + (e.clientY - startY)
      setRowHeight(activeRow, next)
    }

    const stopDrag = () => {
      dragging = false
      startY = 0
      startHeight = 0
      activeRow = null
      activePointerId = null
      root.classList.remove('rte-resize-row-cursor')
      window.removeEventListener('pointermove', onDragMove, true)
      window.removeEventListener('pointerup', stopDrag, true)
      window.removeEventListener('pointercancel', stopDrag, true)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (dragging && activeRow) {
        onDragMove(e)
        return
      }

      const cell = cellAtPointer(e.clientX, e.clientY)
      if (!cell) {
        root.classList.remove('rte-resize-row-cursor')
        return
      }
      if (isNearBottomEdge(cell, e.clientY)) {
        root.classList.add('rte-resize-row-cursor')
      } else {
        root.classList.remove('rte-resize-row-cursor')
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      const cell = cellAtPointer(e.clientX, e.clientY)
      if (!cell) return
      if (!isNearBottomEdge(cell, e.clientY)) return

      const row = cell.parentElement
      if (!(row instanceof HTMLTableRowElement)) return

      dragging = true
      activeRow = row
      activePointerId = e.pointerId
      startY = e.clientY

      const rect = cell.getBoundingClientRect()
      startHeight = rect.height

      // Prevent editor selection changes during resize
      e.preventDefault()
      cell.setPointerCapture?.(e.pointerId)
      root.classList.add('rte-resize-row-cursor')

      window.addEventListener('pointermove', onDragMove, { passive: false, capture: true })
      window.addEventListener('pointerup', stopDrag, { passive: true, capture: true })
      window.addEventListener('pointercancel', stopDrag, { passive: true, capture: true })
    }

    root.addEventListener('pointermove', onPointerMove, { passive: false, capture: true })
    root.addEventListener('pointerdown', onPointerDown, { passive: false, capture: true })

    return () => {
      root.removeEventListener('pointermove', onPointerMove, true)
      root.removeEventListener('pointerdown', onPointerDown, true)
      stopDrag()
    }
  }, [editor])

  useEffect(() => {
    if (!expanded) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded])

  const onTextColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!editor) return
      editor.chain().focus().setColor(e.target.value).run()
    },
    [editor],
  )

  const onHighlight = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!editor) return
      editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
    },
    [editor],
  )

  const onImageFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!editor) return
      const file = e.target.files?.[0]
      if (!file || !file.type.startsWith('image/')) {
        e.target.value = ''
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result as string
        editor.chain().focus().setImage({ src }).run()
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  const rootClassName = `rich-text-editor${expanded ? ' rte-root--expanded' : ''}`

  return (
    <>
      {expanded ? (
        <RichTextEditorExpandBackdrop
          aria-label="Close full-width mode"
          role="button"
          tabIndex={-1}
          onClick={() => setExpanded(false)}
        />
      ) : null}
      {!readOnly ? (
        <>
          {radioModalOpen ? (
            <RadioOptionsDialog
              open={radioModalOpen}
              defaultQuestionNumber={radioDefaultQuestionNumber}
              onClose={() => setRadioModalOpen(false)}
              onInsert={(questionNumber, questionText, options, correctValue) => {
                editor
                  .chain()
                  .focus()
                  .insertContent({
                    type: 'paragraph',
                    attrs: { class: 'rte-radio-question' },
                    content: [
                      {
                        type: 'text',
                        text: `Q${questionNumber} ${questionText}`,
                        marks: [{ type: 'bold' }],
                      },
                    ],
                  })
                  .insertRadioGroup(options, correctValue)
                  .run()
                setRadioModalOpen(false)
              }}
            />
          ) : null}
          {tableModalOpen ? (
            <TableInsertDialog
              open={tableModalOpen}
              onClose={() => setTableModalOpen(false)}
              onInsert={(rows, cols) => {
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows, cols, withHeaderRow: rows >= 2 })
                  .run()
                setTableModalOpen(false)
              }}
            />
          ) : null}
          {dragDropFillModalOpen ? (
            <DragDropFillBlankDialog
              open={dragDropFillModalOpen}
              defaultStartNumber={dragDropDefaultStartNumber}
              onClose={() => setDragDropFillModalOpen(false)}
              onInsert={(payload) => {
                editor.chain().focus().insertDragDropFillBlank(payload).run()
                setDragDropFillModalOpen(false)
              }}
            />
          ) : null}
          {blankAnswerOpen ? (
            <BlankAnswerDialog
              open={blankAnswerOpen}
              defaultId={blankDefaultId}
              onClose={() => setBlankAnswerOpen(false)}
              onInsert={(payload) => {
                editor.chain().focus().insertBlankAnswer(payload).insertContent(' ').run()
                setBlankAnswerOpen(false)
              }}
            />
          ) : null}
        </>
      ) : null}
      <RichTextEditorRoot
        className={rootClassName}
        style={
          {
            '--rte-min-height': `${minHeight}px`,
            '--rte-max-height': `${maxHeight}px`,
          } as CSSProperties
        }
        data-rich-editor={instanceId}
      >
        {!readOnly ? (
          <RichTextToolbar
            editor={editor}
            textColorInputRef={textColorRef}
            highlightInputRef={highlightRef}
            imageInputRef={imageRef}
            onTextColorPick={onTextColor}
            onHighlightPick={onHighlight}
            onImageFile={onImageFile}
            onOpenRadioModal={() => {
              setRadioDefaultQuestionNumber(resolveNextQuestionNumber(editor, priorQuestionHtml))
              setRadioModalOpen(true)
            }}
            onOpenTableModal={() => setTableModalOpen(true)}
            onOpenDragDropFillModal={() => {
              setDragDropDefaultStartNumber(resolveNextQuestionNumber(editor, priorQuestionHtml))
              setDragDropFillModalOpen(true)
            }}
            onInsertBlank={() => {
              const n = resolveNextQuestionNumber(editor, priorQuestionHtml)
              setBlankDefaultId(`Q${n}`)
              setBlankAnswerOpen(true)
            }}
            expanded={expanded}
            onToggleExpand={() => setExpanded((v) => !v)}
          />
        ) : null}
        {!readOnly ? <TableDeleteCorner editor={editor} /> : null}
        <Box className="rte-body">
          <EditorContent editor={editor} />
        </Box>
      </RichTextEditorRoot>
    </>
  )
}
