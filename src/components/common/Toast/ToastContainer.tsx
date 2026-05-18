import { ToastAlert, ToastSnackbar, ToastStack } from './Toast.styles'
import type { ToastItem } from '@/types/toast'

type ToastContainerProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null
  }

  return (
    <ToastStack>
      {toasts.map((toast) => (
        <ToastSnackbar
          key={toast.id}
          open
          autoHideDuration={toast.duration}
          onClose={(_, reason) => {
            if (reason === 'clickaway') {
              return
            }
            onDismiss(toast.id)
          }}
        >
          <ToastAlert
            onClose={() => onDismiss(toast.id)}
            severity={toast.severity}
            variant="filled"
            elevation={0}
          >
            {toast.message}
          </ToastAlert>
        </ToastSnackbar>
      ))}
    </ToastStack>
  )
}
