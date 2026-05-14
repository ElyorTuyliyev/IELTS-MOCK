import styled from '@emotion/styled'
import { Alert, Snackbar } from '@mui/material'

import { tokens } from '../../../theme/tokens'

export const ToastSnackbar = styled(Snackbar)`
  &.MuiSnackbar-root {
    top: 24px;
    right: 24px;
    left: auto;
    bottom: auto;
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
