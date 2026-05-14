import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export function useSplitResize(splitContainerRef: RefObject<HTMLDivElement | null>) {
  const [splitLeftWidth, setSplitLeftWidth] = useState(50)
  const isResizingRef = useRef(false)

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isResizingRef.current || !splitContainerRef.current) return
      const rect = splitContainerRef.current.getBoundingClientRect()
      if (rect.width <= 0) return
      const rawPercent = ((event.clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(75, Math.max(25, rawPercent))
      setSplitLeftWidth((prev) => (Math.abs(prev - clamped) < 0.1 ? prev : clamped))
    }

    const handlePointerUp = () => {
      isResizingRef.current = false
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [splitContainerRef])

  const startResize = useCallback(() => {
    isResizingRef.current = true
  }, [])

  return { splitLeftWidth, startResize } as const
}
