import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { ToastContainer } from './ToastContainer'
import { ToastContext } from './toastContext'
import type { ToastItem, ToastOptions, ToastSeverity } from '@/types/toast'

const DEFAULT_DURATION = 4500

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const enqueue = useCallback(
    (message: string, severity: ToastSeverity, options?: ToastOptions) => {
      const item: ToastItem = {
        id: createToastId(),
        message,
        severity,
        duration: options?.duration ?? DEFAULT_DURATION,
      }
      setToasts((prev) => [...prev, item])
    },
    [],
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
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
