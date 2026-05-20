import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  EXAM_HIGHLIGHT_DEFAULT_COLOR,
  type ExamHighlightColor,
} from '../constants/examHighlight'
import {
  applyHighlightToRange,
  getSelectionRangeInRoot,
  getToolbarPositionFromRange,
  removeHighlightsInRange,
  type ExamHighlightToolbarPosition,
} from '../utils/examTextHighlight'

const TOOLBAR_SELECTOR = '.student-exam-player__highlight-toolbar'
const IGNORE_CLICK_SELECTOR =
  'button, input, textarea, select, .student-exam-player__nav-btn, .student-exam-player__q-chip, .student-exam-player__part-tab, .student-exam-player__resize-handle'

type UseExamTextHighlightOptions = {
  rootRef: RefObject<HTMLElement | null>
  enabled?: boolean
  bindKey?: string
}

export function useExamTextHighlight({
  rootRef,
  enabled = true,
  bindKey = '',
}: UseExamTextHighlightOptions) {
  const [activeColor, setActiveColor] = useState<ExamHighlightColor>(EXAM_HIGHLIGHT_DEFAULT_COLOR)
  const [toolbarOpen, setToolbarOpen] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState<ExamHighlightToolbarPosition | null>(null)
  const savedRangeRef = useRef<Range | null>(null)

  const syncToolbarFromSelection = useCallback(() => {
    const root = rootRef.current
    if (!root || !enabled) {
      setToolbarOpen(false)
      setToolbarPosition(null)
      savedRangeRef.current = null
      return
    }

    const range = getSelectionRangeInRoot(root)
    if (!range) {
      setToolbarOpen(false)
      setToolbarPosition(null)
      savedRangeRef.current = null
      return
    }

    savedRangeRef.current = range.cloneRange()
    setToolbarPosition(getToolbarPositionFromRange(range))
    setToolbarOpen(true)
  }, [bindKey, enabled, rootRef])

  const dismissToolbar = useCallback(() => {
    setToolbarOpen(false)
    setToolbarPosition(null)
    savedRangeRef.current = null
  }, [])

  const applyColorToSavedSelection = useCallback(
    (color: ExamHighlightColor) => {
      const root = rootRef.current
      if (!root || !enabled) return

      const range = savedRangeRef.current ?? getSelectionRangeInRoot(root)
      if (!range) return

      applyHighlightToRange(range, color)
      window.getSelection()?.removeAllRanges()
      dismissToolbar()
    },
    [bindKey, dismissToolbar, enabled, rootRef],
  )

  useEffect(() => {
    if (!enabled) {
      dismissToolbar()
      return
    }

    const onSelectionChange = () => {
      window.requestAnimationFrame(syncToolbarFromSelection)
    }

    const onMouseUp = (event: MouseEvent) => {
      if (event.button !== 0) return
      const target = event.target
      if (target instanceof Element && target.closest(TOOLBAR_SELECTOR)) return
      if (target instanceof Element && target.closest(IGNORE_CLICK_SELECTOR)) return
      window.requestAnimationFrame(syncToolbarFromSelection)
    }

    const onScroll = () => {
      if (!savedRangeRef.current) return
      setToolbarPosition(getToolbarPositionFromRange(savedRangeRef.current))
    }

    const root = rootRef.current
    const scrollTargets: HTMLElement[] = root
      ? [
          root,
          ...Array.from(root.querySelectorAll<HTMLElement>('.student-exam-player__split-pane')),
        ]
      : []

    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('mouseup', onMouseUp)
    window.addEventListener('scroll', onScroll, true)
    for (const el of scrollTargets) {
      el.addEventListener('scroll', onScroll, { passive: true })
    }

    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('scroll', onScroll, true)
      for (const el of scrollTargets) {
        el.removeEventListener('scroll', onScroll)
      }
    }
  }, [bindKey, dismissToolbar, enabled, syncToolbarFromSelection])

  const clearSelectionHighlights = useCallback(() => {
    const root = rootRef.current
    if (!root || !enabled) return
    const range = savedRangeRef.current ?? getSelectionRangeInRoot(root)
    if (range) {
      removeHighlightsInRange(range, root)
      window.getSelection()?.removeAllRanges()
    }
    dismissToolbar()
  }, [bindKey, dismissToolbar, enabled, rootRef])

  const selectColor = useCallback(
    (color: ExamHighlightColor) => {
      setActiveColor(color)
      applyColorToSavedSelection(color)
    },
    [applyColorToSavedSelection],
  )

  return {
    activeColor,
    toolbarOpen,
    toolbarPosition,
    selectColor,
    clearSelectionHighlights,
    dismissToolbar,
  }
}
