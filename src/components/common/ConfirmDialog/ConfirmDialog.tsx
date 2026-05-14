import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material'
import { Button } from '../Button'
import { ConfirmDialogRoot } from './ConfirmDialog.style'

export type ConfirmDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success' | 'info' | 'inherit'
  loading?: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
}

const ICON_MAP: Record<string, string> = {
  error: '⚠️',
  warning: '⚡',
  success: '✅',
  info: 'ℹ️',
  primary: '❓',
  inherit: '❓',
}

function getIconVariant(color: string): string {
  if (color === 'error' || color === 'warning' || color === 'success' || color === 'info' || color === 'primary') {
    return color
  }
  return 'primary'
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  loading = false,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    void onConfirm()
  }

  const iconVariant = getIconVariant(confirmColor)

  return (
    <ConfirmDialogRoot
      open={open}
      onClose={(_event, reason) => {
        if (loading && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
          return
        }
        onClose()
      }}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-description' : undefined}
    >
      <Box className="confirm-dialog__header">
        <Box className={`confirm-dialog__icon-wrap confirm-dialog__icon-wrap--${iconVariant}`}>
          <span className="confirm-dialog__icon">{ICON_MAP[confirmColor] ?? '❓'}</span>
        </Box>
        <Typography id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </Typography>
      </Box>

      {description ? (
        <DialogContent className="confirm-dialog__body">
          <DialogContentText id="confirm-dialog-description" className="confirm-dialog__description">
            {description}
          </DialogContentText>
        </DialogContent>
      ) : null}

      <DialogActions className="confirm-dialog__actions">
        <Button
          variant="secondary"
          className="confirm-dialog__cancel-btn"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmColor === 'error' ? 'danger' : 'primary'}
          className="confirm-dialog__confirm-btn"
          onClick={handleConfirm}
          disabled={loading}
          loading={loading}
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </ConfirmDialogRoot>
  )
}
