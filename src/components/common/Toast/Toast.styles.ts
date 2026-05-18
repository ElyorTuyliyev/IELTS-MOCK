import styled from '@emotion/styled'
import { Alert, Snackbar } from '@mui/material'

import { tokens } from '../../../theme/tokens'

export const ToastStack = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`

export const ToastSnackbar = styled(Snackbar)`
  &.MuiSnackbar-root {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    bottom: auto;
    transform: none;
  }
`

export const ToastAlert = styled(Alert)`
  min-width: 280px;
  max-width: min(420px, calc(100vw - 48px));
  border-radius: 12px;
  box-shadow: ${tokens.shadows.toast};
  font-weight: 500;
  align-items: center;

  .MuiAlert-icon {
    font-size: 20px;
  }

  .MuiAlert-message {
    padding: 2px 0;
    line-height: 1.45;
  }
`
