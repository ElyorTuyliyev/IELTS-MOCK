import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  attachDragDropBlockBehavior,
  captureDragDropValuesFromBlock,
  resolveDragDropQuestionDbId,
} from '../../../components/common/RichTextEditor/utils/dragDropBlockHydration'
import type { DisplayQuestion } from '../utils'
import type { ModuleName } from '../constants'

function collectDragDropBlocks(container: HTMLElement): HTMLElement[] {
  const blocks = new Set<HTMLElement>()
  container.querySelectorAll<HTMLElement>('[data-type="drag-drop-fill"]').forEach((el) => {
    blocks.add(el)
  })
  container.querySelectorAll<HTMLElement>('.rte-drag-drop-fill').forEach((el) => {
    if (!el.hasAttribute('data-type')) {
      el.setAttribute('data-type', 'drag-drop-fill')
    }
    blocks.add(el)
  })
  return Array.from(blocks)
}

function persistDragDropValuesFromContainers(
  containers: Array<HTMLElement | null>,
  fallbackQuestionDbId: string | undefined,
  valuesRef: { current: Record<string, string> },
) {
  for (const container of containers) {
    if (!container) continue
    collectDragDropBlocks(container).forEach((block, blockIndex) => {
      const questionDbId = resolveDragDropQuestionDbId(block, fallbackQuestionDbId)
      const blockKey = `dd-${questionDbId}-${blockIndex}`
      const captured = captureDragDropValuesFromBlock(block, blockKey)
      for (const [key, value] of Object.entries(captured)) {
        valuesRef.current[key] = value
      }
    })
  }
}

function hydrateContainers(
  containers: Array<HTMLElement | null>,
  fallbackQuestionDbId: string | undefined,
  valuesRef: { current: Record<string, string> },
  onValueChange: (key: string, value: string) => void,
): Array<() => void> {
  const cleanups: Array<() => void> = []

  for (const container of containers) {
    if (!container) continue
    collectDragDropBlocks(container).forEach((block, blockIndex) => {
      const questionDbId = resolveDragDropQuestionDbId(block, fallbackQuestionDbId)
      cleanups.push(
        attachDragDropBlockBehavior(block, {
          blockKey: `dd-${questionDbId}-${blockIndex}`,
          examMode: true,
          valuesRef,
          onValueChange,
        }),
      )
    })
  }

  return cleanups
}

export function useDragDropFillSync(
  activeModule: ModuleName,
  currentPartQuestions: DisplayQuestion[],
  listeningHtml: string | null,
  readingHtml: string | null,
  listeningContentRef: RefObject<HTMLDivElement | null>,
  moduleContentRef: RefObject<HTMLDivElement | null>,
  listeningInteractionReady = true,
) {
  const [dragDropValues, setDragDropValues] = useState<Record<string, string>>({})
  const dragDropValuesRef = useRef(dragDropValues)
  const fallbackQuestionDbId = currentPartQuestions[0]?.questionDbId

  useEffect(() => {
    dragDropValuesRef.current = dragDropValues
  }, [dragDropValues])

  const handleValueChange = useCallback((key: string, value: string) => {
    const next = { ...dragDropValuesRef.current }
    if (value) next[key] = value
    else delete next[key]
    dragDropValuesRef.current = next
    setDragDropValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
  }, [])

  const contentKey = `${activeModule}|${listeningInteractionReady}|${currentPartQuestions.map((q) => q.html ?? '').join('\u0001')}|${listeningHtml ?? ''}|${readingHtml ?? ''}`

  useEffect(() => {
    if (activeModule === 'listening' && !listeningInteractionReady) {
      return
    }

    let disposed = false
    let cleanups: Array<() => void> = []

    const runHydration = () => {
      if (disposed) return
      persistDragDropValuesFromContainers(
        [listeningContentRef.current, moduleContentRef.current],
        fallbackQuestionDbId,
        dragDropValuesRef,
      )
      cleanups.forEach((fn) => fn())
      cleanups = hydrateContainers(
        [listeningContentRef.current, moduleContentRef.current],
        fallbackQuestionDbId,
        dragDropValuesRef,
        handleValueChange,
      )
    }

    const frame = requestAnimationFrame(runHydration)

    const retryDelays = [50, 150]
    const retryTimers = retryDelays.map((delay) =>
      window.setTimeout(() => {
        if (disposed) return
        const hasBlocks = [listeningContentRef.current, moduleContentRef.current].some(
          (container) => container && collectDragDropBlocks(container).length > 0,
        )
        if (hasBlocks) return
        runHydration()
      }, delay),
    )

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      retryTimers.forEach((timer) => window.clearTimeout(timer))
      cleanups.forEach((fn) => fn())
    }
  }, [activeModule, contentKey, fallbackQuestionDbId, handleValueChange, listeningContentRef, listeningInteractionReady, moduleContentRef, readingHtml])

  return { dragDropValues } as const
}
