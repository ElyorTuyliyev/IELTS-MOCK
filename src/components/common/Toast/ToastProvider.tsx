import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { ToastContainer } from './ToastContainer'
import { ToastContext } from './toastContext'
import type { ToastItem, ToastOptions, ToastSeverity } from '@/types/toast'

const DEFAULT_DURATION = 4500

export function ToastProvider({ children }: { children: ReactNode }) {
  const queueRef = useRef<ToastItem[]>([])
  const activeRef = useRef<ToastItem | null>(null)
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  const pumpQueue = useCallback(() => {
    if (activeRef.current) {
      return
    }

    const next = queueRef.current.shift() ?? null
    setPendingCount(queueRef.current.length)
    activeRef.current = next
    setActiveToast(next)
  }, [])

  const enqueue = useCallback(
    (message: string, severity: ToastSeverity, options?: ToastOptions) => {
      queueRef.current.push({
        id: createToastId(),
        message,
        severity,
        duration: options?.duration ?? DEFAULT_DURATION,
      })
      setPendingCount(queueRef.current.length)
      pumpQueue()
    },
    [pumpQueue],
  )

  const show = useCallback(
    (message: string, severity: ToastSeverity = 'info', options?: ToastOptions) => {
      enqueue(message, severity, options)
    },
    [enqueue],
  )

  const success = useCallback(
    (message: string, options?: ToastOptions) => enqueue(message, 'success', options),
    [enqueue],
  )

  const error = useCallback(
    (message: string, options?: ToastOptions) => enqueue(message, 'error', options),
    [enqueue],
  )

  const warning = useCallback(
    (message: string, options?: ToastOptions) => enqueue(message, 'warning', options),
    [enqueue],
  )

  const info = useCallback(
    (message: string, options?: ToastOptions) => enqueue(message, 'info', options),
    [enqueue],
  )

  const dismissActive = useCallback(() => {
    activeRef.current = null
    setActiveToast(null)
    window.setTimeout(pumpQueue, 150)
  }, [pumpQueue])

  const value = useMemo(
    () => ({
      show,
      success,
      error,
      warning,
      info,
    }),
    [show, success, error, warning, info],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toast={activeToast} onClose={dismissActive} pendingCount={pendingCount} />
    </ToastContext.Provider>
  )
}

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
