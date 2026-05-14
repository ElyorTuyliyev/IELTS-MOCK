export type ToastSeverity = 'success' | 'error' | 'warning' | 'info'

export type ToastItem = {
  id: string
  message: string
  severity: ToastSeverity
  duration: number
}

export type ToastOptions = {
  duration?: number
}

export type ToastApi = {
  show: (message: string, severity?: ToastSeverity, options?: ToastOptions) => void
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  warning: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
}
