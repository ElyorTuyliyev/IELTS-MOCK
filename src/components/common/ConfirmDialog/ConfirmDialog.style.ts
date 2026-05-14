import styled from '@emotion/styled'
import { Dialog } from '@mui/material'

import theme, { tokens, c } from '@/theme'
export const ConfirmDialogRoot = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 22px;
    border: 1px solid ${c.border.default};
    overflow: hidden;
    box-shadow: ${tokens.shadows.dialogLg}, ${tokens.shadows.sm};
  }

  .confirm-dialog__header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    padding: 28px 28px 16px;
  }

  .confirm-dialog__icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .confirm-dialog__icon-wrap--error {
    background: linear-gradient(135deg, ${c.error.bg} 0%, ${c.error.border} 100%);
    border: 1px solid ${c.error.borderStrong};
  }

  .confirm-dialog__icon-wrap--warning {
    background: linear-gradient(135deg, ${c.warning.bg} 0%, ${c.warning.highlight} 100%);
    border: 1px solid ${c.warning.highlightStrong};
  }

  .confirm-dialog__icon-wrap--primary {
    background: ${c.gradient.modalHeader};
    border: 1px solid ${c.primary.tintBorder};
  }

  .confirm-dialog__icon-wrap--success {
    background: linear-gradient(135deg, ${c.success.bgLight} 0%, ${c.success.border} 100%);
    border: 1px solid ${c.success.border};
  }

  .confirm-dialog__icon-wrap--info {
    background: linear-gradient(135deg, ${c.info.bgMuted} 0%, ${c.info.border} 100%);
    border: 1px solid ${c.info.borderSoft};
  }

  .confirm-dialog__icon {
    font-size: 22px;
    line-height: 1;
  }

  .confirm-dialog__title {
    font-size: 1.2rem;
    font-weight: 800;
    color: ${c.text.primary};
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  .confirm-dialog__body {
    padding: 0 28px 8px;
  }

  .confirm-dialog__description {
    font-size: 15px;
    color: ${c.text.secondary};
    line-height: 1.55;
  }

  .confirm-dialog__actions {
    padding: 12px 28px 24px;
    gap: ${theme.spacing(1.25)};
  }

  .confirm-dialog__cancel-btn.MuiButton-root {
    min-height: 44px;
    padding: 0 22px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    border-color: ${c.slate[300]};
    color: ${c.text.muted};
  }

  .confirm-dialog__cancel-btn.MuiButton-root:hover {
    background: ${c.surface.muted};
    border-color: ${c.slate[400]};
  }

  .confirm-dialog__confirm-btn.MuiButton-root {
    min-height: 44px;
    padding: 0 24px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 700;
    font-size: 15px;
    box-shadow: ${tokens.shadows.md};
  }

  .confirm-dialog__confirm-btn.MuiButton-root:hover {
    box-shadow: ${tokens.shadows.dialog};
  }

  .confirm-dialog__confirm-btn.MuiButton-root.Mui-disabled {
    opacity: 0.7;
  }
`
