import { ToastAlert, ToastSnackbar } from './Toast.styles'
import type { ToastItem } from '@/types/toast'

type ToastContainerProps = {
  toast: ToastItem | null
  pendingCount: number
  onClose: () => void
}

export function ToastContainer({ toast, pendingCount, onClose }: ToastContainerProps) {
  return (
    <ToastSnackbar
      key={toast?.id}
      open={Boolean(toast)}
      autoHideDuration={toast?.duration}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return
        }
        onClose()
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {toast ? (
        <ToastAlert
          onClose={onClose}
          severity={toast.severity}
          variant="filled"
          elevation={0}
        >
          {toast.message}
          {pendingCount > 0 ? ` (+${pendingCount} more)` : ''}
        </ToastAlert>
      ) : undefined}
    </ToastSnackbar>
  )
}
